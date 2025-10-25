import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@trigger('signal_receive')
export default class extends BaseTrigger<Args, State> {
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
