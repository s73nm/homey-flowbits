import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import BrainAware from './aware';
import knownModes from '../../assets/modes/known.json';

import * as AutocompleteProviders from '../flow/autocomplete';

export default class extends BrainAware {
    async initialize(): Promise<void> {
        await this.initializeFlagOnOff();
        await this.initializeSlider();
    }

    async getFlags(): Promise<Flag[]> {
        const autocompleteProvider = this.registry.findAutocompleteProvider(AutocompleteProviders.Flag);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the flag autocomplete provider.');
        }

        const current = this.flags.currentFlags;
        const flags = await autocompleteProvider.find('');

        if (flags.length === 0) {
            return [];
        }

        const icons: Record<string, ModeIcon | null> = {};

        for (const flag of flags) {
            icons[flag.name] = await this.getModeIcon(flag.name, this.translate('widget.current_mode.prefix'), this.translate('widget.current_mode.suffix'));
        }

        return flags.map(flag => ({
            active: current.includes(flag.name),
            icon: icons[flag.name] ?? null,
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

    async getCurrentMode(): Promise<string | null> {
        return this.modes.currentMode;
    }

    async getModeIcon(mode: string, prefix: string, suffix: string): Promise<ModeIcon | null> {
        let normalized = mode.toLowerCase();
        normalized = normalized.startsWith(prefix) ? normalized.substring(prefix.length) : normalized;
        normalized = normalized.endsWith(suffix) ? normalized.substring(0, normalized.length - suffix.length) : normalized;

        const candidate = knownModes.find(item => (item as any)[this.language].includes(normalized));

        if (candidate) {
            return {
                color: candidate.color,
                url: `../../assets/icons/${candidate.icon}.svg`
            };
        }

        return null;
    }

    async getModes(): Promise<Mode[]> {
        const autocompleteProvider = this.registry.findAutocompleteProvider(AutocompleteProviders.Mode);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the mode autocomplete provider.');
        }

        const current = this.modes.currentMode;
        const modes = await autocompleteProvider.find('');

        if (modes.length === 0) {
            return [];
        }

        const icons: Record<string, ModeIcon | null> = {};

        for (const mode of modes) {
            icons[mode.name] = await this.getModeIcon(mode.name, this.translate('widget.current_mode.prefix'), this.translate('widget.current_mode.suffix'));
        }

        return modes.map(mode => ({
            active: current === mode.name,
            icon: icons[mode.name] ?? null,
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

    async getSliderValue(sliderName: string): Promise<number | null> {
        return await this.sliders.getValue(sliderName);
    }

    async setSliderValue(sliderName: string, value: number, widgetId?: string): Promise<void> {
        await this.sliders.setValue(sliderName, value, widgetId);
    }

    async initializeFlagOnOff(): Promise<void> {
        const widget = this.dashboards.getWidget('flag_onoff');

        widget.registerSettingAutocompleteListener('flag', async () => {
            const flags = await this.getFlags();

            return flags.map(flag => ({
                name: flag.name
            }));
        });
    }

    async initializeSlider(): Promise<void> {
        const autocompleteProvider = this.registry.findAutocompleteProvider(AutocompleteProviders.Slider);

        if (!autocompleteProvider) {
            throw new Error('Failed to get the slider autocomplete provider.');
        }

        const contents = await readdir(resolve(__dirname, '../../assets/icons'));
        const icons: string[] = contents.map(file => file.replace('.svg', ''));
        const widget = this.dashboards.getWidget('slider');

        widget.registerSettingAutocompleteListener('slider', async (query) => {
            const sliders = await autocompleteProvider.find(query);

            return sliders.map(slider => ({
                name: slider.name
            }));
        });

        widget.registerSettingAutocompleteListener('icon', async (query) => {
            const results = icons.map(icon => ({
                id: icon,
                name: (' ' + icon)
                    .replaceAll('-', ' ')
                    .replace(/ \w/g, a => a.toLocaleUpperCase())
                    .trim()
            }));

            return results.filter(result => result.name.toLowerCase().includes(query.toLowerCase()));
        });
    }
}

type Flag = {
    readonly active: boolean;
    readonly icon: ModeIcon | null;
    readonly name: string;
};

type Mode = {
    readonly active: boolean;
    readonly icon: ModeIcon | null;
    readonly name: string;
};

type ModeIcon = {
    readonly color: string;
    readonly url: string;
};
