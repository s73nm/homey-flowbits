import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@action('slider_set')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('slider', AutocompleteProviders.Slider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.sliders.setValue(args.slider.name, args.value);
    }
}

type Args = {
    readonly value: number;
    readonly slider: {
        readonly name: string;
    };
};
