import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';
import * as Triggers from '../trigger';

@action('signal_send')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('signal', AutocompleteProviders.Signal);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        this.brain.registry
            .findTrigger(Triggers.SignalReceive)
            ?.trigger({signal: args.signal.name});
    }
}

type Args = {
    readonly signal: {
        readonly name: string;
    };
};
