import { DateTime } from 'luxon';
import type { ClockUnit } from '../types';
import { convertDurationToSeconds } from '../util';
import BrainAware from './aware';

export default class extends BrainAware {
    get windows(): Record<string, DateTime> {
        return Object.fromEntries(
            Object.entries<string>(this.settings.get('flowbits-no-repeat-windows') ?? {})
                .filter(([, value]) => value !== null)
                .map(([key, value]) => [key, DateTime.fromISO(value)])
        );
    }

    set windows(value: Record<string, DateTime>) {
        this.settings.set(
            'flowbits-no-repeat-windows',
            Object.fromEntries(
                Object.entries(value)
                    .filter(([, value]) => value !== null)
                    .map(([key, value]) => [key, value.toISO()])
            )
        );
    }

    async clear(window: string): Promise<void> {
        const windows = this.windows;
        delete windows[window];
        this.windows = windows;
    }

    async check(window: string, duration: number, unit: ClockUnit): Promise<boolean> {
        const windows = this.windows;

        const now = DateTime.now();
        const last = this.windows[window] ?? null;
        windows[window] = now;

        this.windows = windows;

        if (last === null) {
            return true;
        }

        const seconds = convertDurationToSeconds(duration, unit);

        return last.plus({seconds}) <= now;
    }
}
