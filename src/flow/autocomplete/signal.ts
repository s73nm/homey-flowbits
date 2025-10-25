import type { FlowCard, FlowCardAction, FlowCardTrigger } from 'homey';
import { BaseAutocompleteProvider } from '../base';

export default class extends BaseAutocompleteProvider {
    #sendSignalAction!: FlowCardAction;
    #receiveSignalTrigger!: FlowCardTrigger;

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
                description: this.homey.__('autocomplete.signal_new')
            });
        }

        return results;
    }

    async update(): Promise<void> {
        this.#values = await Promise
            .allSettled([
                await this.#sendSignalAction.getArgumentValues(),
                await this.#receiveSignalTrigger.getArgumentValues()
            ])
            .then(allValues => allValues
                .filter(values => values.status === 'fulfilled')
                .map(values => values.value)
                .reduce((acc, curr) => acc.concat(curr))
                .map(value => value.signal.name)
                .filter((value, index, arr) => arr.indexOf(value) === index));
    }

    async onInit(): Promise<void> {
        this.#sendSignalAction = this.homey.flow.getActionCard('signal_send');
        this.#receiveSignalTrigger = this.homey.flow.getTriggerCard('signal_receive');

        return super.onInit();
    }
}
