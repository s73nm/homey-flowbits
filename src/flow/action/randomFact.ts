import { BaseAction } from '../base';
import { action } from '../decorator';
import facts from '../../data/facts';

@action('random_fact')
export default class extends BaseAction<never, never, Result> {
    async onRun(): Promise<Result> {
        const locale = this.language as 'nl' | 'en';
        const fact = facts[Math.floor(Math.random() * facts.length)];
        const randomFact = locale in fact ? fact[locale] : fact['en'];

        return {randomFact};
    }
}

type Result = {
    readonly randomFact: string;
};
