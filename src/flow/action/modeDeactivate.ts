import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';
import * as Triggers from '../trigger';

@action('mode_deactivate')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', AutocompleteProviders.Mode);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const name = args.name.name;
        const id = 'flowbits-mode';
        let value: string | null = this.homey.settings.get(id);

        if (value !== name) {
            return;
        }

        this.homey.settings.set(id, null);

        this.brain.registry
            .findTrigger(Triggers.ModeDeactivated)
            ?.trigger({name});

        await this.onUpdate();

        await this.homey.notifications.createNotification({
            excerpt: this.homey.__('notification.mode_deactivated', {mode: args.name.name})
        });
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
