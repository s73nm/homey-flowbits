import { Shortcuts } from '@basmilius/homey-common';
import { REALTIME_SLIDER_UPDATE, SETTING_SLIDERS } from '../const';
import { Triggers } from '../flow';
import type { Feature, FlowBitsApp, Slider } from '../types';

export default class Sliders extends Shortcuts<FlowBitsApp> implements Feature<Slider> {
    get values(): Record<string, number> {
        return this.settings.get(SETTING_SLIDERS) ?? {};
    }

    set values(value: Record<string, number>) {
        this.settings.set(SETTING_SLIDERS, value);
    }

    async count(): Promise<number> {
        return Object.keys(this.values).length;
    }

    async find(name: string): Promise<Slider | null> {
        const sliders = await this.findAll();
        const slider = sliders.find(slider => slider.name === name);

        return slider ?? null;
    }

    async findAll(): Promise<Slider[]> {
        return Object.entries(this.values)
            .map(([name, value]) => ({
                name,
                value
            }));
    }

    async getValue(name: string): Promise<number | null> {
        return this.values[name] ?? null;
    }

    async setValue(name: string, value: number, widgetId?: string): Promise<void> {
        this.values = {
            ...this.values,
            [name]: value
        };

        this.log(`Set value of slider ${name} to ${value}.`);

        await Promise.allSettled([
            this.#triggerRealtime(name, value, widgetId),
            this.#triggerChanged(name, value)
        ]);
    }

    async #triggerChanged(slider: string, value: number): Promise<void> {
        this.registry
            .findTrigger(Triggers.SliderChanged)
            ?.trigger({slider}, {value});
    }

    async #triggerRealtime(slider: string, value: number, widgetId?: string): Promise<void> {
        this.realtime(REALTIME_SLIDER_UPDATE, {slider, value, widgetId});
    }
}
