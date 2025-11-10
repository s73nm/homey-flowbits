// @ts-ignore
import type { ZodiacSign } from '@basmilius/utils';
import { DateTime } from 'luxon';
import { BaseCondition } from '../base';
import { condition } from '../decorator';

@condition('zodiac_sign_is')
export default class extends BaseCondition<Args, never> {
    async onRun(args: Args, _: never): Promise<boolean> {
        const {getZodiacSign} = await import('@basmilius/utils');

        const now = DateTime.now();
        const zodiacSign = await getZodiacSign(now);

        return zodiacSign === args.value;
    }
}

type Args = {
    readonly value: ZodiacSign;
};
