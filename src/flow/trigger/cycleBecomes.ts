import { CycleAutocompleteProvider } from '../autocomplete';
import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

@trigger('cycle_becomes')
export default class extends BaseTrigger<Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', CycleAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.name.name === state.name && args.value === state.value;
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
    readonly value: number;
};

type State = {
    readonly name: string;
    readonly value: number;
};
