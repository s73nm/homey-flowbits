import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { ClockUnit, FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@trigger('timer_remaining')
export default class extends FlowTriggerEntity<FlowBitsApp, Args, State> {
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
    readonly unit: string;
};
