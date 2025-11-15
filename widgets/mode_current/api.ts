import type { WidgetApiRequest } from '../../src/types';

export async function get({homey}: WidgetApiRequest): Promise<Result | null> {
    const modes = await homey.app.widgets.getModes();
    const mode = await homey.app.widgets.getCurrentMode();
    const modeWithLook = modes.find(m => m.name === mode);

    if (!modeWithLook) {
        return null;
    }

    return {
        color: modeWithLook.color,
        icon: modeWithLook.icon,
        name: modeWithLook.name
    };
}

type Result = {
    readonly color: string | undefined;
    readonly icon: string | undefined;
    readonly name: string;
};
