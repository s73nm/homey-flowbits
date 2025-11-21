import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

import * as AutocompleteProviders from '../autocomplete';

@condition('timer_finished')
export default class extends FlowConditionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        return await this.app.timers.isFinished(args.timer.name);
    }
}

type Args = {
    readonly timer: {
        readonly name: string;
    };
};
