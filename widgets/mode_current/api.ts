import type Homey from 'homey/lib/Homey';
import type App from '../../src/index';

export async function get({homey}: WidgetRequest): Promise<Result | null> {
    const mode = await homey.app.widgets.getCurrentMode();

    if (!mode) {
        return null;
    }

    return {
        icon: await icon(homey, mode),
        name: mode
    };
}

async function icon(homey: WidgetRequest['homey'], mode: string): Promise<ModeIcon | null> {
    const prefix = homey.__('widget.current_mode.prefix');
    const suffix = homey.__('widget.current_mode.suffix');

    return await homey.app.widgets.getModeIcon(mode, prefix, suffix);
}

type Result = {
    readonly icon: ModeIcon | null;
    readonly name: string;
};

type ModeIcon = {
    readonly color: string;
    readonly unicode: string;
    readonly unicodeSecondary: string;
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
