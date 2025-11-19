import { SETTING_CYCLE_PREFIX } from '../const';
import { slugify } from '../util';
import BrainAware from './aware';

import * as Triggers from '../flow/trigger';

export default class extends BrainAware {
    async cycle(name: string, minValue: number, maxValue: number): Promise<void> {
        let value = this.#get(name);

        if (value === null) {
            value = minValue;
        } else {
            value = Math.max(value, minValue);
            value++;

            if (value > maxValue) {
                value = minValue;
            }
        }

        await this.cycleTo(name, value);
    }

    async cycleTo(name: string, value: number): Promise<void> {
        this.#set(name, value);

        await Promise.allSettled([
            this.#triggerCycleBecomes(name, value),
            this.#triggerCycleUpdates(name, value)
        ]);
    }

    async getCount(): Promise<number> {
        return this.settings
            .getKeys()
            .filter(setting => setting.startsWith(SETTING_CYCLE_PREFIX))
            .length;
    }

    async getValue(name: string): Promise<number | null> {
        return this.#get(name);
    }

    #id(name: string): string {
        return `${SETTING_CYCLE_PREFIX}${slugify(name)}`;
    }

    #get(name: string): number | null {
        return this.settings.get(this.#id(name));
    }

    #set(name: string, value: number): void {
        this.settings.set(this.#id(name), value);
    }

    async #triggerCycleBecomes(name: string, value: number): Promise<void> {
        this.registry
            .findTrigger(Triggers.CycleBecomes)
            ?.trigger({name, value});
    }

    async #triggerCycleUpdates(name: string, value: number): Promise<void> {
        this.registry
            .findTrigger(Triggers.CycleUpdates)
            ?.trigger({name}, {value});
    }
}
