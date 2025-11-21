import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { ClockUnit, FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@condition('no_repeat_window')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('window', AutocompleteProviders.NoRepeat);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.app.noRepeat.check(args.window.name, args.duration, args.unit);
    }
}

type Args = {
    readonly duration: number;
    readonly unit: ClockUnit;
    readonly window: {
        readonly name: string;
    };
};
