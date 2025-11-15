import { DateTime } from 'luxon';
import type { ClockState, ClockUnit } from '../types';
import { convertDurationToSeconds, slugify } from '../util';
import BrainAware from './aware';

import * as AutocompleteProviders from '../flow/autocomplete';
import * as Triggers from '../flow/trigger';

export default class extends BrainAware {
    #timeouts: Record<string, NodeJS.Timeout[]> = {};
    #timers: Record<string, Timer> = {};

    async initialize(): Promise<void> {
        await this.#schedule();
    }

    async getCount(): Promise<number> {
        return Object.keys(this.#timers).length;
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

        await this.#clear(timer);
        await this.#remove(timer.id);
        await this.#triggerStopped(timer.name);
    }

    async isDuration(name: string, duration: number, unit: ClockUnit): Promise<boolean> {
        const timer = await this.#find(name);

        if (!timer) {
            return false;
        }

        const checkDuration = convertDurationToSeconds(duration, unit);
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

    #id(name: string): string {
        return `flowbits-timer:${slugify(name)}`;
    }

    async #clear(timer: Timer): Promise<void> {
        const timeouts = this.#timeouts[timer.id];

        if (!timeouts) {
            return;
        }

        this.log(`Clear timer timeouts for ${timer.name}.`);
        timeouts.forEach(timeout => this.clearTimeout(timeout));
        delete this.#timeouts[timer.id];
    }

    async #find(name: string): Promise<Timer | null> {
        return Object.values(this.#timers).find(t => t.name === name) ?? null;
    }

    async #findAll(): Promise<Timer[]> {
        const autocompleteProvider = this.registry.findAutocompleteProvider(AutocompleteProviders.Timer);

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
            const isValid = timer && checkKeys.every(key => key in timer);

            if (!isValid || !definedTimers.find(t => t.name === timer.name)) {
                timer && await this.#remove(timer.id);
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
        const remaining = convertDurationToSeconds(duration, unit);
        const target = now + remaining;

        await this.#update(name, remaining, remaining, target, status);
    }

    async #schedule(): Promise<void> {
        const now = DateTime.now().toSeconds();
        const timers = await this.#findAll();
        const remainingTriggers: { timer: { name: string }, duration: number, unit: ClockUnit }[] = await this.homey.flow.getTriggerCard('timer_remaining').getArgumentValues();

        this.#timers = {};

        for (const timer of timers) {
            await this.#clear(timer);

            const diff = Math.floor(timer.target - now);
            const triggers = remainingTriggers
                .filter(t => t.timer.name === timer.name)
                .filter((t, index, arr) => arr.findIndex(tt => tt.duration === t.duration && tt.unit === t.unit) === index);

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
                    const triggerDuration = convertDurationToSeconds(trigger.duration, trigger.unit);
                    const triggerDiff = Math.abs(triggerDuration - diff);

                    if (triggerDiff <= 0) {
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
