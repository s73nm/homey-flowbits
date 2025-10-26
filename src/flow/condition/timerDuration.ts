import type { ClockUnit } from '../../types';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@condition('timer_duration')
export default class extends BaseCondition<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.timers.isDuration(args.timer.name, args.duration, args.unit);
    }
}

type Args = {
    readonly duration: number;
    readonly timer: {
        readonly name: string;
    };
    readonly unit: ClockUnit;
};
