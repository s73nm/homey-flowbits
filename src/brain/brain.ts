import type Homey from 'homey/lib/Homey';
import Modes from './modes';
import Registry from './registry';
import Timers from './timers';
import Tokens from './tokens';
import Widgets from './widgets';

export default class {
    get homey(): Homey {
        return this.#homey;
    }

    get modes(): Modes {
        return this.#modes;
    }

    get registry(): Registry {
        return this.#registry;
    }

    get timers(): Timers {
        return this.#timers;
    }

    get tokens(): Tokens {
        return this.#tokens;
    }

    get widgets(): Widgets {
        return this.#widgets;
    }

    readonly #homey: Homey;
    readonly #modes: Modes;
    readonly #registry: Registry;
    readonly #timers: Timers;
    readonly #tokens: Tokens;
    readonly #widgets: Widgets;

    constructor(homey: Homey) {
        this.#homey = homey;
        this.#modes = new Modes(this);
        this.#registry = new Registry(this);
        this.#timers = new Timers(this);
        this.#tokens = new Tokens(this);
        this.#widgets = new Widgets(this);
    }
}
