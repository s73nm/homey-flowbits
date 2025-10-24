import { ModeAutocompleteProvider } from '../autocomplete';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('is_mode')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', ModeAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        const name = args.name.name;
        const id = 'flowbits-mode';
        let value: string | null = this.homey.settings.get(id);

        return value === name;
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
