import { Shortcuts } from '@basmilius/homey-common';
import { AutocompleteProviders } from '../flow';
import type { FlowBitsApp } from '../types';
import { searchIcons } from '../util';

export default class extends Shortcuts<FlowBitsApp> {
    async initialize(): Promise<void> {
        await this.#initializeEvent();
        await this.#initializeFlagOnOff();
        await this.#initializeFlags();
        await this.#initializeLabel();
        await this.#initializeSlider();
        await this.#initializeTimer();
    }

    async getSliderValue(sliderName: string): Promise<number | null> {
        return await this.app.sliders.getValue(sliderName);
    }

    async setSliderValue(sliderName: string, value: number, widgetId?: string): Promise<void> {
        await this.app.sliders.setValue(sliderName, value, widgetId);
    }

    async #initializeEvent(): Promise<void> {
        const widget = this.dashboards.getWidget('event');

        widget.registerSettingAutocompleteListener('event', async () => {
            const events = await this.app.api.getEvents();

            return events.map(event => ({
                name: event.name
            }));
        });
    }

    async #initializeFlagOnOff(): Promise<void> {
        const widget = this.dashboards.getWidget('flag_onoff');

        widget.registerSettingAutocompleteListener('flag', async () => {
            const flags = await this.app.api.getFlags();

            return flags.map(flag => ({
                name: flag.name
            }));
        });
    }

    async #initializeFlags(): Promise<void> {
        const widget = this.dashboards.getWidget('flags');

        widget.registerSettingAutocompleteListener('filter', async (query: string) => {
            const flags = await this.app.flags.findAll();
            const allNames = Array
                .from(new Set(flags.map(f => f.name.trim())))
                .toSorted((a, b) => a.localeCompare(b));

            const canonicalize = (token: string): string => {
                const trimmed = token.trim();
                if (!trimmed) return trimmed;
                return canonicalByLower.get(normalize(trimmed)) ?? trimmed;
            };

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

            const makeLabel = (items: string[]) => items.join(', ');

            const parseFlagsFromLabel = (label: string): string[] =>
                splitTokens(label).map(canonicalize);

            const q = query.trim();
            const MAX_RESULTS = 200;

            const noFilterItem = {
                name: '–',
                flags: [] as string[]
            };

            const wrap = (labels: string[]) => [
                noFilterItem,
                ...labels
                    .slice(0, MAX_RESULTS - 1)
                    .map(name => ({
                        name,
                        flags: parseFlagsFromLabel(name)
                    }))
            ];

            const pushSubsets = (source: string[], minLen: number, prefix: string[] = [], start = 0, acc: string[] = [], out: string[] = []) => {
                for (let i = start; i < source.length && out.length < MAX_RESULTS; i++) {
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
                pushSubsets(allNames, 2, [], 0, [], labels);

                return wrap(labels);
            }

            const hasComma = q.includes(',');

            if (!hasComma) {
                const qLower = normalize(q);
                const firstCandidates = allNames.filter(name => normalize(name).startsWith(qLower));

                for (const first of firstCandidates) {
                    if (labels.length >= MAX_RESULTS) {
                        break;
                    }

                    labels.push(first);

                    const remaining = allNames.filter(n => n !== first);
                    pushSubsets(remaining, 2, [first], 0, [], labels);
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
                if (labels.length >= MAX_RESULTS) break;
                labels.push(makeLabel([...chosen, candidate]));
            }

            return wrap(labels);
        });
    }

    async #initializeLabel(): Promise<void> {
        const widget = this.dashboards.getWidget('label');

        widget.registerSettingAutocompleteListener('label', async () => {
            const labels = await this.app.api.getLabels();

            return labels.map(label => ({
                name: label.name
            }));
        });
    }

    async #initializeSlider(): Promise<void> {
        const autocompleteProvider = this.registry.findAutocompleteProvider(AutocompleteProviders.Slider);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the slider autocomplete provider.');
        }

        const widget = this.dashboards.getWidget('slider');

        widget.registerSettingAutocompleteListener('slider', async (query) => {
            const sliders = await autocompleteProvider.find(query);

            return sliders.map(slider => ({
                name: slider.name
            }));
        });

        widget.registerSettingAutocompleteListener('icon', searchIcons);
    }

    async #initializeTimer(): Promise<void> {
        const widget = this.dashboards.getWidget('timer');

        widget.registerSettingAutocompleteListener('timer', async () => {
            const timers = await this.app.api.getTimers();

            return timers.map(timer => ({
                name: timer.name
            }));
        });
    }
}
