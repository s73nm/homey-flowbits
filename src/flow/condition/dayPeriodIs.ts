import { condition, DateTime, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { type DayPeriod, getDayPeriod } from '../../util';

@condition('day_period_is')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onRun(args: Args): Promise<boolean> {
        const now = DateTime.now();
        const dayPeriod = getDayPeriod(now);

        return dayPeriod === args.value;
    }
}

type Args = {
    readonly value: DayPeriod;
};
