import { ModeAutocompleteProvider } from '../autocomplete';
import { BaseTrigger } from '../base';
import { trigger } from '../decorator';

@trigger('mode_deactivated')
export default class ModeDeactivatedTrigger extends BaseTrigger<Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('name', ModeAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.name.name === state.name;
    }
}

type Args = {
    readonly name: {
        readonly name: string;
    };
};

type State = {
    readonly name: string;
};
