import { BaseAction } from '../base';
import { action } from '../decorator';
import ActivateModeAction from './modeActivate';
import DeactivateModeAction from './modeDeactivate';

import * as AutocompleteProviders from '../autocomplete';

@action('mode_toggle')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const name = args.name.name;
        const id = 'flowbits-mode';
        let value: string | null = this.homey.settings.get(id);

        if (value === name) {
            this.brain.registry
                .findAction(DeactivateModeAction)
                ?.onRun(args);
        } else {
            this.brain.registry
                .findAction(ActivateModeAction)
                ?.onRun(args);
        }
    }

    async onUpdate(): Promise<void> {
        this.homey.api.realtime('flowbits-mode-update', null);
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
