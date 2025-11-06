import type { FlowCard } from 'homey';
import { BaseAutocompleteProvider } from '../base';
import { autocomplete } from '../decorator';

import schoolHolidays from '../../data/schoolHolidays';

@autocomplete('schoolVacation')
export default class extends BaseAutocompleteProvider {
    async find(query: string): Promise<FlowCard.ArgumentAutocompleteResults> {
        const hasQuery = query.trim().length > 0;

        return schoolHolidays
            .reduce<string[]>((acc, curr) => acc.concat(...curr.vacations.map(v => v.type)), [])
            .filter((value, index, arr) => arr.indexOf(value) === index)
            .filter(name => !hasQuery || name.toLowerCase().includes(query.toLowerCase()))
            .map(name => ({name}))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    async update(): Promise<void> {
    }
}
