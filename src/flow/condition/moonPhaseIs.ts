import { condition, DateTime, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { getMoonPhase, type MoonPhase } from '../../util';

@condition('moon_phase_is')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onRun(args: Args): Promise<boolean> {
        const now = DateTime.now();
        const moonPhase = getMoonPhase(now);

        return moonPhase === args.value;
    }
}

type Args = {
    readonly value: MoonPhase;
};
