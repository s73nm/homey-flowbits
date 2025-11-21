import { randomInt } from 'node:crypto';
import { condition, FlowConditionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

@condition('continue_with_chance')
export default class extends FlowConditionEntity<FlowBitsApp, Args, never> {
    async onRun(args: Args): Promise<boolean> {
        const chance = Number(args.chance) || 0;

        if (chance <= 0) {
            return false;
        }

        if (chance >= 100) {
            return true;
        }

        return randomInt(0, 100) < chance;
    }
}

type Args = {
    readonly chance: number;
};
