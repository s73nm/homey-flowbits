import type { WidgetApiRequest } from '../../src/types';

export async function state({homey, query}: WidgetApiRequest): Promise<Result> {
    const flags = await homey.app.widgets.getFlags();
    const flag = flags.find(flag => flag.name === query.flag);

    return {
        active: flag?.active ?? false,
        color: flag?.color,
        icon: flag?.icon
    };
}

export async function toggle({homey, body}: WidgetApiRequest): Promise<boolean> {
    return await homey.app.widgets.toggleFlag(body.flag);
}

type Result = {
    readonly active: boolean;
    readonly color: string | undefined;
    readonly icon: string | undefined;
};
