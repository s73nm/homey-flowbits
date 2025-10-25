import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';
import type { ClockUnit } from '../../types';

@trigger('timer_remaining')
export default class extends BaseTrigger<Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.timer.name === state.timer && args.duration === state.duration && args.unit === state.unit;
    }
}

type Args = {
    readonly duration: number;
    readonly timer: {
        readonly name: string;
    };
    readonly unit: ClockUnit;
};

type State = {
    readonly duration: number;
    readonly timer: string;
    readonly unit: ClockUnit;
};
