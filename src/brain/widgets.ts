import type Brain from './brain';

import * as Actions from '../flow/action';
import * as AutocompleteProviders from '../flow/autocomplete';

export default class {
    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async getModes(): Promise<Mode[]> {
        const autocompleteProvider = this.#brain.registry.findAutocompleteProvider(AutocompleteProviders.Mode);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the mode autocomplete provider.');
        }

        const current = this.#brain.homey.settings.get('flowbits-mode');
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
            const action = this.#brain.registry.findAction(Actions.ModeDeactivate);
            await action?.onRun({name: {name: mode.name}});
        } else {
            const action = this.#brain.registry.findAction(Actions.ModeActivate);
            await action?.onRun({name: {name: mode.name}});
        }

        return true;
    }
}

type Mode = {
    readonly active: boolean;
    readonly name: string;
};
