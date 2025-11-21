import type App from './index';

export type FlowBitsApp = App;

export type ClockState =
    | 'finished'
    | 'running'
    | 'paused';

export type ClockUnit =
    | 'seconds'
    | 'minutes'
    | 'hours'
    | 'days';

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
