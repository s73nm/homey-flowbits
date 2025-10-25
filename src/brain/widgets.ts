import type Brain from './brain';
import type Modes from './modes';

import * as AutocompleteProviders from '../flow/autocomplete';

export default class {
    get modes(): Modes {
        return this.#brain.modes;
    }

    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async getModes(): Promise<Mode[]> {
        const autocompleteProvider = this.#brain.registry.findAutocompleteProvider(AutocompleteProviders.Mode);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the mode autocomplete provider.');
        }

        const current = this.modes.currentMode;
        const modes = await autocompleteProvider.find('');

        if (modes.length === 0) {
            throw new Error('No modes found.');
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
}

type Mode = {
    readonly active: boolean;
    readonly name: string;
};
