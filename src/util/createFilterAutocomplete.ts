export type FilterAutocompleteResult<T extends Record<string, unknown>> = T & {
    readonly name: string;
};

export type FilterAutocompleteOptions<T extends Record<string, unknown>> = {
    readonly itemsField: keyof T;
    readonly maxResults?: number;
    readonly minSubsetLength?: number;
    readonly noSelectionLabel?: string;
};

export default function createFilterAutocomplete<T extends Record<string, unknown>>(
    allNames: string[],
    query: string,
    options: FilterAutocompleteOptions<T>
): FilterAutocompleteResult<T>[] {
    const {
        itemsField,
        maxResults = 200,
        minSubsetLength = 2,
        noSelectionLabel = '–'
    } = options;

    const normalize = (s: string) => s.toLocaleLowerCase();

    const splitTokens = (s: string): string[] => s
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

    const canonicalByLower = new Map<string, string>();
    for (const name of allNames) {
        const key = normalize(name);
        if (!canonicalByLower.has(key)) {
            canonicalByLower.set(key, name);
        }
    }

    const canonicalize = (token: string): string => {
        const trimmed = token.trim();
        if (!trimmed) return trimmed;
        return canonicalByLower.get(normalize(trimmed)) ?? trimmed;
    };

    const makeLabel = (items: string[]) => items.join(', ');

    const parseItemsFromLabel = (label: string): string[] =>
        splitTokens(label).map(canonicalize);

    const q = query.trim();

    const noFilterItem = {
        name: noSelectionLabel,
        [itemsField]: [] as string[]
    } as FilterAutocompleteResult<T>;

    const wrap = (labels: string[]): FilterAutocompleteResult<T>[] => [
        noFilterItem,
        ...labels
            .slice(0, maxResults - 1)
            .map(name => ({
                name,
                [itemsField]: parseItemsFromLabel(name)
            } as FilterAutocompleteResult<T>))
    ];

    const pushSubsets = (
        source: string[],
        minLen: number,
        prefix: string[] = [],
        start = 0,
        acc: string[] = [],
        out: string[] = []
    ): string[] => {
        for (let i = start; i < source.length && out.length < maxResults; i++) {
            acc.push(source[i]);

            const items = [...prefix, ...acc];

            if (items.length >= minLen) {
                out.push(makeLabel(items));
            }

            pushSubsets(source, minLen, prefix, i + 1, acc, out);
            acc.pop();
        }

        return out;
    };

    const labels: string[] = [];

    if (q.length === 0) {
        pushSubsets(allNames, minSubsetLength, [], 0, [], labels);
        return wrap(labels);
    }

    const hasComma = q.includes(',');

    if (!hasComma) {
        const qLower = normalize(q);
        const firstCandidates = allNames.filter(name => normalize(name).startsWith(qLower));

        for (const first of firstCandidates) {
            if (labels.length >= maxResults) break;

            labels.push(first);

            const remaining = allNames.filter(n => n !== first);
            pushSubsets(remaining, minSubsetLength, [first], 0, [], labels);
        }

        return wrap(labels);
    }

    const parts = splitTokens(q);
    const chosen = parts.slice(0, -1).map(canonicalize);
    const partial = (parts.at(-1) ?? '').trim();

    const chosenSet = new Set(chosen.map(normalize));
    const available = allNames.filter(name => !chosenSet.has(normalize(name)));

    const partialLower = normalize(partial);
    const filtered = partialLower.length === 0
        ? available
        : available.filter(name => normalize(name).startsWith(partialLower));

    for (const candidate of filtered) {
        if (labels.length >= maxResults) break;
        labels.push(makeLabel([...chosen, candidate]));
    }

    return wrap(labels);
}
