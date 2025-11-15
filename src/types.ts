import type Homey from 'homey/lib/Homey';
import type App from './index';

export type ClockState =
    | 'finished'
    | 'running'
    | 'paused';

export type ClockUnit =
    | 'seconds'
    | 'minutes'
    | 'hours'
    | 'days';

export type Language =
    | 'en'
    | 'nl'
    | 'de'
    | 'es'
    | 'fr'
    | 'it'
    | 'ko'
    | 'no'
    | 'pl'
    | 'ru'
    | 'sv';

export type Flag = {
    readonly active: boolean;
    readonly color: string | undefined;
    readonly icon: string | undefined;
    readonly name: string;
};

export type Mode = {
    readonly active: boolean;
    readonly color: string | undefined;
    readonly icon: string | undefined;
    readonly name: string;
};

export type Color = {
    readonly hex: string;
    readonly label: string;
};

export type Icon = {
    readonly id: string;
    readonly name: string;
    readonly unicode: string;
};

export type Look = [color: string, icon: string];

export type Statistics = {
    readonly currentFlags: string[];
    readonly currentMode: string | null;
    readonly numberOfCycles: number;
    readonly numberOfFlags: number;
    readonly numberOfModes: number;
    readonly numberOfNoRepeats: number;
    readonly numberOfSliders: number;
    readonly numberOfTimers: number;
    readonly runsPerFlowCard: Record<string, [string, number]>;
    readonly usagePerFlowCard: Record<string, [string, number]>;
};

export type ApiRequest = {
    readonly homey: Homey & {
        readonly app: App;
    };
    readonly body: any;
    readonly params: Record<string, unknown>;
    readonly query: Record<string, string>;
};

export type WidgetApiRequest = ApiRequest & {
    readonly widgetInstanceId: string;
};
