import { action, FlowActionEntity } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

@action('event_clear_all')
export default class extends FlowActionEntity<FlowBitsApp> {
    async onRun(): Promise<void> {
        await this.app.events.clearAll();
    }
}
