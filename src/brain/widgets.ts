import type { Flag, Mode } from '../types';
import { searchIcons } from '../util';
import BrainAware from './aware';

import * as AutocompleteProviders from '../flow/autocomplete';

export default class extends BrainAware {
    async initialize(): Promise<void> {
        await this.initializeFlagOnOff();
        await this.initializeSlider();
    }

    async getFlags(): Promise<Flag[]> {
        return await this.api.getFlags();
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

    async getModes(): Promise<Mode[]> {
        return await this.api.getModes();
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

        const widget = this.dashboards.getWidget('slider');

        widget.registerSettingAutocompleteListener('slider', async (query) => {
            const sliders = await autocompleteProvider.find(query);

            return sliders.map(slider => ({
                name: slider.name
            }));
        });

        widget.registerSettingAutocompleteListener('icon', searchIcons);
    }
}
