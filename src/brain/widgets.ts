import type Brain from './brain';
import type Flags from './flags';
import type Modes from './modes';

import * as AutocompleteProviders from '../flow/autocomplete';

export default class {
    get flags(): Flags {
        return this.#brain.flags;
    }

    get modes(): Modes {
        return this.#brain.modes;
    }

    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async initialize(): Promise<void> {
        await this.initializeFlagOnOff();
    }

    async getFlags(): Promise<Flag[]> {
        const autocompleteProvider = this.#brain.registry.findAutocompleteProvider(AutocompleteProviders.Flag);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the flag autocomplete provider.');
        }

        const current = this.flags.currentFlags;
        const flags = await autocompleteProvider.find('');

        if (flags.length === 0) {
            return [];
        }

        return flags.map(flag => ({
            active: current.includes(flag.name),
            name: flag.name
        }));
    }

    async toggleFlag(flagName: string): Promise<boolean> {
        const flags = await this.getFlags();
        const flag = flags.find(m => m.name === flagName);

        if (!flag) {
            throw new Error('Flag not found.');
        }

        if (flag.active) {
            await this.flags.deactivate(flag.name);
        } else {
            await this.flags.activate(flag.name);
        }

        return true;
    }

    async getModes(): Promise<Mode[]> {
        const autocompleteProvider = this.#brain.registry.findAutocompleteProvider(AutocompleteProviders.Mode);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the mode autocomplete provider.');
        }

        const current = this.modes.currentMode;
        const modes = await autocompleteProvider.find('');

        if (modes.length === 0) {
            return [];
        }

        return modes.map(mode => ({
            active: current === mode.name,
            name: mode.name
        }));
    }

    async toggleMode(modeName: string): Promise<boolean> {
        const modes = await this.getModes();
        const mode = modes.find(m => m.name === modeName);

        if (!mode) {
            throw new Error('Mode not found.');
        }

        if (mode.active) {
            await this.modes.deactivate(mode.name);
        } else {
            await this.modes.activate(mode.name);
        }

        return true;
    }

    async initializeFlagOnOff(): Promise<void> {
        const widget = this.#brain.homey.dashboards.getWidget('flag_onoff');

        widget.registerSettingAutocompleteListener('flag', async (query, settings) => {
            const flags = await this.getFlags();

            return flags.map(flag => ({
                name: flag.name
            }));
        });
    }
}

type Flag = {
    readonly active: boolean;
    readonly name: string;
};

type Mode = {
    readonly active: boolean;
    readonly name: string;
};
