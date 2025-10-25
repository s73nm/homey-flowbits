import Homey from 'homey';
import { Settings } from 'luxon';
import { Brain, type Widgets } from './brain';

import * as Actions from './flow/action';
import * as AutocompleteProviders from './flow/autocomplete';
import * as Conditions from './flow/condition';
import * as Triggers from './flow/trigger';

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

        await this.#brain.timers.initialize();
        await this.#brain.tokens.initialize();

        this.log('FlowBits has been initialized!');
    }

    #registerActions(): void {
        this.#brain.registry.action(Actions.Cycle);
        this.#brain.registry.action(Actions.CycleBetween);
        this.#brain.registry.action(Actions.CycleTo);
        this.#brain.registry.action(Actions.ModeActivate);
        this.#brain.registry.action(Actions.ModeDeactivate);
        this.#brain.registry.action(Actions.ModeToggle);
        this.#brain.registry.action(Actions.RandomFact);
        this.#brain.registry.action(Actions.SignalSend);
        this.#brain.registry.action(Actions.TimerExtend);
        this.#brain.registry.action(Actions.TimerPause);
        this.#brain.registry.action(Actions.TimerResume);
        this.#brain.registry.action(Actions.TimerSet);
        this.#brain.registry.action(Actions.TimerShorten);
        this.#brain.registry.action(Actions.TimerStart);
        this.#brain.registry.action(Actions.TimerStop);
    }

    async #registerActionFunctions(): Promise<void> {
        const {roundStep} = await import('@basmilius/utils');

        this.#brain.registry.actionFunction('z_math_make_negative', args => ({result: args.value < 0 ? args.value : -args.value}));
        this.#brain.registry.actionFunction('z_math_make_positive', args => ({result: Math.abs(args.value)}));
        this.#brain.registry.actionFunction('z_math_round', args => ({result: Math.round(args.value)}));
        this.#brain.registry.actionFunction('z_math_round_down', args => ({result: Math.floor(args.value)}));
        this.#brain.registry.actionFunction('z_math_round_step', args => ({result: roundStep(args.value, args.step)}));
        this.#brain.registry.actionFunction('z_math_round_up', args => ({result: Math.ceil(args.value)}));
    }

    #registerAutocompleteProviders(): void {
        this.#brain.registry.autocompleteProvider(AutocompleteProviders.Cycle);
        this.#brain.registry.autocompleteProvider(AutocompleteProviders.Mode);
        this.#brain.registry.autocompleteProvider(AutocompleteProviders.SchoolVacation);
        this.#brain.registry.autocompleteProvider(AutocompleteProviders.Signal);
        this.#brain.registry.autocompleteProvider(AutocompleteProviders.Timer);
    }

    #registerConditions(): void {
        this.#brain.registry.condition(Conditions.ContinueWithChance);
        this.#brain.registry.condition(Conditions.CycleHasValue);
        this.#brain.registry.condition(Conditions.DayPeriodIs);
        this.#brain.registry.condition(Conditions.ModeIs);
        this.#brain.registry.condition(Conditions.MoonPhaseIs);
        this.#brain.registry.condition(Conditions.SchoolHolidayIs);
        this.#brain.registry.condition(Conditions.TimerDuration);
        this.#brain.registry.condition(Conditions.TimerFinished);
        this.#brain.registry.condition(Conditions.TimerPaused);
        this.#brain.registry.condition(Conditions.TimerRunning);
        this.#brain.registry.condition(Conditions.ZodiacSignIs);
    }

    #registerTriggers(): void {
        this.#brain.registry.trigger(Triggers.CycleBecomes);
        this.#brain.registry.trigger(Triggers.CycleUpdates);
        this.#brain.registry.trigger(Triggers.DayPeriodBecomes);
        this.#brain.registry.trigger(Triggers.DayPeriodOver);
        this.#brain.registry.trigger(Triggers.ModeActivated);
        this.#brain.registry.trigger(Triggers.ModeDeactivated);
        this.#brain.registry.trigger(Triggers.SignalReceive);
        this.#brain.registry.trigger(Triggers.TimerFinished);
        this.#brain.registry.trigger(Triggers.TimerPaused);
        this.#brain.registry.trigger(Triggers.TimerRemaining);
        this.#brain.registry.trigger(Triggers.TimerResumed);
        this.#brain.registry.trigger(Triggers.TimerStarted);
        this.#brain.registry.trigger(Triggers.TimerStopped);
    }
}
