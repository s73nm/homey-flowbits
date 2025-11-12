import icons from '../../assets/app/icons.json';

type Result = {
    readonly id: string;
    readonly name: string;
    readonly unicode: string;
};

export default async function (query: string): Promise<Result[]> {
    const normalizedQuery = query.toLowerCase().trim();

    return icons
        .filter(icon => normalizedQuery.length === 0 || icon[1].toLowerCase().includes(normalizedQuery))
        .slice(0, 50)
        .map(icon => ({
            id: icon[0],
            name: icon[1],
            unicode: JSON.stringify(icon[2]),
            unicodeSecondary: JSON.stringify(icon[2] + icon[2])
        }));
}
