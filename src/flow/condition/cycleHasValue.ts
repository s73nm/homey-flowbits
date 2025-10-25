import { BaseCondition } from '../base';
import { condition } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@condition('cycle_has_value')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.brain.cycles.getValue(args.name.name) === args.value;
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
