import BrainAware from './aware';

import * as Triggers from '../flow/trigger';

export default class extends BrainAware {
    get values(): Record<string, number> {
        return this.settings.get('flowbits-sliders') ?? {};
    }

    set values(value: Record<string, number>) {
        this.settings.set('flowbits-sliders', value);
    }

    async getValue(name: string): Promise<number | null> {
        return this.values[name] ?? null;
    }

    async setValue(name: string, value: number): Promise<void> {
        const values = this.values;
        values[name] = value;

        this.values = values;

        await this.#triggerChanged(name, value);
        await this.#triggerRealtime(name, value);
    }

    async #triggerChanged(slider: string, value: number): Promise<void> {
        this.registry
            .findTrigger(Triggers.SliderChanged)
            ?.trigger({slider}, {value});
    }

    async #triggerRealtime(slider: string, value: number): Promise<void> {
        this.realtime('flowbits-slider-update', {slider, value});
    }
}
