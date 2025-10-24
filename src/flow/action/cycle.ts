import { slugify } from '../../util';
import { CycleAutocompleteProvider } from '../autocomplete';
import { BaseAction } from '../base';
import { action } from '../decorator';
import { CycleBecomesTrigger } from '../trigger';

@action('cycle')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', CycleAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const name = args.name.name;
        const id = `flowbits-cycle:${slugify(name)}`;
        let value: number | null = this.homey.settings.get(id);

        if (value === null) {
            value = 0;
        } else {
            value = ((value + 1) % args.max_value);
        }

        this.homey.settings.set(id, value);

        this.brain.registry
            .findTrigger(CycleBecomesTrigger)
            ?.trigger({name, value: value + 1});
    }
}

type Args = {
    readonly max_value: number;
    readonly name: {
        readonly name: string;
    };
};
