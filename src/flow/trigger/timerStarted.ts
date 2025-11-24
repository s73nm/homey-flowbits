import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@trigger('timer_started')
export default class extends FlowTriggerEntity<FlowBitsApp, Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.timer.name === state.timer;
    }
}

type Args = {
    readonly timer: {
        readonly name: string;
    };
};

type State = {
    readonly timer: string;
};
