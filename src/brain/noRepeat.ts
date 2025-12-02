import { DateTime, Shortcuts } from '@basmilius/homey-common';
import { SETTING_NO_REPEAT_WINDOWS } from '../const';
import type { ClockUnit, FlowBitsApp } from '../types';
import { convertDurationToSeconds } from '../util';

export default class extends Shortcuts<FlowBitsApp> {
    get windows(): Record<string, DateTime> {
        return Object.fromEntries(
            Object.entries<string>(this.settings.get(SETTING_NO_REPEAT_WINDOWS) ?? {})
                .filter(([, value]) => value !== null)
                .map(([key, value]) => [key, DateTime.fromISO(value)])
        );
    }

    set windows(value: Record<string, DateTime>) {
        this.settings.set(
            SETTING_NO_REPEAT_WINDOWS,
            Object.fromEntries(
                Object.entries(value)
                    .filter(([, value]) => value !== null)
                    .map(([key, value]) => [key, value.toISO()])
            )
        );
    }

    async clear(name: string): Promise<void> {
        const windows = this.windows;
        delete windows[name];
        this.windows = windows;
    }

    async check(name: string, duration: number, unit: ClockUnit): Promise<boolean> {
        const windows = this.windows;

        const now = DateTime.now();
        const last = windows[name] ?? null;
        windows[name] = now;

        this.windows = windows;

        if (last === null) {
            return true;
        }

        const seconds = convertDurationToSeconds(duration, unit);

        return last.plus({seconds}) <= now;
    }

    async getCount(): Promise<number> {
        return Object.keys(this.windows).length;
    }
}
