import type { ClockUnit } from '../types';
import type Brain from './brain';

export default class {
    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async extend(name: string, duration: number, unit: ClockUnit): Promise<void> {
        this.#brain.homey.log('extend', {name, duration, unit});
    }

    async pause(name: string): Promise<void> {
        this.#brain.homey.log('pause', {name});
    }

    async resume(name: string): Promise<void> {
        this.#brain.homey.log('resume', {name});
    }

    async set(name: string, duration: number, unit: ClockUnit): Promise<void> {
        this.#brain.homey.log('set', {name, duration, unit});
    }

    async shorten(name: string, duration: number, unit: ClockUnit): Promise<void> {
        this.#brain.homey.log('shorten', {name, duration, unit});
    }

    async start(name: string, duration: number, unit: ClockUnit): Promise<void> {
        this.#brain.homey.log('start', {name, duration, unit});
    }

    async stop(name: string): Promise<void> {
        this.#brain.homey.log('stop', {name});
    }

    async isExceeded(name: string, duration: number, unit: ClockUnit): Promise<boolean> {
        this.#brain.homey.log('hasExceeded', {name, duration, unit});

        return false;
    }

    async isFinished(name: string): Promise<boolean> {
        this.#brain.homey.log('isFinished', {name});

        return false;
    }

    async isPaused(name: string): Promise<boolean> {
        this.#brain.homey.log('isPaused', {name});

        return false;
    }

    async isRunning(name: string): Promise<boolean> {
        this.#brain.homey.log('isRunning', {name});

        return false;
    }
}
