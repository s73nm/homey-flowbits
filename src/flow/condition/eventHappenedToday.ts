import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@condition('event_happened_today')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('event', AutocompleteProviders.Event);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.app.events.happenedToday(args.event.name);
    }
}

type Args = {
    readonly event: {
        readonly name: string;
    };
};
