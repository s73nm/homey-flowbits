import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';

@trigger('mode_current_changed')
export default class extends FlowTriggerEntity<FlowBitsApp> {
    async onRun(): Promise<boolean> {
        return true;
    }
}
