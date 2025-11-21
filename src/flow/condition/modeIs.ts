import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@condition('mode_is')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return this.app.modes.currentMode === args.name.name;
    }

    async onUpdate(): Promise<void> {
        await this.app.modes.update();
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
