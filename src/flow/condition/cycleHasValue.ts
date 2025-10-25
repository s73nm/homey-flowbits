import { BaseCondition } from '../base';
import { condition } from '../decorator';
import { slugify } from '../../util';

import * as AutocompleteProviders from '../autocomplete';

@condition('cycle_has_value')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        const name = args.name.name;
        const id = `flowbits-cycle:${slugify(name)}`;
        let value: number | null = this.homey.settings.get(id);

        if (value === null) {
            return false;
        }

        return value === args.value;
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
