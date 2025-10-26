import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('mode_activate')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.modes.activate(args.name.name);
    }

    async onUpdate(): Promise<void> {
        await this.modes.triggerRealtimeUpdate();
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
