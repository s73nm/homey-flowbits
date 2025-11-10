import BrainAware from './aware';

import * as Triggers from '../flow/trigger';

export default class extends BrainAware {
    get currentFlags(): string[] {
        return this.settings.get('flowbits-flags') ?? [];
    }

    set currentFlags(value: string[]) {
        this.settings.set('flowbits-flags', value);
    }

    async activate(flag: string): Promise<void> {
        const current = this.currentFlags;

        if (current.includes(flag)) {
            return;
        }

        this.currentFlags = [...current, flag];

        await Promise.allSettled([
            this.#triggerRealtime(),
            this.#triggerActivated(flag),
            this.#triggerChanged(flag, true)
        ]);
    }

    async deactivate(flag: string): Promise<void> {
        const current = this.currentFlags;

        if (!current.includes(flag)) {
            return;
        }

        this.currentFlags = current.filter(f => f !== flag);

        await Promise.allSettled([
            this.#triggerRealtime(),
            this.#triggerDeactivated(flag),
            this.#triggerChanged(flag, false)
        ]);
    }

    async toggle(flag: string): Promise<void> {
        if (this.currentFlags.includes(flag)) {
            await this.deactivate(flag);
        } else {
            await this.activate(flag);
        }
    }

    async update(): Promise<void> {
        await this.#triggerRealtime();
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

    async #triggerRealtime(): Promise<void> {
        this.realtime('flowbits-flags-update');
    }
}
