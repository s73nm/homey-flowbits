import { DateTime } from 'luxon';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('is_day_period')
export default class extends BaseCondition<Args, never> {
    async onRun(args: Args): Promise<boolean> {
        const {getDayPeriod} = await import('@basmilius/utils');

        const now = DateTime.now();
        const dayPeriod = await getDayPeriod(now);

        return dayPeriod === args.value;
    }
}

type Args = {
    // @ts-ignore
    readonly value: import('@basmilius/utils').DayPeriod;
};
