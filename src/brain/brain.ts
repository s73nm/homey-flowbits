import type Homey from 'homey/lib/Homey';
import Api from './api';
import Cycles from './cycles';
import Flags from './flags';
import Modes from './modes';
import NoRepeat from './noRepeat';
import Registry from './registry';
import Sliders from './sliders';
import Timers from './timers';
import Tokens from './tokens';
import Widgets from './widgets';

export default class {
    get homey(): Homey {
        return this.#homey;
    }

    get api(): Api {
        return this.#api;
    }

    get cycles(): Cycles {
        return this.#cycles;
    }

    get flags(): Flags {
        return this.#flags;
    }

    get modes(): Modes {
        return this.#modes;
    }

    get noRepeat(): NoRepeat {
        return this.#noRepeat;
    }

    get registry(): Registry {
        return this.#registry;
    }

    get sliders(): Sliders {
        return this.#sliders;
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
    readonly #api: Api;
    readonly #cycles: Cycles;
    readonly #flags: Flags;
    readonly #modes: Modes;
    readonly #noRepeat: NoRepeat;
    readonly #registry: Registry;
    readonly #sliders: Sliders;
    readonly #timers: Timers;
    readonly #tokens: Tokens;
    readonly #widgets: Widgets;

    constructor(homey: Homey) {
        this.#homey = homey;
        this.#registry = new Registry(this);
        this.#api = new Api(this);
        this.#cycles = new Cycles(this);
        this.#flags = new Flags(this);
        this.#modes = new Modes(this);
        this.#noRepeat = new NoRepeat(this);
        this.#sliders = new Sliders(this);
        this.#timers = new Timers(this);
        this.#tokens = new Tokens(this);
        this.#widgets = new Widgets(this);
    }
}
