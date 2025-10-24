import { slugify } from '../../util';
import { CycleAutocompleteProvider } from '../autocomplete';
import { BaseAction } from '../base';
import { action } from '../decorator';
import { CycleBecomesTrigger, CycleUpdatesTrigger } from '../trigger';

@action('cycle_to')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', CycleAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const name = args.name.name;
        const id = `flowbits-cycle:${slugify(name)}`;

        this.homey.settings.set(id, args.value);

        this.brain.registry
            .findTrigger(CycleBecomesTrigger)
            ?.trigger({name, value: args.value});

        this.brain.registry
            .findTrigger(CycleUpdatesTrigger)
            ?.trigger({name}, {value: args.value});
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
