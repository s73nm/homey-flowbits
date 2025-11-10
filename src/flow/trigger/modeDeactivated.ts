import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@trigger('mode_deactivated')
export default class extends BaseTrigger<Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.name.name === state.name;
    }

    async onUpdate(): Promise<void> {
        await this.modes.update();
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};

type State = {
    readonly name: string;
};
