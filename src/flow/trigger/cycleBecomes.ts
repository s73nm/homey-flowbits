import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@trigger('cycle_becomes')
export default class extends FlowTriggerEntity<FlowBitsApp, Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.name.name === state.name && args.value === state.value;
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
    readonly value: number;
};

type State = {
    readonly name: string;
    readonly value: number;
};
