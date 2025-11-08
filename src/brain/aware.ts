import type Homey from 'homey/lib/Homey';
import type ManagerDashboards from 'homey/manager/dashboards';
import type Brain from './brain';
import type Cycles from './cycles';
import type Flags from './flags';
import type Modes from './modes';
import type NoRepeat from './noRepeat';
import type Registry from './registry';
import type Sliders from './sliders';
import type Timers from './timers';
import type Tokens from './tokens';
import type Widgets from './widgets';

export default class BrainAware {
    get brain(): Brain {
        return this.#brain;
    }

    get homey(): Homey {
        return this.brain.homey;
    }

    get dashboards(): ManagerDashboards {
        return this.homey.dashboards;
    }

    get settings(): Homey.ManagerSettings {
        return this.homey.settings;
    }

    get language(): string {
        return this.homey.i18n.getLanguage();
    }

    get cycles(): Cycles {
        return this.brain.cycles;
    }

    get flags(): Flags {
        return this.brain.flags;
    }

    get modes(): Modes {
        return this.brain.modes;
    }

    get noRepeat(): NoRepeat {
        return this.brain.noRepeat;
    }

    get registry(): Registry {
        return this.brain.registry;
    }

    get sliders(): Sliders {
        return this.brain.sliders;
    }

    get timers(): Timers {
        return this.brain.timers;
    }

    get tokens(): Tokens {
        return this.brain.tokens;
    }

    get widgets(): Widgets {
        return this.brain.widgets;
    }

    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    async notify(message: string): Promise<void> {
        await this.homey.notifications.createNotification({
            excerpt: message
        });
    }

    log(...args: any[]): void {
        this.homey.log(...args);
    }

    realtime(event: string, data: any = undefined): void {
        this.homey.api.realtime(event, data);
    }

    translate(key: string, tags?: Record<string, string | number>): string {
        return this.homey.__(key, tags);
    }

    clearInterval(interval: NodeJS.Timeout): void {
        this.homey.clearInterval(interval);
    }

    setInterval(callback: Function, ms: number): NodeJS.Timeout {
        return this.homey.setInterval(callback, ms);
    }

    clearTimeout(interval: NodeJS.Timeout): void {
        this.homey.clearTimeout(interval);
    }

    setTimeout(callback: Function, ms: number): NodeJS.Timeout {
        return this.homey.setTimeout(callback, ms);
    }
}
