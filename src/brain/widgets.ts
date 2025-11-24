import { Shortcuts } from '@basmilius/homey-common';
import { AutocompleteProviders } from '../flow';
import type { FlowBitsApp } from '../types';
import { searchIcons } from '../util';

export default class extends Shortcuts<FlowBitsApp> {
    async initialize(): Promise<void> {
        await this.#initializeFlagOnOff();
        await this.#initializeSlider();
    }

    async getSliderValue(sliderName: string): Promise<number | null> {
        return await this.app.sliders.getValue(sliderName);
    }

    async setSliderValue(sliderName: string, value: number, widgetId?: string): Promise<void> {
        await this.app.sliders.setValue(sliderName, value, widgetId);
    }

    async #initializeFlagOnOff(): Promise<void> {
        const widget = this.dashboards.getWidget('flag_onoff');

        widget.registerSettingAutocompleteListener('flag', async () => {
            const flags = await this.app.api.getFlags();

            return flags.map(flag => ({
                name: flag.name
            }));
        });
    }

    async #initializeSlider(): Promise<void> {
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
