import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function get({homey: {app}, query}: WidgetApiRequest<FlowBitsApp, never, never, Query>): Promise<number | null> {
    return await app.widgets.getSliderValue(query.slider);
}

export async function set({homey: {app}, query, body, widgetInstanceId}: WidgetApiRequest<FlowBitsApp, Body, never, Query>): Promise<boolean> {
    await app.widgets.setSliderValue(query.slider, body.value, widgetInstanceId);

    return true;
}

type Query = {
    readonly slider: string;
};

type Body = {
    readonly value: number;
};
