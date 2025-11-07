import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('no_repeat_clear')
export default class extends BaseAction<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('window', AutocompleteProviders.NoRepeat);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.noRepeat.clear(args.window.name);
    }
}

type Args = {
    readonly window: {
        readonly name: string;
    };
};
