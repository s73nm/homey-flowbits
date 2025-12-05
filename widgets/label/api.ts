import type { WidgetApiRequest } from '@basmilius/homey-common';
import type { FlowBitsApp } from '../../src/types';

export async function get({homey: {app}, query}: WidgetApiRequest<FlowBitsApp, never, never, Query>): Promise<Result | null> {
    const label = await app.labels.find(query.label);

    if (!label) {
        return null;
    }

    return {
        ...label,
        value: await app.labels.getValue(label.name)
    };
}

type Query = {
    readonly label: string;
};

type Result = {
    readonly color: string | undefined;
    readonly icon: string | undefined;
    readonly name: string;
    readonly value: string | null;
};
