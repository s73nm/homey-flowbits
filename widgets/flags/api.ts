import type { WidgetApiRequest } from '../../src/types';

export async function list({homey}: WidgetApiRequest): Promise<Flag[]> {
    return await homey.app.widgets.getFlags();
}

export async function toggle({homey, body}: WidgetApiRequest): Promise<boolean> {
    return await homey.app.widgets.toggleFlag(body.flag);
}

type Flag = {
    readonly active: boolean;
    readonly name: string;
};
