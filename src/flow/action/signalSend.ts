import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';
import * as Triggers from '../trigger';

@action('signal_send')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('signal', AutocompleteProviders.Signal);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        this.registry
            .findTrigger(Triggers.SignalReceive)
            ?.trigger({signal: args.signal.name});
    }
}

type Args = {
    readonly signal: {
        readonly name: string;
    };
};
