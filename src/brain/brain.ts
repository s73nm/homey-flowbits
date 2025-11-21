import { Shortcuts } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../types';
import Api from './api';
import Cycles from './cycles';
import Flags from './flags';
import Modes from './modes';
import NoRepeat from './noRepeat';
import Sliders from './sliders';
import Timers from './timers';
import Tokens from './tokens';
import Widgets from './widgets';
import Metric from './metric';

export default class extends Shortcuts<FlowBitsApp> {
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

    get metric(): Metric {
        return this.#metric;
    }

    readonly #api: Api;
    readonly #cycles: Cycles;
    readonly #flags: Flags;
    readonly #modes: Modes;
    readonly #noRepeat: NoRepeat;
    readonly #sliders: Sliders;
    readonly #timers: Timers;
    readonly #tokens: Tokens;
    readonly #widgets: Widgets;
    readonly #metric: Metric;

    constructor(app: FlowBitsApp) {
        super(app);

        this.#api = new Api(app);
        this.#cycles = new Cycles(app);
        this.#flags = new Flags(app);
        this.#modes = new Modes(app);
        this.#noRepeat = new NoRepeat(app);
        this.#sliders = new Sliders(app);
        this.#timers = new Timers(app);
        this.#tokens = new Tokens(app);
        this.#widgets = new Widgets(app);
        this.#metric = new Metric(app);
    }
}
