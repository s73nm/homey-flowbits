import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@condition('set_active_at_least')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('set', AutocompleteProviders.Set);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.app.sets.isActiveAtLeast(args.set.name, args.n);
    }
}

type Args = {
    readonly set: {
        readonly name: string;
    };
    readonly n: number;
};
