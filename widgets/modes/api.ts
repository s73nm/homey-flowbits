import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function list({homey}: WidgetApiRequest<FlowBitsApp>): Promise<Mode[]> {
    return await homey.app.api.getModes();
}

export async function toggle({homey, body}: WidgetApiRequest<FlowBitsApp>): Promise<boolean> {
    return await homey.app.api.toggleMode(body.mode);
}

type Mode = {
    readonly active: boolean;
    readonly name: string;
};
