import { autocomplete, FlowAutocompleteProvider } from '@basmilius/homey-common';
import type { FlowCard } from 'homey';
import type { FlowBitsApp } from '../../types';

@autocomplete('flag')
export default class extends FlowAutocompleteProvider<FlowBitsApp> {
    #values: string[] = [];

    async find(query: string): Promise<FlowCard.ArgumentAutocompleteResults> {
        const hasQuery = query.trim().length > 0;

        const results: FlowCard.ArgumentAutocompleteResults = this.#values
            .filter(name => !hasQuery || name.toLowerCase().includes(query.toLowerCase()))
            .map(name => ({name}))
            .sort((a, b) => a.name.localeCompare(b.name));

        if (hasQuery && !this.#values.some(name => query === name)) {
            results.unshift({
                name: query,
                description: this.translate('autocomplete.flag_new')
            });
        }

        return results;
    }

    async update(): Promise<void> {
        this.#values = await Promise
            .allSettled([
                await this.flow.getActionCard('flag_activate').getArgumentValues(),
                await this.flow.getActionCard('flag_deactivate').getArgumentValues(),
                await this.flow.getConditionCard('flag_is').getArgumentValues(),
                await this.flow.getTriggerCard('flag_activated').getArgumentValues(),
                await this.flow.getTriggerCard('flag_changed').getArgumentValues(),
                await this.flow.getTriggerCard('flag_deactivated').getArgumentValues()
            ])
            .then(allValues => allValues
                .filter(values => values.status === 'fulfilled')
                .map(values => values.value)
                .reduce((acc, curr) => acc.concat(curr))
                .map(value => value.flag.name)
                .filter((value, index, arr) => arr.indexOf(value) === index));
    }
}
