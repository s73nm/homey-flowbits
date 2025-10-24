import type { FlowCard, FlowCardAction, FlowCardCondition, FlowCardTrigger } from 'homey';
import { BaseAutocompleteProvider } from '../base';

export default class extends BaseAutocompleteProvider {
    #activateModeAction!: FlowCardAction;
    #deactivateModeAction!: FlowCardAction;
    #isModeCondition!: FlowCardCondition;
    #modeActivatedTrigger!: FlowCardTrigger;
    #modeDeactivatedTrigger!: FlowCardTrigger;

    #values: string[] = [];

    async find(query: string): Promise<FlowCard.ArgumentAutocompleteResults> {
        await this.update();

        const hasQuery = query.trim().length > 0;

        const results: FlowCard.ArgumentAutocompleteResults = this.#values
            // .filter(name => !hasQuery || name.toLowerCase().includes(query.toLowerCase()))
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
                await this.#activateModeAction.getArgumentValues(),
                await this.#deactivateModeAction.getArgumentValues(),
                await this.#isModeCondition.getArgumentValues(),
                await this.#modeActivatedTrigger.getArgumentValues(),
                await this.#modeDeactivatedTrigger.getArgumentValues()
            ])
            .then(allValues => allValues
                .filter(values => values.status === 'fulfilled')
                .map(values => values.value)
                .reduce((acc, curr) => acc.concat(curr))
                .map(value => value.name.name)
                .filter((value, index, arr) => arr.indexOf(value) === index));
    }

    async onInit(): Promise<void> {
        this.#activateModeAction = this.homey.flow.getActionCard('activate_mode');
        this.#deactivateModeAction = this.homey.flow.getActionCard('deactivate_mode');
        this.#isModeCondition = this.homey.flow.getConditionCard('is_mode');
        this.#modeActivatedTrigger = this.homey.flow.getTriggerCard('mode_activated');
        this.#modeDeactivatedTrigger = this.homey.flow.getTriggerCard('mode_deactivated');

        return super.onInit();
    }
}
