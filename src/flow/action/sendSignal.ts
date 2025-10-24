import { SignalAutocompleteProvider } from '../autocomplete';
import { BaseAction } from '../base';
import { action } from '../decorator';
import { ReceiveSignalTrigger } from '../trigger';

@action('send_signal')
export default class extends BaseAction<Args> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('signal', SignalAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<void> {
        this.brain.registry
            .findTrigger(ReceiveSignalTrigger)
            ?.trigger({signal: args.signal.name});
    }
}

type Args = {
    readonly signal: {
        readonly name: string;
    };
};
