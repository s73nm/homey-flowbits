import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@trigger('signal_receive')
export default class extends FlowTriggerEntity<FlowBitsApp, Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('signal', AutocompleteProviders.Signal);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.signal.name === state.signal;
    }
}

type Args = {
    readonly signal: {
        readonly name: string;
    };
};

type State = {
    readonly signal: string;
};
