import type { WidgetApiRequest } from '../../src/types';

export async function list({homey}: WidgetApiRequest): Promise<Mode[]> {
    return await homey.app.api.getModes();
}

export async function toggle({homey, body}: WidgetApiRequest): Promise<boolean> {
    return await homey.app.api.toggleMode(body.mode);
}

type Mode = {
    readonly active: boolean;
    readonly name: string;
};
