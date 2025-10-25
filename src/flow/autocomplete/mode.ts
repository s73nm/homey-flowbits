import type { FlowCard } from 'homey';
import { BaseAutocompleteProvider } from '../base';

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
            results.unshift({
                name: query,
                description: this.homey.__('autocomplete.mode_new')
            });
        }

        return results;
    }

    async update(): Promise<void> {
        this.#values = await Promise
            .allSettled([
                await this.homey.flow.getActionCard('mode_activate').getArgumentValues(),
                await this.homey.flow.getActionCard('mode_deactivate').getArgumentValues(),
                await this.homey.flow.getConditionCard('mode_is').getArgumentValues(),
                await this.homey.flow.getTriggerCard('mode_activated').getArgumentValues(),
                await this.homey.flow.getTriggerCard('mode_deactivated').getArgumentValues()
            ])
            .then(allValues => allValues
                .filter(values => values.status === 'fulfilled')
                .map(values => values.value)
                .reduce((acc, curr) => acc.concat(curr))
                .map(value => value.name.name)
                .filter((value, index, arr) => arr.indexOf(value) === index));
    }
}
