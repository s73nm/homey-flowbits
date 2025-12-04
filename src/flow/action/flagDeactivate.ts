import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@action('flag_deactivate')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.flags.deactivate(args.flag.name);
    }

    async onUpdate(): Promise<void> {
        await this.app.flags.update();
        await super.onUpdate();
    }
}

type Args = {
    readonly flag: {
        readonly name: string;
    };
};
