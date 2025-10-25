import { BaseCondition } from '../base';
import { condition } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';

@condition('mode_is')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        const name = args.name.name;
        const id = 'flowbits-mode';
        let value: string | null = this.homey.settings.get(id);

        return value === name;
    }

    async onUpdate(): Promise<void> {
        await this.homey.api.realtime('flowbits-mode-update', null);
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
