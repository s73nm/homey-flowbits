import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('slider_set')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('slider', AutocompleteProviders.Slider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.sliders.setValue(args.slider.name, args.value);
    }
}

type Args = {
    readonly value: number;
    readonly slider: {
        readonly name: string;
    };
};
