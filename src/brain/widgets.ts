import { searchIcons } from '../util';
import BrainAware from './aware';

import * as AutocompleteProviders from '../flow/autocomplete';

export default class extends BrainAware {
    async initialize(): Promise<void> {
        await this.#initializeFlagOnOff();
        await this.#initializeSlider();
    }

    async getSliderValue(sliderName: string): Promise<number | null> {
        return await this.sliders.getValue(sliderName);
    }

    async setSliderValue(sliderName: string, value: number, widgetId?: string): Promise<void> {
        await this.sliders.setValue(sliderName, value, widgetId);
    }

    async #initializeFlagOnOff(): Promise<void> {
        const widget = this.dashboards.getWidget('flag_onoff');

        widget.registerSettingAutocompleteListener('flag', async () => {
            const flags = await this.api.getFlags();

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
