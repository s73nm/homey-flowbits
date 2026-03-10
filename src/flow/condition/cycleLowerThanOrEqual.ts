import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@condition('cycle_lower_than_or_equal')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        const value = await this.app.cycles.getValue(args.name.name);

        if (value === null) {
            return false;
        }

        return value <= args.value;
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
