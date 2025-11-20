import type { WidgetApiRequest } from '../../src/types';

export async function list({homey}: WidgetApiRequest): Promise<Flag[]> {
    return await homey.app.api.getFlags();
}

export async function toggle({homey, body}: WidgetApiRequest): Promise<boolean> {
    return await homey.app.api.toggleFlag(body.flag);
}

type Flag = {
    readonly active: boolean;
    readonly name: string;
};
