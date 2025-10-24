import Homey from 'homey';
import { Settings } from 'luxon';

import { Brain, type Widgets } from './brain';
import { ActivateModeAction, CycleAction, CycleBetweenAction, CycleToAction, DeactivateModeAction, RandomFactAction, SendSignalAction, ToggleModeAction } from './flow/action';
import { CycleAutocompleteProvider, ModeAutocompleteProvider, SchoolVacationAutocompleteProvider, SignalAutocompleteProvider } from './flow/autocomplete';
import { ContinueWithChanceCondition, CycleHasValueCondition, IsDayPeriodCondition, IsModeCondition, IsMoonPhaseCondition, IsSchoolHolidayCondition, IsZodiacSignCondition } from './flow/condition';
import { CycleBecomesTrigger, DayPeriodBecomesTrigger, DayPeriodOverTrigger, ModeActivatedTrigger, ModeDeactivatedTrigger, ReceiveSignalTrigger } from './flow/trigger';

export default class Index extends Homey.App {
    get widgets(): Widgets {
        return this.#brain.widgets;
    }

    #brain!: Brain;

    async onInit(): Promise<void> {
        this.#brain = new Brain(this.homey);

        Settings.defaultZone = this.homey.clock.getTimezone();

        this.#registerAutocompleteProviders();
        this.#registerActions();
        this.#registerConditions();
        this.#registerTriggers();

        await this.#registerActionFunctions();

        for (const provider of this.#brain.registry.autocompleteProviders) {
            await provider.onInit();
        }

        // register and update all tokens.
        await this.#brain.tokens.register();

        this.log('FlowBits has been initialized!');
    }

    #registerActions(): void {
        this.#brain.registry.action(ActivateModeAction);
        this.#brain.registry.action(CycleAction);
        this.#brain.registry.action(CycleBetweenAction);
        this.#brain.registry.action(CycleToAction);
        this.#brain.registry.action(DeactivateModeAction);
        this.#brain.registry.action(RandomFactAction);
        this.#brain.registry.action(SendSignalAction);
        this.#brain.registry.action(ToggleModeAction);
    }

    async #registerActionFunctions(): Promise<void> {
        const {roundStep} = await import('@basmilius/utils');

        this.#brain.registry.actionFunction('math_make_negative', args => ({result: args.value < 0 ? args.value : -args.value}));
        this.#brain.registry.actionFunction('math_make_positive', args => ({result: Math.abs(args.value)}));
        this.#brain.registry.actionFunction('math_round', args => ({result: Math.round(args.value)}));
        this.#brain.registry.actionFunction('math_round_down', args => ({result: Math.floor(args.value)}));
        this.#brain.registry.actionFunction('math_round_step', args => ({result: roundStep(args.value, args.step)}));
        this.#brain.registry.actionFunction('math_round_up', args => ({result: Math.ceil(args.value)}));
    }

    #registerAutocompleteProviders(): void {
        this.#brain.registry.autocompleteProvider(CycleAutocompleteProvider);
        this.#brain.registry.autocompleteProvider(ModeAutocompleteProvider);
        this.#brain.registry.autocompleteProvider(SchoolVacationAutocompleteProvider);
        this.#brain.registry.autocompleteProvider(SignalAutocompleteProvider);
    }

    #registerConditions(): void {
        this.#brain.registry.condition(ContinueWithChanceCondition);
        this.#brain.registry.condition(CycleHasValueCondition);
        this.#brain.registry.condition(IsDayPeriodCondition);
        this.#brain.registry.condition(IsModeCondition);
        this.#brain.registry.condition(IsMoonPhaseCondition);
        this.#brain.registry.condition(IsSchoolHolidayCondition);
        this.#brain.registry.condition(IsZodiacSignCondition);
    }

    #registerTriggers(): void {
        this.#brain.registry.trigger(CycleBecomesTrigger);
        this.#brain.registry.trigger(DayPeriodBecomesTrigger);
        this.#brain.registry.trigger(DayPeriodOverTrigger);
        this.#brain.registry.trigger(ModeActivatedTrigger);
        this.#brain.registry.trigger(ModeDeactivatedTrigger);
        this.#brain.registry.trigger(ReceiveSignalTrigger);
    }
}
