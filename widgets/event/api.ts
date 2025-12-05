import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function get({homey: {app}, query}: WidgetApiRequest<FlowBitsApp, never, never, Query>): Promise<Result | null> {
    return await app.events.find(query.event);
}

type Query = {
    readonly event: string;
};

type Result = {
    readonly color: string | undefined;
    readonly icon: string | undefined;
    readonly name: string;
    readonly lastUpdate: string | undefined;
};
