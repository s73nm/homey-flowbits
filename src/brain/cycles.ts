import { slugify } from '../util';
import type Brain from './brain';
import type Registry from './registry';

import * as Triggers from '../flow/trigger';

export default class {
    get registry(): Registry {
        return this.#brain.registry;
    }

    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

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

        await this.#triggerCycleBecomes(name, value);
        await this.#triggerCycleUpdates(name, value);
    }

    async getValue(name: string): Promise<number | null> {
        return this.#get(name);
    }

    #id(name: string): string {
        return `flowbits-cycle:${slugify(name)}`;
    }

    #get(name: string): number | null {
        return this.#brain.homey.settings.get(this.#id(name));
    }

    #set(name: string, value: number): void {
        this.#brain.homey.settings.set(this.#id(name), value);
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
