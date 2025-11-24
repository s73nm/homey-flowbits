import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@action('timer_resume')
export default class extends FlowActionEntity<FlowBitsApp, Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('timer', AutocompleteProviders.Timer);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        await this.app.timers.resume(args.timer.name);
    }
}

type Args = {
    readonly timer: {
        readonly name: string;
    };
};
