import type Homey from 'homey';
import type App from '../../src/index';

export async function state({homey, query}: WidgetRequest): Promise<boolean> {
    const flags = await homey.app.widgets.getFlags();

    return flags.some(flag => flag.active && flag.name === query.flag);
}

export async function toggle({homey, body}: WidgetRequest): Promise<boolean> {
    return await homey.app.widgets.toggleFlag(body.flag);
}

type WidgetRequest = {
    readonly homey: typeof Homey & {
        readonly app: App;
    };
    readonly body: any;
    readonly params: Record<string, unknown>;
    readonly query: Record<string, string>;
    readonly widgetInstanceId: string;
};
