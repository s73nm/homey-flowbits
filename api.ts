import type { ApiRequest, Color, Flag, Icon, Mode, Statistics } from './src/types';

export async function activateFlag({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.activateFlag(body.flag);
}

export async function activateMode({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.activateMode(body.mode);
}

export async function deactivateFlag({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.deactivateFlag(body.flag);
}

export async function deactivateMode({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.deactivateMode(body.mode);
}

export async function toggleFlag({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.toggleFlag(body.flag);
}

export async function toggleMode({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.toggleMode(body.mode);
}

export async function getFlags({homey}: ApiRequest): Promise<Flag[]> {
    return await homey.app.api.getFlags();
}

export async function getModes({homey}: ApiRequest): Promise<Mode[]> {
    return await homey.app.api.getModes();
}

export async function getColors({homey}: ApiRequest): Promise<Color[]> {
    return await homey.app.api.getColors();
}

export async function getIcons({homey}: ApiRequest): Promise<Icon[]> {
    return await homey.app.api.getIcons();
}

export async function setFlagLook({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.setFlagLook(body.name, body.color, body.icon);
}

export async function setModeLook({homey, body}: ApiRequest): Promise<boolean> {
    return await homey.app.api.setModeLook(body.name, body.color, body.icon);
}

export async function getStatistics({homey}: ApiRequest): Promise<Statistics> {
    return await homey.app.api.getStatistics();
}
