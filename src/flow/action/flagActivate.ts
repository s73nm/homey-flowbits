import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@action('flag_activate')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.flags.activate(args.flag.name);
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
