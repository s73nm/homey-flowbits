import { DateTime } from 'luxon';
import type { ClockState, ClockUnit } from '../types';
import { slugify } from '../util';
import type Brain from './brain';
import type Registry from './registry';

import * as AutocompleteProvider from '../flow/autocomplete';
import * as Triggers from '../flow/trigger';

export default class {
    get clearTimeout() {
        return this.#brain.homey.clearTimeout.bind(this.#brain.homey);
    }

    get log() {
        return this.#brain.homey.log;
    }

    get registry(): Registry {
        return this.#brain.registry;
    }

    get setTimeout() {
        return this.#brain.homey.setTimeout.bind(this.#brain.homey);
    }

    get settings() {
        return this.#brain.homey.settings;
    }

    readonly #brain: Brain;
    #timeouts: Record<string, NodeJS.Timeout[]> = {};
    #timers: Record<string, Timer> = {};

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async initialize(): Promise<void> {
        await this.#schedule();
    }

    async finish(timer: Timer): Promise<void> {
        await this.#update(timer.name, timer.duration, 0, timer.target, 'finished');
        await this.#triggerFinished(timer.name);
    }

    async pause(name: string): Promise<void> {
        const timer = await this.#find(name);

        if (!timer) {
            return;
        }

        const now = DateTime.now();
        const target = DateTime.fromSeconds(timer.target);

        await this.#update(timer.name, timer.duration, target.diff(now).as('seconds'), timer.target, 'paused');
        await this.#schedule();
        await this.#triggerPaused(timer.name);
    }

    async resume(name: string): Promise<void> {
        const timer = await this.#find(name);

        if (!timer) {
            return;
        }

        const now = DateTime.now();
        const target = now.plus({seconds: timer.remaining});

        await this.#update(timer.name, timer.duration, timer.remaining, target.toSeconds(), 'running');
        await this.#schedule();
        await this.#triggerResumed(timer.name);
    }

    async set(name: string, duration: number, unit: ClockUnit): Promise<void> {
        const timer = await this.#find(name);

        if (!timer) {
            return;
        }

        await this.#save(name, duration, unit, timer.status);
        await this.#schedule();
    }

    async start(name: string, duration: number, unit: ClockUnit): Promise<void> {
        await this.#save(name, duration, unit, 'running');
        await this.#schedule();
        await this.#triggerStarted(name);
    }

    async stop(name: string): Promise<void> {
        const timer = await this.#find(name);

        if (!timer) {
            return;
        }

        await this.#clear(timer.id);
        await this.#remove(timer.id);
        await this.#triggerStopped(timer.name);
    }

    async isDuration(name: string, duration: number, unit: ClockUnit): Promise<boolean> {
        const timer = await this.#find(name);

        if (!timer) {
            return false;
        }

        const checkDuration = this.#convertDurationToSeconds(duration, unit);
        const now = DateTime.now().toSeconds();

        return timer.target - now > checkDuration;
    }

    async isFinished(name: string): Promise<boolean> {
        const timer = await this.#find(name);

        return timer?.status === 'finished';
    }

    async isPaused(name: string): Promise<boolean> {
        const timer = await this.#find(name);

        return timer?.status === 'paused';
    }

    async isRunning(name: string): Promise<boolean> {
        const timer = await this.#find(name);

        return timer?.status === 'running';
    }

    #convertDurationToSeconds(duration: number, unit: ClockUnit): number {
        switch (unit) {
            case 'seconds':
                return duration;

            case 'minutes':
                return duration * 60;

            case 'hours':
                return duration * 3600;

            case 'days':
                return duration * 86400;
        }
    }

    #id(name: string): string {
        return `flowbits-timer:${slugify(name)}`;
    }

    async #clear(name: string): Promise<void> {
        const timer = await this.#find(name);

        if (!timer) {
            return;
        }

        const timeouts = this.#timeouts[timer.id];

        if (!timeouts) {
            return;
        }

        this.log(`Clear timer timeout ${timer.name}.`);
        timeouts.forEach(timeout => this.clearTimeout(timeout));
    }

    async #find(name: string): Promise<Timer | null> {
        return Object.values(this.#timers).find(t => t.name === name) ?? null;
    }

    async #findAll(): Promise<Timer[]> {
        const autocompleteProvider = this.#brain.registry.findAutocompleteProvider(AutocompleteProvider.Timer);

        if (!autocompleteProvider) {
            throw new Error('Failed to get autocomplete provider.');
        }

        const allSettings = this.settings.getKeys();
        const definedTimers = await autocompleteProvider.find('');
        const timers: Timer[] = [];
        const checkKeys: (keyof Timer)[] = ['name', 'duration', 'remaining', 'target', 'status'];

        for (const setting of allSettings) {
            if (!setting.startsWith('flowbits-timer:')) {
                continue;
            }

            const timer: Timer = this.settings.get(setting);
            const isValid = checkKeys.every(key => key in timer);

            if (!isValid || !definedTimers.find(t => t.name === timer.name)) {
                await this.#remove(timer.id);
                continue;
            }

            timers.push({
                id: setting,
                name: timer.name,
                duration: timer.duration,
                remaining: timer.remaining,
                target: timer.target,
                status: timer.status
            });
        }

        return timers;
    }

    async #remove(id: string): Promise<void> {
        this.settings.unset(id);
        delete this.#timers[id];
    }

    async #save(name: string, duration: number, unit: ClockUnit, status: ClockState): Promise<void> {
        const now = DateTime.now().toSeconds();
        const remaining = this.#convertDurationToSeconds(duration, unit);
        const target = now + remaining;

        await this.#update(name, remaining, remaining, target, status);
    }

    async #schedule(): Promise<void> {
        const now = DateTime.now().toSeconds();
        const timers = await this.#findAll();
        const remainingTriggers: { timer: { name: string }, duration: number, unit: ClockUnit }[] = await this.#brain.homey.flow.getTriggerCard('timer_remaining').getArgumentValues();

        this.#timers = {};

        for (const timer of timers) {
            await this.#clear(timer.id);

            const diff = Math.floor(timer.target - now);
            const triggers = remainingTriggers.filter(t => t.timer.name === timer.name);

            if (diff > 0 && timer.status === 'running') {
                this.log(`Timer ${timer.name} is scheduled to finish in ${diff} seconds.`);

                const timeouts: NodeJS.Timeout[] = [];

                timeouts.push(
                    this.setTimeout(async () => {
                        await this.finish(timer);
                        await this.#schedule();
                    }, diff * 1000)
                );

                for (const trigger of triggers) {
                    const triggerDuration = this.#convertDurationToSeconds(trigger.duration, trigger.unit);
                    const triggerDiff = Math.abs(triggerDuration - diff);

                    if (triggerDiff < 0) {
                        continue;
                    }

                    timeouts.push(
                        this.setTimeout(async () => {
                            await this.#triggerRemaining(timer.name, trigger.duration, trigger.unit);
                        }, triggerDiff * 1000)
                    );
                }

                this.#timeouts[timer.id] = timeouts;
            } else if (diff >= -5 && timer.status === 'running') {
                // todo(Bas): Decide if this 5 second grace period is wanted.
                await this.finish(timer);
            }

            this.#timers[timer.id] = timer;
        }
    }

    async #update(name: string, duration: number, remaining: number, target: number, status: ClockState): Promise<void> {
        const id = this.#id(name);

        this.settings.set(id, {
            id,
            name,
            duration,
            remaining,
            target,
            status
        } satisfies Timer);
    }

    async #triggerFinished(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.TimerFinished)
            ?.trigger({timer: name});

        this.log(`Triggered timer finished for ${name}.`);
    }

    async #triggerPaused(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.TimerPaused)
            ?.trigger({timer: name});

        this.log(`Triggered timer paused for ${name}.`);
    }

    async #triggerRemaining(name: string, duration: number, unit: ClockUnit): Promise<void> {
        this.registry
            .findTrigger(Triggers.TimerRemaining)
            ?.trigger({timer: name, duration, unit});

        this.log(`Triggered timer remaining for ${name}.`);
    }

    async #triggerResumed(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.TimerResumed)
            ?.trigger({timer: name});

        this.log(`Triggered timer resumed for ${name}.`);
    }

    async #triggerStarted(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.TimerStarted)
            ?.trigger({timer: name});

        this.log(`Triggered timer started for ${name}.`);
    }

    async #triggerStopped(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.TimerStopped)
            ?.trigger({timer: name});

        this.log(`Triggered timer stopped for ${name}.`);
    }
}

type Timer = {
    readonly id: string;
    readonly name: string;
    readonly duration: number;
    readonly remaining: number;
    readonly target: number;
    readonly status: ClockState;
};
