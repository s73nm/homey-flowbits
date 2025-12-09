import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp, Timer } from '../../src/types';

export async function get({homey: {app}, query}: WidgetApiRequest<FlowBitsApp, never, never, Query>): Promise<Timer | null> {
    return await app.timers.find(query.timer);
}

type Query = {
    readonly timer: string;
};
