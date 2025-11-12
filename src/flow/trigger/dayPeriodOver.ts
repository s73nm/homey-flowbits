import type { DayPeriod } from '../../util';
import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

@trigger('day_period_over')
export default class extends BaseTrigger<Args, State> {
    async onRun(args: Args, state: State): Promise<boolean> {
        return args.value === state.previousValue;
    }
}

type Args = {
    readonly value: DayPeriod;
};

type State = {
    readonly previousValue: DayPeriod;
};
