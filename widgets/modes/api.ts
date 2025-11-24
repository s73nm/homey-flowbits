import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function list({homey: {app}}: WidgetApiRequest<FlowBitsApp>): Promise<Mode[]> {
    return await app.api.getModes();
}

export async function toggle({homey: {app}, body}: WidgetApiRequest<FlowBitsApp, Body>): Promise<boolean> {
    return await app.api.toggleMode(body.mode);
}

type Mode = {
    readonly active: boolean;
    readonly name: string;
};

type Body = {
    readonly mode: string;
};
