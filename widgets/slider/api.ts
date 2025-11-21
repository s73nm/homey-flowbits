import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function get({homey, query}: WidgetApiRequest<FlowBitsApp>): Promise<number | null> {
    return await homey.app.widgets.getSliderValue(query.slider);
}

export async function set({homey, query, body, widgetInstanceId}: WidgetApiRequest<FlowBitsApp>): Promise<boolean> {
    await homey.app.widgets.setSliderValue(query.slider, body.value, widgetInstanceId);

    return true;
}
