// @ts-ignore
import { type DayPeriod, getDayPeriod } from '@basmilius/utils';
import { DateTime } from 'luxon';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('day_period_is')
export default class extends BaseCondition<Args, never> {
    async onRun(args: Args): Promise<boolean> {
        const now = DateTime.now();
        const dayPeriod = await getDayPeriod(now);

        return dayPeriod === args.value;
    }
}

type Args = {
    readonly value: DayPeriod;
};
