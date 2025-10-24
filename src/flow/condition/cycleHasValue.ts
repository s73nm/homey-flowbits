import { CycleAutocompleteProvider } from '../autocomplete';
import { BaseCondition } from '../base';
import { condition } from '../decorator';
import { slugify } from '../../util';

@condition('cycle_has_value')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', CycleAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        const name = args.name.name;
        const id = `flowbits-cycle:${slugify(name)}`;
        let value: number | null = this.homey.settings.get(id);

        return Number(value) === Number(args.value);
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
