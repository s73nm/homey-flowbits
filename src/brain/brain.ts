import type Homey from 'homey/lib/Homey';
import Registry from './registry';
import Tokens from './tokens';

export default class Brain {
    get homey(): Homey {
        return this.#homey;
    }

    get registry(): Registry {
        return this.#registry;
    }

    get tokens(): Tokens {
        return this.#tokens;
    }

    readonly #homey: Homey;
    readonly #registry: Registry;
    readonly #tokens: Tokens;

    constructor(homey: Homey) {
        this.#homey = homey;
        this.#registry = new Registry(this);
        this.#tokens = new Tokens(this);
    }
}
