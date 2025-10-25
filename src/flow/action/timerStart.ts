import type { ClockUnit } from '../../types';
import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('timer_start')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.brain.timers.start(args.timer.name, args.duration, args.unit);
    }
}

type Args = {
    readonly duration: number;
    readonly timer: {
        readonly name: string;
    };
    readonly unit: ClockUnit;
};
