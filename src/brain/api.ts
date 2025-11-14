import type { Color, Flag, Icon, Look, Mode } from '../types';
import BrainAware from './aware';

import * as AutocompleteProviders from '../flow/autocomplete';

import knownIcons from '../../assets/app/icons.json';
import knownModes from '../../assets/app/modes.json';

export default class extends BrainAware {
    async activateFlag(flagName: string): Promise<boolean> {
        const flags = await this.getFlags();
        const flag = flags.find(m => m.name === flagName);

        if (!flag || flag.active) {
            return false;
        }

        await this.flags.activate(flag.name);

        return true;
    }

    async deactivateFlag(flagName: string): Promise<boolean> {
        const flags = await this.getFlags();
        const flag = flags.find(m => m.name === flagName);

        if (!flag || !flag.active) {
            return false;
        }

        await this.flags.deactivate(flag.name);

        return true;
    }

    async getFlags(): Promise<Flag[]> {
        const provider = this.#flagAutocompleteProvider();
        const current = this.flags.currentFlags;
        const flags = await provider.find('');

        if (flags.length === 0) {
            return [];
        }

        const prefix = this.translate('widget.current_mode.prefix');
        const suffix = this.translate('widget.current_mode.suffix');
        const results: Mode[] = [];

        for (const flag of flags) {
            let look = await this.flags.getLook(flag.name);

            if (!look) {
                look = await this.getBuiltinLook(flag.name, prefix, suffix);
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

    async setFlagLook(flagName: string, color: string, icon: string): Promise<boolean> {
        const flags = await this.getFlags();

        if (!flags.find(f => f.name === flagName)) {
            return false;
        }

        await this.flags.setLook(flagName, [color, icon]);

        return true;
    }

    async activateMode(modeName: string): Promise<boolean> {
        const modes = await this.getModes();
        const mode = modes.find(m => m.name === modeName);

        if (!mode || mode.active) {
            return false;
        }

        await this.modes.activate(mode.name);

        return true;
    }

    async deactivateMode(modeName: string): Promise<boolean> {
        const modes = await this.getModes();
        const mode = modes.find(m => m.name === modeName);

        if (!mode || !mode.active) {
            return false;
        }

        await this.modes.deactivate(mode.name);

        return true;
    }

    async getModes(): Promise<Mode[]> {
        const provider = this.#modeAutocompleteProvider();
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
                look = await this.getBuiltinLook(mode.name, prefix, suffix);
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

    async setModeLook(modeName: string, color: string, icon: string): Promise<boolean> {
        const modes = await this.getModes();

        if (!modes.find(m => m.name === modeName)) {
            return false;
        }

        await this.modes.setLook(modeName, [color, icon]);

        return true;
    }

    async getColors(): Promise<Color[]> {
        return [
            {hex: '#ef4444', label: this.translate('color.red')},
            {hex: '#f97316', label: this.translate('color.orange')},
            {hex: '#f59e0b', label: this.translate('color.amber')},
            {hex: '#eab308', label: this.translate('color.yellow')},
            {hex: '#84cc16', label: this.translate('color.lime')},
            {hex: '#22c55e', label: this.translate('color.green')},
            {hex: '#10b981', label: this.translate('color.emerald')},
            {hex: '#14b8a6', label: this.translate('color.teal')},
            {hex: '#06b6d4', label: this.translate('color.cyan')},
            {hex: '#0ea5e9', label: this.translate('color.sky')},
            {hex: '#3b82f6', label: this.translate('color.blue')},
            {hex: '#6366f1', label: this.translate('color.indigo')},
            {hex: '#8b5cf6', label: this.translate('color.violet')},
            {hex: '#a855f7', label: this.translate('color.purple')},
            {hex: '#d946ef', label: this.translate('color.fuchsia')},
            {hex: '#ec4899', label: this.translate('color.pink')},
            {hex: '#f43f5e', label: this.translate('color.rose')}
        ];
    }

    async getIcons(): Promise<Icon[]> {
        return knownIcons.map(icon => ({
            id: icon[0],
            name: icon[1],
            unicode: icon[2]
        }));
    }

    async getBuiltinLook(name: string, prefix: string, suffix: string): Promise<Look | null> {
        let normalized = name.toLowerCase();
        normalized = normalized.startsWith(prefix) ? normalized.substring(prefix.length) : normalized;
        normalized = normalized.endsWith(suffix) ? normalized.substring(0, normalized.length - suffix.length) : normalized;

        const candidate = knownModes.find(item => (item as any)[this.language].includes(normalized));

        if (candidate) {
            const icon = knownIcons.find(icon => icon[0] === candidate.icon);

            if (icon) {
                return [candidate.color, icon[2]];
            }
        }

        return null;
    }

    #flagAutocompleteProvider(): AutocompleteProviders.Flag {
        const provider = this.registry.findAutocompleteProvider(AutocompleteProviders.Flag);

        if (!provider) {
            throw new Error('Failed to get the flag autocomplete provider.');
        }

        return provider;
    }

    #modeAutocompleteProvider(): AutocompleteProviders.Mode {
        const provider = this.registry.findAutocompleteProvider(AutocompleteProviders.Mode);

        if (!provider) {
            throw new Error('Failed to get the mode autocomplete provider.');
        }

        return provider;
    }
}
