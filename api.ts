import type { ApiRequest, Color, Icon } from '@basmilius/homey-common';
import type { Flag, FlowBitsApp, Mode, Statistics } from './src/types';

export async function activateFlag({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyFlag>): Promise<boolean> {
    return await app.api.activateFlag(body.flag);
}

export async function activateMode({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyMode>): Promise<boolean> {
    return await app.api.activateMode(body.mode);
}

export async function deactivateFlag({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyFlag>): Promise<boolean> {
    return await app.api.deactivateFlag(body.flag);
}

export async function deactivateMode({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyMode>): Promise<boolean> {
    return await app.api.deactivateMode(body.mode);
}

export async function toggleFlag({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyFlag>): Promise<boolean> {
    return await app.api.toggleFlag(body.flag);
}

export async function toggleMode({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyMode>): Promise<boolean> {
    return await app.api.toggleMode(body.mode);
}

export async function getFlags({homey: {app}}: ApiRequest<FlowBitsApp>): Promise<Flag[]> {
    return await app.api.getFlags();
}

export async function getModes({homey: {app}}: ApiRequest<FlowBitsApp>): Promise<Mode[]> {
    return await app.api.getModes();
}

export async function getColors({homey: {app}}: ApiRequest<FlowBitsApp>): Promise<Color[]> {
    return await app.api.getColors();
}

export async function getIcons({homey: {app}}: ApiRequest<FlowBitsApp>): Promise<Icon[]> {
    return await app.api.getIcons();
}

export async function setFlagLook({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyLook>): Promise<boolean> {
    return await app.api.setFlagLook(body.name, body.color, body.icon);
}

export async function setModeLook({homey: {app}, body}: ApiRequest<FlowBitsApp, BodyLook>): Promise<boolean> {
    return await app.api.setModeLook(body.name, body.color, body.icon);
}

export async function getStatistics({homey: {app}}: ApiRequest<FlowBitsApp>): Promise<Statistics> {
    return await app.api.getStatistics();
}

type BodyFlag = {
    readonly flag: string;
};

type BodyMode = {
    readonly mode: string;
};

type BodyLook = {
    readonly name: string;
    readonly color: string;
    readonly icon: string;
};
