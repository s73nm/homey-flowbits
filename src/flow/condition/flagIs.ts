import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@condition('flag_is')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.app.flags.currentFlags.includes(args.flag.name);
    }

    async onUpdate(): Promise<void> {
        await this.app.flags.update();
        await super.onUpdate();
    }
}

type Args = {
    readonly flag: {
        readonly name: string;
    };
};
