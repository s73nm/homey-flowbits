import type { FlowCard } from 'homey';
import { BaseAutocompleteProvider } from '../base';
import { autocomplete } from '../decorator';

@autocomplete('slider')
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
                description: this.translate('autocomplete.slider_new')
            });
        }

        return results;
    }

    async update(): Promise<void> {
        this.#values = await Promise
            .allSettled([
                await this.getActionCard('slider_set').getArgumentValues(),
                await this.getTriggerCard('slider_changed').getArgumentValues()
            ])
            .then(allValues => allValues
                .filter(values => values.status === 'fulfilled')
                .map(values => values.value)
                .reduce((acc, curr) => acc.concat(curr))
                .map(value => value.slider.name)
                .filter((value, index, arr) => arr.indexOf(value) === index));
    }
}
