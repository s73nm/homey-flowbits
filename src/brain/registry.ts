import type { BaseAction, BaseAutocompleteProvider, BaseCondition, BaseTrigger } from '../flow';
import type Brain from './brain';

export type Action<T extends BaseAction> = new (brain: Brain) => T;
export type AutocompleteProvider<T extends BaseAutocompleteProvider> = new (brain: Brain) => T;
export type Condition<T extends BaseCondition> = new (brain: Brain) => T;
export type Trigger<T extends BaseTrigger> = new (brain: Brain) => T;

export default class {
    get actions(): BaseAction[] {
        return this.#actions;
    }

    get autocompleteProviders(): BaseAutocompleteProvider[] {
        return this.#autocompleteProviders;
    }

    get conditions(): BaseCondition[] {
        return this.#conditions;
    }

    get triggers(): BaseTrigger[] {
        return this.#triggers;
    }

    readonly #brain: Brain;
    readonly #actions: BaseAction[] = [];
    readonly #autocompleteProviders: BaseAutocompleteProvider[] = [];
    readonly #conditions: BaseCondition[] = [];
    readonly #triggers: BaseTrigger[] = [];

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    action<T extends BaseAction>(action: Action<T>): void {
        this.#actions.push(new action(this.#brain));
    }

    autocompleteProvider<T extends BaseAutocompleteProvider>(autocompleteProvider: AutocompleteProvider<T>): void {
        this.#autocompleteProviders.push(new autocompleteProvider(this.#brain));
    }

    condition<T extends BaseCondition>(condition: Condition<T>): void {
        this.#conditions.push(new condition(this.#brain));
    }

    trigger<T extends BaseTrigger>(trigger: Trigger<T>): void {
        this.#triggers.push(new trigger(this.#brain));
    }

    findAction<T extends BaseAction>(action: Action<T>): T | undefined {
        return this.#actions.find(a => a instanceof action) as T;
    }

    findAutocompleteProvider<T extends BaseAutocompleteProvider>(autocompleteProvider: AutocompleteProvider<T>): T | undefined {
        return this.#autocompleteProviders.find(a => a instanceof autocompleteProvider) as T;
    }

    findCondition<T extends BaseCondition>(condition: Condition<T>): T | undefined {
        return this.#conditions.find(a => a instanceof condition) as T;
    }

    findTrigger<T extends BaseTrigger>(trigger: Trigger<T>): T | undefined {
        return this.#triggers.find(a => a instanceof trigger) as T;
    }
}
