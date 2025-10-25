import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('cycle_to')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.brain.cycles.cycleTo(args.name.name, args.value);
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
