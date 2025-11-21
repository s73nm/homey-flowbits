import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@action('flag_toggle')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.flags.toggle(args.flag.name);
    }

    async onUpdate(): Promise<void> {
        await this.app.flags.update();
    }
}

type Args = {
    readonly flag: {
        readonly name: string;
    };
};
