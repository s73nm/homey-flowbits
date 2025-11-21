import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function state({homey, query}: WidgetApiRequest<FlowBitsApp>): Promise<Result> {
    const flags = await homey.app.api.getFlags();
    const flag = flags.find(flag => flag.name === query.flag);

    return {
        active: flag?.active ?? false,
        color: flag?.color,
        icon: flag?.icon
    };
}

export async function toggle({homey, body}: WidgetApiRequest<FlowBitsApp>): Promise<boolean> {
    return await homey.app.api.toggleFlag(body.flag);
}

type Result = {
    readonly active: boolean;
    readonly color: string | undefined;
    readonly icon: string | undefined;
};
