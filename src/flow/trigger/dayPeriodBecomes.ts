import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import type { DayPeriod } from '../../util';

@trigger('day_period_becomes')
export default class extends FlowTriggerEntity<FlowBitsApp, Args, State> {
    async onRun(args: Args, state: State): Promise<boolean> {
        return args.value === state.value;
    }
}

type Args = {
    readonly value: DayPeriod;
};

type State = {
    readonly value: DayPeriod;
};
