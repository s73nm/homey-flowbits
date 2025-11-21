import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@condition('cycle_has_value')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Cycle);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.app.cycles.getValue(args.name.name) === args.value;
    }
}

type Args = {
    readonly value: number;
    readonly name: {
        readonly name: string;
    };
};
