import { BaseCondition } from '../base';
import { condition } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@condition('timer_finished')
export default class extends BaseCondition<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.brain.timers.isFinished(args.timer.name);
    }
}

type Args = {
    readonly timer: {
        readonly name: string;
    };
};
