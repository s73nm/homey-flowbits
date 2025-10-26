import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@trigger('flag_activated')
export default class extends BaseTrigger<Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.flag.name === state.name;
    }

    async onUpdate(): Promise<void> {
        await this.flags.triggerRealtimeUpdate();
    }
}

type Args = {
    readonly flag: {
        readonly name: string;
    };
};

type State = {
    readonly name: string;
};
