import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('flag_deactivate')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.brain.flags.deactivate(args.flag.name);
    }

    async onUpdate(): Promise<void> {
        await this.brain.flags.triggerRealtimeUpdate();
    }
}

type Args = {
    readonly flag: {
        readonly name: string;
    };
};
