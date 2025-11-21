import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function list({homey}: WidgetApiRequest<FlowBitsApp>): Promise<Flag[]> {
    return await homey.app.api.getFlags();
}

export async function toggle({homey, body}: WidgetApiRequest<FlowBitsApp>): Promise<boolean> {
    return await homey.app.api.toggleFlag(body.flag);
}

type Flag = {
    readonly active: boolean;
    readonly name: string;
};
