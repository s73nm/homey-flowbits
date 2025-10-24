import type Homey from 'homey';
import type App from '../../src/index';

export async function list({homey}: WidgetRequest): Promise<Mode[]> {
    return await homey.app.widgets.getModes();
}

export async function toggle({homey, body}: WidgetRequest): Promise<boolean> {
    return await homey.app.widgets.toggleMode(body.mode);
}

type Mode = {
    readonly active: boolean;
    readonly name: string;
};

type WidgetRequest = {
    readonly homey: typeof Homey & {
        readonly app: App;
    };
    readonly body: any;
    readonly params: Record<string, unknown>;
    readonly query: Record<string, string>;
    readonly widgetInstanceId: string;
};
