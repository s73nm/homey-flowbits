import { slugify } from '../../util';
import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';
import * as Triggers from '../trigger';

@action('cycle')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const name = args.name.name;
        const id = `flowbits-cycle:${slugify(name)}`;

        const min = 1;
        const max = args.max_value;

        let value: number | null = this.homey.settings.get(id);

        if (value === null) {
            value = min;
        } else {
            value += 1;

            if (value > max) {
                value = min;
            }
        }

        this.homey.settings.set(id, value);

        this.brain.registry
            .findTrigger(Triggers.CycleBecomes)
            ?.trigger({name, value});

        this.brain.registry
            .findTrigger(Triggers.CycleUpdates)
            ?.trigger({name}, {value});
    }
}

type Args = {
    readonly max_value: number;
    readonly name: {
        readonly name: string;
    };
};
