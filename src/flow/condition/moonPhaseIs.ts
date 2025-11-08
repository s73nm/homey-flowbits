// @ts-ignore
import { getMoonPhase, type MoonPhase } from '@basmilius/utils';
import { DateTime } from 'luxon';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('moon_phase_is')
export default class extends BaseCondition<Args, never> {
    async onRun(args: Args): Promise<boolean> {
        const now = DateTime.now();
        const moonPhase = await getMoonPhase(now);

        return moonPhase === args.value;
    }
}

type Args = {
    readonly value: MoonPhase;
};
