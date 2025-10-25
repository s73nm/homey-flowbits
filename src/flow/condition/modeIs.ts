import { BaseCondition } from '../base';
import { condition } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@condition('mode_is')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.brain.modes.currentMode === args.name.name;
    }

    async onUpdate(): Promise<void> {
        await this.brain.modes.triggerRealtimeUpdate();
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
