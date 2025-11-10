import { BaseCondition } from '../base';
import { condition } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@condition('flag_is')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.flags.currentFlags.includes(args.flag.name);
    }

    async onUpdate(): Promise<void> {
        await this.flags.update();
    }
}

type Args = {
    readonly flag: {
        readonly name: string;
    };
};
