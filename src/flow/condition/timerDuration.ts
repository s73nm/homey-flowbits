import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { ClockUnit, FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@condition('timer_duration')
export default class extends FlowConditionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.app.timers.isDuration(args.timer.name, args.duration, args.unit);
    }
}

type Args = {
    readonly duration: number;
    readonly timer: {
        readonly name: string;
    };
    readonly unit: ClockUnit;
};
