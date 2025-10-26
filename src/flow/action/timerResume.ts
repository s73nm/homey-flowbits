import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('timer_resume')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.timers.resume(args.timer.name);
    }
}

type Args = {
    readonly timer: {
        readonly name: string;
    };
};
