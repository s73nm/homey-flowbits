import { DateTime } from 'luxon';
import { getZodiacSign, type ZodiacSign } from '../../util';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('zodiac_sign_is')
export default class extends BaseCondition<Args, never> {
    async onRun(args: Args, _: never): Promise<boolean> {
        const now = DateTime.now();
        const zodiacSign = getZodiacSign(now);

        return zodiacSign === args.value;
    }
}

type Args = {
    readonly value: ZodiacSign;
};
