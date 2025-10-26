import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('flag_activate')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.flags.activate(args.flag.name);
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
