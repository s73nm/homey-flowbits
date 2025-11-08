import type Homey from 'homey/lib/Homey';
import type App from '../../src/index';

export async function get({homey, query}: WidgetRequest): Promise<number | null> {
    return await homey.app.widgets.getSliderValue(query.slider);
}

export async function set({homey, query, body, widgetInstanceId}: WidgetRequest): Promise<boolean> {
    await homey.app.widgets.setSliderValue(query.slider, body.value, widgetInstanceId);

    return true;
}

type WidgetRequest = {
    readonly homey: Homey & {
        readonly app: App;
    };
    readonly body: any;
    readonly params: Record<string, unknown>;
    readonly query: Record<string, string>;
    readonly widgetInstanceId: string;
};
