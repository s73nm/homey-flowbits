import type { Icon } from '@basmilius/homey-common';
import { icons } from '@basmilius/homey-common';

export default async function (query: string): Promise<Icon[]> {
    const normalizedQuery = query.toLowerCase().trim();

    return icons
        .filter(icon => normalizedQuery.length === 0 || icon.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 50);
}
