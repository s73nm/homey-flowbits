import type Homey from 'homey/lib/Homey';
import type { Color, Flag, Icon, Mode } from './src/types';
import type App from './src/index';

export async function activateFlag({homey, body}: Request): Promise<boolean> {
    return await homey.app.api.activateFlag(body.flag);
}

export async function activateMode({homey, body}: Request): Promise<boolean> {
    return await homey.app.api.activateMode(body.mode);
}

export async function deactivateFlag({homey, body}: Request): Promise<boolean> {
    return await homey.app.api.deactivateFlag(body.flag);
}

export async function deactivateMode({homey, body}: Request): Promise<boolean> {
    return await homey.app.api.deactivateMode(body.mode);
}

export async function getFlags({homey}: Request): Promise<Flag[]> {
    return await homey.app.widgets.getFlags();
}

export async function getModes({homey}: Request): Promise<Mode[]> {
    return await homey.app.widgets.getModes();
}

export async function getColors({homey}: Request): Promise<Color[]> {
    return await homey.app.api.getColors();
}

export async function getIcons({homey}: Request): Promise<Icon[]> {
    return await homey.app.api.getIcons();
}

export async function setFlagLook({homey, body}: Request): Promise<boolean> {
    return await homey.app.api.setFlagLook(body.name, body.color, body.icon);
}

export async function setModeLook({homey, body}: Request): Promise<boolean> {
    return await homey.app.api.setModeLook(body.name, body.color, body.icon);
}

type Request = {
    readonly homey: Homey & {
        readonly app: App;
    };
    readonly body: any;
    readonly params: Record<string, unknown>;
    readonly query: Record<string, string>;
};
