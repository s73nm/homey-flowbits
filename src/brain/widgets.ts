import { ActivateModeAction, DeactivateModeAction } from '../flow/action';
import { ModeAutocompleteProvider } from '../flow/autocomplete';
import type Brain from './brain';

export default class {
    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async getModes(): Promise<Mode[]> {
        const autocompleteProvider = this.#brain.registry.findAutocompleteProvider(ModeAutocompleteProvider);

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
            const action = this.#brain.registry.findAction(DeactivateModeAction);
            await action?.onRun({name: {name: mode.name}});
        } else {
            const action = this.#brain.registry.findAction(ActivateModeAction);
            await action?.onRun({name: {name: mode.name}});
        }

        return true;
    }
}

type Mode = {
    readonly active: boolean;
    readonly name: string;
};
