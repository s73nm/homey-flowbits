import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@trigger('timer_finished')
export default class extends BaseTrigger<Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.timer.name === state.timer;
    }
}

type Args = {
    readonly timer: {
        readonly name: string;
    };
};

type State = {
    readonly timer: string;
};
