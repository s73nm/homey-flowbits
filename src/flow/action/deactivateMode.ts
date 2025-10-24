import { ModeAutocompleteProvider } from '../autocomplete';
import { BaseAction } from '../base';
import { action } from '../decorator';
import { ModeDeactivatedTrigger } from '../trigger';

@action('deactivate_mode')
export default class extends BaseAction<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', ModeAutocompleteProvider);

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
            .findTrigger(ModeDeactivatedTrigger)
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
