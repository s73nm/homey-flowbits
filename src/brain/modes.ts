import { REALTIME_MODE_UPDATE, SETTING_MODE, SETTING_MODE_LOOKS } from '../const';
import type { Flag, Look, Mode } from '../types';
import { getBuiltinLook } from '../util';
import BrainAware from './aware';

import * as AutocompleteProviders from '../flow/autocomplete';
import * as Triggers from '../flow/trigger';

export default class extends BrainAware {
    get currentMode(): string | null {
        return this.settings.get(SETTING_MODE);
    }

    set currentMode(value: string | null) {
        this.settings.set(SETTING_MODE, value);
    }

    get looks(): Record<string, Look> {
        return this.settings.get(SETTING_MODE_LOOKS) ?? {};
    }

    set looks(value: Record<string, Look>) {
        this.settings.set(SETTING_MODE_LOOKS, value);
    }

    async activate(name: string): Promise<void> {
        const current = this.currentMode;

        if (current === name) {
            return;
        }

        if (current !== null) {
            await this.#triggerDeactivated(current);
        }

        this.currentMode = name;

        await Promise.allSettled([
            this.#triggerRealtime(),
            this.#triggerActivated(name),
            this.#triggerChanged(name, true)
        ]);
    }

    async deactivate(name: string): Promise<void> {
        const current = this.currentMode;

        if (current !== name) {
            return;
        }

        this.currentMode = null;

        await Promise.allSettled([
            this.#triggerRealtime(),
            this.#triggerDeactivated(name),
            this.#triggerChanged(name, false)
        ]);
    }

    async reactivate(name: string): Promise<void> {
        this.currentMode = name;

        await Promise.allSettled([
            this.#triggerRealtime(),
            this.#triggerActivated(name),
            this.#triggerChanged(name, true)
        ]);
    }

    async toggle(name: string): Promise<void> {
        if (this.currentMode === name) {
            await this.deactivate(name);
        } else {
            await this.activate(name);
        }
    }

    async find(name: string): Promise<Flag | null> {
        const modes = await this.getModes();
        const mode = modes.find(mode => mode.name === name);

        return mode ?? null;
    }

    async getCount(): Promise<number> {
        const modes = await this.getModes();

        return modes.length;
    }

    async getModes(): Promise<Mode[]> {
        const provider = this.#autocompleteProvider();
        const current = this.modes.currentMode;
        const modes = await provider.find('');

        if (modes.length === 0) {
            return [];
        }

        const prefix = this.translate('widget.current_mode.prefix');
        const suffix = this.translate('widget.current_mode.suffix');
        const results: Mode[] = [];

        for (const mode of modes) {
            let look = await this.modes.getLook(mode.name);

            if (!look) {
                look = await getBuiltinLook(mode.name, this.language, prefix, suffix);
            }

            results.push({
                active: current === mode.name,
                color: look?.[0],
                icon: look?.[1],
                name: mode.name
            });
        }

        return results;
    }

    async getLook(name: string): Promise<Look | null> {
        return this.looks[name] ?? null;
    }

    async setLook(name: string, look: Look): Promise<void> {
        this.looks = {
            ...this.looks,
            [name]: look
        };

        await this.#triggerRealtime();
    }

    async update(): Promise<void> {
        await this.#triggerRealtime();
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

    async #triggerRealtime(): Promise<void> {
        this.realtime(REALTIME_MODE_UPDATE);
    }

    #autocompleteProvider(): AutocompleteProviders.Mode {
        const provider = this.registry.findAutocompleteProvider(AutocompleteProviders.Mode);

        if (!provider) {
            throw new Error('Failed to get the mode autocomplete provider.');
        }

        return provider;
    }
}
