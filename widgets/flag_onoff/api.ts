import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function state({homey: {app}, query}: WidgetApiRequest<FlowBitsApp, never, never, Query>): Promise<Result> {
    const flags = await app.api.getFlags();
    const flag = flags.find(flag => flag.name === query.flag);

    return {
        active: flag?.active ?? false,
        color: flag?.color,
        icon: flag?.icon
    };
}

export async function toggle({homey: {app}, body}: WidgetApiRequest<FlowBitsApp, Body>): Promise<boolean> {
    return await app.api.toggleFlag(body.flag);
}

type Result = {
    readonly active: boolean;
    readonly color: string | undefined;
    readonly icon: string | undefined;
};

type Body = {
    readonly flag: string;
};

type Query = {
    readonly flag: string;
};
