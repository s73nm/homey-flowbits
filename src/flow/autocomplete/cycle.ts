import type { FlowCard } from 'homey';
import { BaseAutocompleteProvider } from '../base';
import { autocomplete } from '../decorator';

@autocomplete('cycle')
export default class extends BaseAutocompleteProvider {
    #values: string[] = [];

    async find(query: string): Promise<FlowCard.ArgumentAutocompleteResults> {
        await this.update();

        const hasQuery = query.trim().length > 0;

        const results: FlowCard.ArgumentAutocompleteResults = this.#values
            .filter(name => !hasQuery || name.toLowerCase().includes(query.toLowerCase()))
            .map(name => ({name}))
            .sort((a, b) => a.name.localeCompare(b.name));

        if (hasQuery && !this.#values.some(name => query === name)) {
            results.push({
                name: query,
                description: this.translate('autocomplete.cycle_new')
            });
        }

        return results;
    }

    async update(): Promise<void> {
        this.#values = await Promise
            .allSettled([
                await this.getActionCard('cycle').getArgumentValues(),
                await this.getActionCard('cycle_between').getArgumentValues(),
                await this.getActionCard('cycle_to').getArgumentValues(),
                await this.getConditionCard('cycle_has_value').getArgumentValues(),
                await this.getTriggerCard('cycle_becomes').getArgumentValues(),
                await this.getTriggerCard('cycle_updates').getArgumentValues()
            ])
            .then(allValues => allValues
                .filter(values => values.status === 'fulfilled')
                .map(values => values.value)
                .reduce((acc, curr) => acc.concat(curr))
                .map(value => value.name.name)
                .filter((value, index, arr) => arr.indexOf(value) === index));
    }
}
