import { CycleAutocompleteProvider } from '../autocomplete';
import { BaseAction } from '../base';
import { action } from '../decorator';
import { slugify } from '../../util';
import { CycleBecomesTrigger } from '../trigger';

@action('cycle_between')
export default class CycleBetweenAction extends BaseAction<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', CycleAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const name = args.name.name;
        const id = `flowbits-cycle:${slugify(name)}`;

        const min = Number(args.min_value ?? 1);
        const max = Number(args.max_value ?? 1);

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
            .findTrigger(CycleBecomesTrigger)
            ?.trigger({name, value: value + 1});
    }
}

type Args = {
    readonly max_value: number;
    readonly min_value: number;
    readonly name: {
        readonly name: string;
    };
};
