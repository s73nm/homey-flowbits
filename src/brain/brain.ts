import type Homey from 'homey/lib/Homey';
import Registry from './registry';
import Tokens from './tokens';
import Widgets from './widgets';

export default class {
    get homey(): Homey {
        return this.#homey;
    }

    get registry(): Registry {
        return this.#registry;
    }

    get tokens(): Tokens {
        return this.#tokens;
    }

    get widgets(): Widgets {
        return this.#widgets;
    }

    readonly #homey: Homey;
    readonly #registry: Registry;
    readonly #tokens: Tokens;
    readonly #widgets: Widgets;

    constructor(homey: Homey) {
        this.#homey = homey;
        this.#registry = new Registry(this);
        this.#tokens = new Tokens(this);
        this.#widgets = new Widgets(this);
    }
}
