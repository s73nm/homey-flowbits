import type Homey from 'homey/lib/Homey';
import type { FlowCard, FlowCardAction, FlowCardCondition, FlowCardTrigger } from 'homey';
import type { AutocompleteProvider, Brain } from '../brain';

export abstract class BaseFlowEntity<T extends FlowCard, TArgs = unknown, TState = unknown, TResult = unknown> {
    get brain(): Brain {
        return this.#brain;
    }

    get card(): T {
        return this.#card;
    }

    get homey(): Homey {
        return this.#brain.homey;
    }

    get id(): string {
        return this.#card.id;
    }

    get type(): 'action' | 'condition' | 'trigger' {
        return this.#card.type;
    }

    readonly #brain: Brain;
    readonly #card: T;

    constructor(brain: Brain) {
        this.#brain = brain;
        this.#card = this.#getCard();

        this.onInit();
    }

    log(...args: any[]): void {
        this.homey.log(...args);
    }

    async onInit(): Promise<void> {
        this.#card.registerRunListener(this.onRun.bind(this));
        this.#card.on('update', this.onUpdate.bind(this));

        this.log(`onInit() -> Flow card ${this.type}#${this.id} has been registered.`);
    }

    abstract onRun(args: TArgs, state: TState): Promise<TResult>;

    async onUpdate(): Promise<void> {
    }

    registerAutocomplete<T extends BaseAutocompleteProvider>(name: string, autocompleteProvider: AutocompleteProvider<T>): void {
        const provider = this.#brain.registry.findAutocompleteProvider(autocompleteProvider);

        if (!provider) {
            throw new Error(`Unable to register autocomplete for ${this.type}#${this.id}. The provider was not registered.`);
        }

        this.#card.registerArgumentAutocompleteListener(name, provider.find.bind(provider));
    }

    #getCard(): T {
        if (this instanceof BaseAction) {
            return this.homey.flow.getActionCard((this as any).actionId) as unknown as T;
        }

        if (this instanceof BaseCondition) {
            return this.homey.flow.getConditionCard((this as any).conditionId) as unknown as T;
        }

        if (this instanceof BaseTrigger) {
            return this.homey.flow.getTriggerCard((this as any).triggerId) as unknown as T;
        }

        throw new Error('Cannot find the card type.');
    }
}

export abstract class BaseAction<TArgs = unknown, TState = unknown, TResult = unknown> extends BaseFlowEntity<FlowCardAction, TArgs, TState, TResult> {
}

export abstract class BaseCondition<TArgs = unknown, TState = unknown> extends BaseFlowEntity<FlowCardCondition, TArgs, TState, boolean> {
}

export abstract class BaseTrigger<TArgs = unknown, TState = unknown> extends BaseFlowEntity<FlowCardTrigger, TArgs, TState, boolean> {
    async trigger(state: TState, tokens?: Record<string, unknown>): Promise<any> {
        return this.card.trigger(tokens, state as object);
    }
}

export abstract class BaseAutocompleteProvider {
    get brain(): Brain {
        return this.#brain;
    }

    get homey(): Homey {
        return this.#brain.homey;
    }

    readonly #brain: Brain;

    constructor(brain: Brain) {
        this.#brain = brain;
    }

    abstract find(query: string, args: Record<string, unknown>): Promise<FlowCard.ArgumentAutocompleteResults>;

    abstract update(): Promise<void>

    async onInit(): Promise<void> {
        this.#brain.homey.log(`onInit() -> Autocomplete provider ${this.constructor.name} has been registered.`);
        await this.update();
    }
}
