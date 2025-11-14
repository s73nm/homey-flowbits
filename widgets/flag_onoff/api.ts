import type Homey from 'homey/lib/Homey';
import type App from '../../src/index';

export async function state({homey, query}: WidgetRequest): Promise<Result> {
    const flags = await homey.app.widgets.getFlags();
    const flag = flags.find(flag => flag.name === query.flag);

    return {
        active: flag?.active ?? false,
        color: flag?.color,
        icon: flag?.icon
    };
}

export async function toggle({homey, body}: WidgetRequest): Promise<boolean> {
    return await homey.app.widgets.toggleFlag(body.flag);
}

type Result = {
    readonly active: boolean;
    readonly color: string | undefined;
    readonly icon: string | undefined;
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
