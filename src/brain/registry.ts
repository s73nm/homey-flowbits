import type { BaseAction, BaseAutocompleteProvider, BaseCondition, BaseTrigger } from '../flow';
import type Brain from './brain';
import BrainAware from './aware';

export type Action<T extends BaseAction> = new (brain: Brain) => T;
export type AutocompleteProvider<T extends BaseAutocompleteProvider> = new (brain: Brain) => T;
export type Condition<T extends BaseCondition> = new (brain: Brain) => T;
export type Trigger<T extends BaseTrigger> = new (brain: Brain) => T;

export default class extends BrainAware {
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

    readonly #actions: BaseAction[] = [];
    readonly #autocompleteProviders: BaseAutocompleteProvider[] = [];
    readonly #conditions: BaseCondition[] = [];
    readonly #triggers: BaseTrigger[] = [];

    action<T extends BaseAction>(action: Action<T>): void {
        this.#actions.push(new action(this.brain));
    }

    actionFunction<TArgs = any, TResult = any>(id: string, onRun: (args: TArgs) => TResult): void {
        const action = this.homey.flow.getActionCard(id);
        action.registerRunListener(onRun);

        this.homey.log(`Flow card actionFunction#${id} has been registered.`);
    }

    autocompleteProvider<T extends BaseAutocompleteProvider>(autocompleteProvider: AutocompleteProvider<T>): void {
        this.#autocompleteProviders.push(new autocompleteProvider(this.brain));
    }

    condition<T extends BaseCondition>(condition: Condition<T>): void {
        this.#conditions.push(new condition(this.brain));
    }

    trigger<T extends BaseTrigger>(trigger: Trigger<T>): void {
        this.#triggers.push(new trigger(this.brain));
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
