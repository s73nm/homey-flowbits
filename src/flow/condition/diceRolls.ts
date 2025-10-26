import { randomInt } from 'node:crypto';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('dice_rolls')
export default class extends BaseCondition<Args, never> {
    async onRun(args: Args): Promise<boolean> {
        return randomInt(1, 6) === args.result;
    }
}

type Args = {
    readonly result: number;
};
