import { flush, logger, metrics } from '@sentry/node';
import BrainAware from './aware';

export default class extends BrainAware {
    async initialize(): Promise<void> {
        await this.#start();
        await this.#update();

        this.setInterval(async () => await this.#update(), 60 * 60 * 1000);
    }

    async #start(): Promise<void> {
        logger.info(`FlowBits started on Homey ${this.homey.version}.`);
    }

    async #update(): Promise<void> {
        const {numberOfCycles, numberOfFlags, numberOfModes, numberOfNoRepeats, numberOfSliders, numberOfTimers} = await this.api.getStatistics();

        logger.info(`Running with ${numberOfCycles} cycles, ${numberOfFlags} flags, ${numberOfModes} modes, ${numberOfNoRepeats} no repeats, ${numberOfSliders} sliders and ${numberOfTimers} timers.`);

        metrics.gauge('cycles', numberOfCycles);
        metrics.gauge('flags', numberOfFlags);
        metrics.gauge('modes', numberOfModes);
        metrics.gauge('no_repeats', numberOfNoRepeats);
        metrics.gauge('sliders', numberOfSliders);
        metrics.gauge('timers', numberOfTimers);

        flush().catch(err => this.log('Metrics flush failed:', err));
    }
}
