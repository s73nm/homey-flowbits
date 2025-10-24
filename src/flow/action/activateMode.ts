import { ModeAutocompleteProvider } from '../autocomplete';
import { BaseAction } from '../base';
import { action } from '../decorator';
import { ModeActivatedTrigger, ModeDeactivatedTrigger } from '../trigger';

@action('activate_mode')
export default class extends BaseAction<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', ModeAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        const {waitFor} = await import('@basmilius/utils');

        // Built-in wait time, to allow deactivated mode to trigger.
        await waitFor(100);

        const name = args.name.name;
        const id = 'flowbits-mode';
        let value: string | null = this.homey.settings.get(id);

        if (value === name) {
            return;
        }

        if (value !== null) {
            this.brain.registry
                .findTrigger(ModeDeactivatedTrigger)
                ?.trigger({name: value});

            await this.homey.notifications.createNotification({
                excerpt: this.homey.__('notification.mode_deactivated', {mode: value})
            });
        }

        this.homey.settings.set(id, name);

        this.brain.registry
            .findTrigger(ModeActivatedTrigger)
            ?.trigger({name});

        await this.homey.notifications.createNotification({
            excerpt: this.homey.__('notification.mode_activated', {mode: args.name.name})
        });
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};
