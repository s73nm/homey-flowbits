import type { WidgetApiRequest } from '../../src/types';

export async function get({homey, query}: WidgetApiRequest): Promise<number | null> {
    return await homey.app.widgets.getSliderValue(query.slider);
}

export async function set({homey, query, body, widgetInstanceId}: WidgetApiRequest): Promise<boolean> {
    await homey.app.widgets.setSliderValue(query.slider, body.value, widgetInstanceId);

    return true;
}
