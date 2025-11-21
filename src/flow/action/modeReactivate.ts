import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@action('mode_reactivate')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.modes.reactivate(args.name.name);
    }

    async onUpdate(): Promise<void> {
        await this.app.modes.update();
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
