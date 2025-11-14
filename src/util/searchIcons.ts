import type { Icon } from '../types';
import icons from '../../assets/app/icons.json';

export default async function (query: string): Promise<Icon[]> {
    const normalizedQuery = query.toLowerCase().trim();

    return icons
        .filter(icon => normalizedQuery.length === 0 || icon[1].toLowerCase().includes(normalizedQuery))
        .slice(0, 50)
        .map(icon => ({
            id: icon[0],
            name: icon[1],
            unicode: icon[2]
        }));
}
