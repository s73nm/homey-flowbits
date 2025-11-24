import { FlowTriggerEntity, trigger } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../types';
import { AutocompleteProviders } from '..';

@trigger('flag_deactivated')
export default class extends FlowTriggerEntity<FlowBitsApp, Args, State> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('flag', AutocompleteProviders.Flag);

        await super.onInit();
    }

    async onRun(args: Args, state: State): Promise<boolean> {
        return args.flag.name === state.name;
    }

    async onUpdate(): Promise<void> {
        await this.app.flags.update();
    }
}

type Args = {
    readonly flag: {
        readonly name: string;
    };
};

type State = {
    readonly name: string;
};
