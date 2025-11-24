import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function get({homey: {app}}: WidgetApiRequest<FlowBitsApp>): Promise<Result | null> {
    const modes = await app.api.getModes();
    const mode = await app.api.getCurrentMode();
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
