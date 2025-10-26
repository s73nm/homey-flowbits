import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@action('cycle')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.cycles.cycle(args.name.name, 1, args.max_value);
    }
}

type Args = {
    readonly max_value: number;
    readonly name: {
        readonly name: string;
    };
};
