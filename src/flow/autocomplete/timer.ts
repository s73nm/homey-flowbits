import { autocomplete, FlowAutocompleteProvider } from '@basmilius/homey-common';
import type { FlowCard } from 'homey';
import type { FlowBitsApp } from '../../types';

@autocomplete('timer')
export default class extends FlowAutocompleteProvider<FlowBitsApp> {
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
                description: this.translate('autocomplete.timer_new')
            });
        }

        return results;
    }

    async update(): Promise<void> {
        this.#values = await Promise
            .allSettled([
                await this.flow.getActionCard('timer_pause').getArgumentValues(),
                await this.flow.getActionCard('timer_resume').getArgumentValues(),
                await this.flow.getActionCard('timer_set').getArgumentValues(),
                await this.flow.getActionCard('timer_start').getArgumentValues(),
                await this.flow.getActionCard('timer_stop').getArgumentValues(),
                await this.flow.getConditionCard('timer_duration').getArgumentValues(),
                await this.flow.getConditionCard('timer_finished').getArgumentValues(),
                await this.flow.getConditionCard('timer_paused').getArgumentValues(),
                await this.flow.getConditionCard('timer_running').getArgumentValues(),
                await this.flow.getTriggerCard('timer_finished').getArgumentValues(),
                await this.flow.getTriggerCard('timer_paused').getArgumentValues(),
                await this.flow.getTriggerCard('timer_remaining').getArgumentValues(),
                await this.flow.getTriggerCard('timer_resumed').getArgumentValues(),
                await this.flow.getTriggerCard('timer_started').getArgumentValues(),
                await this.flow.getTriggerCard('timer_stopped').getArgumentValues()
            ])
            .then(allValues => allValues
                .filter(values => values.status === 'fulfilled')
                .map(values => values.value)
                .reduce((acc, curr) => acc.concat(curr))
                .map(value => value.timer.name)
                .filter((value, index, arr) => arr.indexOf(value) === index));
    }
}
