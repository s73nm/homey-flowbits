import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@action('label_clear')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('label', AutocompleteProviders.Label);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.labels.clearValue(args.label.name);
    }
}

type Args = {
    readonly label: {
        readonly name: string;
    };
};
