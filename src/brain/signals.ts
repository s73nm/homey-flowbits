import { Shortcuts } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../types';
import { Triggers } from '../flow';

// todo(Bas): Make signals a fully fledged Feature<>.

export default class Signals extends Shortcuts<FlowBitsApp> {
    async send(signal: string): Promise<void> {
        this.log(`Sending signal ${signal}.`);

        await this.#triggerReceive(signal);
    }

    async #triggerReceive(signal: string): Promise<void> {
        await this.registry
            .findTrigger(Triggers.SignalReceive)
            ?.trigger({signal});
    }
}
