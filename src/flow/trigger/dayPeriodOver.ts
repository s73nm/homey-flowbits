import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

@trigger('day_period_over')
export default class DayperiodOverTrigger extends BaseTrigger<Args, State> {
    async onRun(args: Args, state: State): Promise<boolean> {
        return args.value === state.previousValue;
    }
}

type Args = {
    // @ts-ignore
    readonly value: import('@basmilius/utils').DayPeriod;
};

type State = {
    // @ts-ignore
    readonly previousValue: import('@basmilius/utils').DayPeriod;
};
