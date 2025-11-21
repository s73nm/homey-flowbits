import type { Language } from '@basmilius/homey-common';
import { icons } from '@basmilius/homey-common';
import type { Look } from '../types';

import knownModes from '../../assets/app/modes.json';

export default async function (name: string, language: Language, prefix: string, suffix: string): Promise<Look | null> {
    let normalized = name.toLowerCase();
    normalized = normalized.startsWith(prefix) ? normalized.substring(prefix.length) : normalized;
    normalized = normalized.endsWith(suffix) ? normalized.substring(0, normalized.length - suffix.length) : normalized;

    const candidate = knownModes.find(item => (item[language] ?? item.en).includes(normalized));

    if (candidate) {
        const icon = icons.find(icon => icon.id === candidate.icon);

        if (icon) {
            return [candidate.color, icon.unicode];
        }
    }

    return null;
}
