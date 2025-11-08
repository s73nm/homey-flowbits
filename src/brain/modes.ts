import BrainAware from './aware';

import * as Triggers from '../flow/trigger';

export default class extends BrainAware {
    get currentMode(): string | null {
        return this.settings.get('flowbits-mode');
    }

    set currentMode(value: string | null) {
        this.settings.set('flowbits-mode', value);
    }

    async activate(mode: string): Promise<void> {
        const current = this.currentMode;

        if (current === mode) {
            return;
        }

        if (current !== null) {
            await this.#triggerDeactivated(current);
        }

        this.currentMode = mode;

        await this.#triggerActivated(mode);
        await this.#triggerChanged(mode, true);
        await this.triggerRealtimeUpdate();
    }

    async deactivate(mode: string): Promise<void> {
        const current = this.currentMode;

        if (current !== mode) {
            return;
        }

        this.currentMode = null;

        await this.#triggerDeactivated(mode);
        await this.#triggerChanged(mode, false);
        await this.triggerRealtimeUpdate();
    }

    async reactivate(mode: string): Promise<void> {
        this.currentMode = mode;

        await this.#triggerActivated(mode);
        await this.#triggerChanged(mode, true);
        await this.triggerRealtimeUpdate();
    }

    async toggle(mode: string): Promise<void> {
        if (this.currentMode === mode) {
            await this.deactivate(mode);
        } else {
            await this.activate(mode);
        }
    }

    async triggerRealtimeUpdate(): Promise<void> {
        this.realtime('flowbits-mode-update');
    }

    async #triggerActivated(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.ModeActivated)
            ?.trigger({name});

        await this.notify(this.translate('notification.mode_activated', {name}));
    }

    async #triggerChanged(name: string, active: boolean): Promise<void> {
        this.registry
            .findTrigger(Triggers.ModeChanged)
            ?.trigger({name}, {active});
    }

    async #triggerDeactivated(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.ModeDeactivated)
            ?.trigger({name});

        await this.notify(this.translate('notification.mode_deactivated', {name}));
    }
}
