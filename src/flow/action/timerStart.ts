import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { ClockUnit, FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@action('timer_start')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.timers.start(args.timer.name, args.duration, args.unit);
    }
}

type Args = {
    readonly duration: number;
    readonly timer: {
        readonly name: string;
    };
    readonly unit: ClockUnit;
};
