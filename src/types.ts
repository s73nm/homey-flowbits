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
