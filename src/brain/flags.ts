import { Shortcuts } from '@basmilius/homey-common';
import { REALTIME_FLAGS_UPDATE, SETTING_FLAG_LOOKS, SETTING_FLAGS } from '../const';
import type { Flag, FlowBitsApp, Look, Mode } from '../types';
import { getBuiltinLook } from '../util';

import * as AutocompleteProviders from '../flow/autocomplete';
import * as Triggers from '../flow/trigger';

export default class extends Shortcuts<FlowBitsApp> {
    get currentFlags(): string[] {
        return this.settings.get(SETTING_FLAGS) ?? [];
    }

    set currentFlags(value: string[]) {
        this.settings.set(SETTING_FLAGS, value);
    }

    get looks(): Record<string, Look> {
        return this.settings.get(SETTING_FLAG_LOOKS) ?? {};
    }

    set looks(value: Record<string, Look>) {
        this.settings.set(SETTING_FLAG_LOOKS, value);
    }

    async activate(name: string): Promise<void> {
        const current = this.currentFlags;

        if (current.includes(name)) {
            return;
        }

        this.currentFlags = [...current, name];

        await Promise.allSettled([
            this.#triggerRealtime(),
            this.#triggerActivated(name),
            this.#triggerChanged(name, true)
        ]);
    }

    async deactivate(name: string): Promise<void> {
        const current = this.currentFlags;

        if (!current.includes(name)) {
            return;
        }

        this.currentFlags = current.filter(f => f !== name);

        await Promise.allSettled([
            this.#triggerRealtime(),
            this.#triggerDeactivated(name),
            this.#triggerChanged(name, false)
        ]);
    }

    async toggle(name: string): Promise<void> {
        if (this.currentFlags.includes(name)) {
            await this.deactivate(name);
        } else {
            await this.activate(name);
        }
    }

    async find(name: string): Promise<Flag | null> {
        const flags = await this.getFlags();
        const flag = flags.find(flag => flag.name === name);

        return flag ?? null;
    }

    async getCount(): Promise<number> {
        const flags = await this.getFlags();

        return flags.length;
    }

    async getFlags(): Promise<Flag[]> {
        const provider = this.#autocompleteProvider();
        const current = this.app.flags.currentFlags;
        const flags = await provider.find('');

        if (flags.length === 0) {
            return [];
        }

        const prefix = this.translate('widget.current_mode.prefix');
        const suffix = this.translate('widget.current_mode.suffix');
        const results: Mode[] = [];

        for (const flag of flags) {
            let look = await this.app.flags.getLook(flag.name);

            if (!look) {
                look = await getBuiltinLook(flag.name, this.language, prefix, suffix);
            }

            results.push({
                active: current.includes(flag.name),
                color: look?.[0],
                icon: look?.[1],
                name: flag.name
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
        this.realtime(REALTIME_FLAGS_UPDATE);
    }

    #autocompleteProvider(): AutocompleteProviders.Flag {
        const provider = this.registry.findAutocompleteProvider(AutocompleteProviders.Flag);

        if (!provider) {
            throw new Error('Failed to get the flag autocomplete provider.');
        }

        return provider;
    }
}
