import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function list({homey: {app}}: WidgetApiRequest<FlowBitsApp>): Promise<Flag[]> {
    return await app.api.getFlags();
}

export async function toggle({homey: {app}, body}: WidgetApiRequest<FlowBitsApp, Body>): Promise<boolean> {
    return await app.api.toggleFlag(body.flag);
}

type Flag = {
    readonly active: boolean;
    readonly name: string;
};

type Body = {
    readonly flag: string;
};
