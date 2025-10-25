import type Brain from './brain';
import type Registry from './registry';

import * as Triggers from '../flow/trigger';

export default class {
    get currentMode(): string | null {
        return this.#brain.homey.settings.get('flowbits-mode');
    }

    set currentMode(value: string | null) {
        this.#brain.homey.settings.set('flowbits-mode', value);
    }

    get registry(): Registry {
        return this.#brain.registry;
    }

    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
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
        await this.triggerRealtimeUpdate();
    }

    async deactivate(mode: string): Promise<void> {
        const current = this.currentMode;

        if (current !== mode) {
            return;
        }

        this.currentMode = null;

        await this.#triggerDeactivated(mode);
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
        this.#brain.homey.api.realtime('flowbits-mode-update', null);
    }

    async #triggerActivated(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.ModeActivated)
            ?.trigger({name});

        await this.#brain.homey.notifications.createNotification({
            excerpt: this.#brain.homey.__('notification.mode_activated', {name})
        });
    }

    async #triggerDeactivated(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.ModeDeactivated)
            ?.trigger({name});

        await this.#brain.homey.notifications.createNotification({
            excerpt: this.#brain.homey.__('notification.mode_deactivated', {name})
        });
    }
}
