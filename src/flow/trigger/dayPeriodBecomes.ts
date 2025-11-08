// @ts-ignore
import type { DayPeriod } from '@basmilius/utils';
import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

@trigger('day_period_becomes')
export default class extends BaseTrigger<Args, State> {
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
