import { Shortcuts } from '@basmilius/homey-common';
import { REALTIME_SLIDER_UPDATE, SETTING_SLIDERS } from '../const';
import type { FlowBitsApp } from '../types';

import * as Triggers from '../flow/trigger';

export default class extends Shortcuts<FlowBitsApp> {
    get values(): Record<string, number> {
        return this.settings.get(SETTING_SLIDERS) ?? {};
    }

    set values(value: Record<string, number>) {
        this.settings.set(SETTING_SLIDERS, value);
    }

    async getCount(): Promise<number> {
        return Object.keys(this.values).length;
    }

    async getValue(name: string): Promise<number | null> {
        return this.values[name] ?? null;
    }

    async setValue(name: string, value: number, widgetId?: string): Promise<void> {
        this.values = {
            ...this.values,
            [name]: value
        };

        await this.#triggerRealtime(name, value, widgetId);
        await this.#triggerChanged(name, value);
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
