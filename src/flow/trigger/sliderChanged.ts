import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@trigger('slider_changed')
export default class extends FlowTriggerEntity<FlowBitsApp, Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('slider', AutocompleteProviders.Slider);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.slider.name === state.slider;
    }
}

type Args = {
    readonly slider: {
        readonly name: string;
    };
};

type State = {
    readonly slider: string;
};
