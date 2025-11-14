import type Homey from 'homey/lib/Homey';
import type App from '../../src/index';

export async function get({homey}: WidgetRequest): Promise<Result | null> {
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

type WidgetRequest = {
    readonly homey: Homey & {
        readonly app: App;
    };
    readonly body: any;
    readonly params: Record<string, unknown>;
    readonly query: Record<string, string>;
    readonly widgetInstanceId: string;
};
