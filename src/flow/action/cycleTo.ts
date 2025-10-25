import { slugify } from '../../util';
import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';
import * as Triggers from '../trigger';

@action('cycle_to')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const name = args.name.name;
        const id = `flowbits-cycle:${slugify(name)}`;

        this.homey.settings.set(id, args.value);

        this.brain.registry
            .findTrigger(Triggers.CycleBecomes)
            ?.trigger({name, value: args.value});

        this.brain.registry
            .findTrigger(Triggers.CycleUpdates)
            ?.trigger({name}, {value: args.value});
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
