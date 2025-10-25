import { DateTime } from 'luxon';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('moon_phase_is')
export default class extends BaseCondition<Args, never> {
    async onRun(args: Args): Promise<boolean> {
        const {getMoonPhase} = await import('@basmilius/utils');

        const now = DateTime.now();
        const moonPhase = await getMoonPhase(now);

        return moonPhase === args.value;
    }
}

type Args = {
    // @ts-ignore
    readonly value: import('@basmilius/utils').MoonPhase;
};
