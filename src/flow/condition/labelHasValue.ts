import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@condition('label_has_value')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('label', AutocompleteProviders.Label);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.app.labels.hasValue(args.label.name, args.value);
    }
}

type Args = {
    readonly label: {
        readonly name: string;
    };
    readonly value: string;
};
