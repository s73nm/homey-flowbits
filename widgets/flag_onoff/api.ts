import type Homey from 'homey/lib/Homey';
import type App from '../../src/index';

export async function state({homey, query}: WidgetRequest): Promise<Result> {
    const flags = await homey.app.widgets.getFlags();

    return {
        active: flags.some(flag => flag.active && flag.name === query.flag),
        icon: await icon(homey, query.flag)
    };
}

export async function toggle({homey, body}: WidgetRequest): Promise<boolean> {
    return await homey.app.widgets.toggleFlag(body.flag);
}

async function icon(homey: WidgetRequest['homey'], mode: string): Promise<ModeIcon | null> {
    const prefix = homey.__('widget.current_mode.prefix');
    const suffix = homey.__('widget.current_mode.suffix');

    return await homey.app.widgets.getModeIcon(mode, prefix, suffix);
}

type ModeIcon = {
    readonly color: string;
    readonly unicode: string;
    readonly unicodeSecondary: string;
};

type Result = {
    readonly active: boolean;
    readonly icon: ModeIcon | null;
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
