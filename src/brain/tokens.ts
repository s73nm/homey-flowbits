import type { FlowToken } from 'homey';
import { DateTime } from 'luxon';
import { DayPeriodBecomesTrigger, DayPeriodOverTrigger } from '../flow/trigger';
import type Brain from './brain';
import type { Trigger } from './registry';

type Provider<T extends string | boolean | number> = (state: State) => T;
type Translator<T> = (value: T) => string;

type State = {
    readonly now: DateTime;
};

type RawToken = [FlowToken, Provider<string | boolean | number>];
type TranslatedToken = [...RawToken, FlowToken, Translator<any>];
type Token = RawToken | TranslatedToken;

const TRIGGERS: Record<string, Trigger<any>[]> = {
    day_period: [DayPeriodBecomesTrigger, DayPeriodOverTrigger]
};

export default class Tokens {
    readonly #brain: Brain;
    readonly #tokens: Record<string, Token>;
    readonly #values: Record<string, string | boolean | number>;

    #state!: State;

    constructor(brain: Brain) {
        this.#brain = brain;
        this.#tokens = {};
        this.#values = {};
    }

    async create<T extends string | boolean | number>(id: string, type: string, provider: Provider<T>, translator?: Translator<T>): Promise<void> {
        const value = provider(this.#state);
        this.#values[id] = value;

        const token = await this.#brain.homey.flow.createToken(id, {
            title: this.#brain.homey.__(`token.${id}`),
            type,
            value
        });

        if (translator) {
            const translated = await this.#brain.homey.flow.createToken(`${id}_translated`, {
                title: this.#brain.homey.__(`token.${id}_translated`),
                type,
                value: translator(value)
            });

            this.#tokens[id] = [token, provider, translated, translator];
        } else {
            this.#tokens[id] = [token, provider];
        }
    }

    async register(): Promise<void> {
        const {getDayPeriod, getMoonPhase, getZodiacSign} = await import('@basmilius/utils');

        this.#state = await this.state();

        await this.create('day_period', 'string', ({now}) => getDayPeriod(now), value => this.#t(`day_period.${value}`));
        await this.create('moon_phase', 'string', ({now}) => getMoonPhase(now), value => this.#t(`day_period.${value}`));
        await this.create('zodiac_sign', 'string', ({now}) => getZodiacSign(now), value => this.#t(`day_period.${value}`));

        this.#brain.homey.setInterval(async () => await this.#brain.tokens.update(), 15 * 1000);
    }

    async state(): Promise<State> {
        return {
            now: DateTime.now()
        };
    }

    async update(): Promise<void> {
        this.#state = await this.state();

        for (const [id, [token, provider, translated, translator]] of Object.entries(this.#tokens)) {
            const value = provider(this.#state);
            const previousValue = this.#values[id];

            if (value === previousValue) {
                continue;
            }

            if (id in TRIGGERS) {
                const triggers = TRIGGERS[id];

                for (const trigger of triggers) {
                    this.#brain.registry
                        .findTrigger(trigger)
                        ?.trigger({
                            value,
                            previousValue
                        });
                }
            }

            this.#values[id] = value;
            await token.setValue(value);

            translated && translator && await translated.setValue(translator(value));
        }

        this.#brain.homey.log('Global tokens updated.');
    }

    #t(key: string | Object, tags?: Object | undefined): string {
        return this.#brain.homey.__(key, tags);
    }
}
