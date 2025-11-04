import type Brain from './brain';
import type Registry from './registry';

import * as Triggers from '../flow/trigger';

export default class {
    get currentFlags(): string[] {
        return this.#brain.homey.settings.get('flowbits-flags') ?? [];
    }

    set currentFlags(value: string[]) {
        this.#brain.homey.settings.set('flowbits-flags', value);
    }

    get registry(): Registry {
        return this.#brain.registry;
    }

    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async activate(flag: string): Promise<void> {
        const current = this.currentFlags;

        if (current.includes(flag)) {
            return;
        }

        this.currentFlags = [...current, flag];

        await this.#triggerActivated(flag);
        await this.#triggerChanged(flag, true);
        await this.triggerRealtimeUpdate();
    }

    async deactivate(flag: string): Promise<void> {
        const current = this.currentFlags;

        if (!current.includes(flag)) {
            return;
        }

        this.currentFlags = current.filter(f => f !== flag);

        await this.#triggerDeactivated(flag);
        await this.#triggerChanged(flag, false);
        await this.triggerRealtimeUpdate();
    }

    async toggle(flag: string): Promise<void> {
        if (this.currentFlags.includes(flag)) {
            await this.deactivate(flag);
        } else {
            await this.activate(flag);
        }
    }

    async triggerRealtimeUpdate(): Promise<void> {
        this.#brain.homey.api.realtime('flowbits-flags-update', null);
    }

    async #triggerActivated(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.FlagActivated)
            ?.trigger({name});
    }

    async #triggerChanged(name: string, active: boolean): Promise<void> {
        this.registry
            .findTrigger(Triggers.FlagChanged)
            ?.trigger({name}, {active});
    }

    async #triggerDeactivated(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.FlagDeactivated)
            ?.trigger({name});
    }
}
