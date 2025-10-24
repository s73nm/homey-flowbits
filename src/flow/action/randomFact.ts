import { BaseAction } from '../base';
import { action } from '../decorator';
import facts from '../../data/facts';

@action('random_fact')
export default class extends BaseAction<never, never> {
    async onRun(): Promise<object> {
        const locale = this.homey.i18n.getLanguage() as 'nl' | 'en';
        const fact = facts[Math.floor(Math.random() * facts.length)];
        const randomFact = locale in fact ? fact[locale] : fact['en'];

        return {randomFact};
    }
}
