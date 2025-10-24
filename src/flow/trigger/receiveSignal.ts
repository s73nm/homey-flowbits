import { SignalAutocompleteProvider } from '../autocomplete';
import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

@trigger('receive_signal')
export default class extends BaseTrigger<Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('signal', SignalAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.signal.name === state.signal;
    }
}

type Args = {
    readonly signal: {
        readonly name: string;
    };
};

type State = {
    readonly signal: string;
};
