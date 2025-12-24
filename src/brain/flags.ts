import { Shortcuts } from '@basmilius/homey-common';
import { REALTIME_FLAGS_UPDATE, SETTING_FLAG_LOOKS, SETTING_FLAGS } from '../const';
import { AutocompleteProviders, Triggers } from '../flow';
import type { Feature, Flag, FlowBitsApp, Look, Styleable } from '../types';

export default class Flags extends Shortcuts<FlowBitsApp> implements Feature<Flag>, Styleable {
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

    async cleanup(): Promise<void> {
        this.log('Cleaning up unused flags...');

        const defined = await this.findAll();

        this.currentFlags = this.currentFlags.filter(flag => defined.find(d => d.name === flag));

        for (const key of Object.keys(this.looks)) {
            if (defined.find(d => d.name === key)) {
                continue;
            }

            this.log(`Deleting unused flag look ${key}...`);
            delete this.looks[key];
        }
    }

    async count(): Promise<number> {
        const flags = await this.findAll();

        return flags.length;
    }

    async find(name: string): Promise<Flag | null> {
        const flags = await this.findAll();
        const flag = flags.find(flag => flag.name === name);

        return flag ?? null;
    }

    async findAll(): Promise<Flag[]> {
        const provider = this.#autocompleteProvider();
        const current = this.currentFlags;
        const flags = await provider.find('');

        if (flags.length === 0) {
            return [];
        }

        const results: Flag[] = [];

        for (const flag of flags) {
            const look = await this.getLook(flag.name);

            results.push({
                active: current.includes(flag.name),
                color: look[0],
                icon: look[1],
                name: flag.name
            });
        }

        return results;
    }

    async activate(name: string): Promise<void> {
        const current = this.currentFlags;

        if (current.includes(name)) {
            return;
        }

        this.currentFlags = [...current, name];

        this.log(`Activate flag ${name}.`);

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

        this.log(`Deactivate flag ${name}.`);

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

    async getLook(name: string): Promise<Look> {
        return this.looks[name] ?? ['#204ef6', ''];
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
