import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@action('no_repeat_clear')
export default class extends FlowActionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('window', AutocompleteProviders.NoRepeat);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.noRepeat.clear(args.window.name);
    }
}

type Args = {
    readonly window: {
        readonly name: string;
    };
};
