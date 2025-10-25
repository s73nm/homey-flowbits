import { BaseAction } from '../base';
import { action } from '../decorator';

import * as AutocompleteProviders from '../autocomplete';
import * as Triggers from '../trigger';

@action('mode_activate')
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
            return;
        }

        if (value !== null) {
            this.brain.registry
                .findTrigger(Triggers.ModeDeactivated)
                ?.trigger({name: value});

            await this.homey.notifications.createNotification({
                excerpt: this.homey.__('notification.mode_deactivated', {mode: value})
            });
        }

        this.homey.settings.set(id, name);

        this.brain.registry
            .findTrigger(Triggers.ModeActivated)
            ?.trigger({name});

        await this.onUpdate();

        await this.homey.notifications.createNotification({
            excerpt: this.homey.__('notification.mode_activated', {mode: args.name.name})
        });
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
