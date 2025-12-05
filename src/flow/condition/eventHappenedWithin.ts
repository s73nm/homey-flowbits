import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { ClockUnit, FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@condition('event_happened_within')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('event', AutocompleteProviders.Event);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.app.events.happenedWithin(args.event.name, args.duration, args.unit);
    }
}

type Args = {
    readonly event: {
        readonly name: string;
    };
    readonly duration: number;
    readonly unit: ClockUnit;
};
