import type { ClockUnit } from '../../types';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@condition('no_repeat_window')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('window', AutocompleteProviders.NoRepeat);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.noRepeat.check(args.window.name, args.duration, args.unit);
    }
}

type Args = {
    readonly duration: number;
    readonly unit: ClockUnit;
    readonly window: {
        readonly name: string;
    };
};
