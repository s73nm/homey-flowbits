import type { Color, Flag, Icon, Mode, Statistics } from '../types';
import BrainAware from './aware';

import knownIcons from '../../assets/app/icons.json';

export default class extends BrainAware {
    async activateFlag(flagName: string): Promise<boolean> {
        const flag = await this.flags.find(flagName);

        if (!flag || flag.active) {
            return false;
        }

        await this.flags.activate(flag.name);

        return true;
    }

    async deactivateFlag(flagName: string): Promise<boolean> {
        const flag = await this.flags.find(flagName);

        if (!flag || !flag.active) {
            return false;
        }

        await this.flags.deactivate(flag.name);

        return true;
    }

    async toggleFlag(flagName: string): Promise<boolean> {
        const flag = await this.flags.find(flagName);

        if (!flag) {
            return false;
        }

        if (flag.active) {
            await this.flags.deactivate(flag.name);
        } else {
            await this.flags.activate(flag.name);
        }

        return true;
    }

    async getFlags(): Promise<Flag[]> {
        return await this.flags.getFlags();
    }

    async setFlagLook(flagName: string, color: string, icon: string): Promise<boolean> {
        const flag = await this.flags.find(flagName);

        if (!flag) {
            return false;
        }

        await this.flags.setLook(flag.name, [color, icon]);

        return true;
    }

    async activateMode(modeName: string): Promise<boolean> {
        const mode = await this.modes.find(modeName);

        if (!mode || mode.active) {
            return false;
        }

        await this.modes.activate(mode.name);

        return true;
    }

    async deactivateMode(modeName: string): Promise<boolean> {
        const mode = await this.modes.find(modeName);

        if (!mode || !mode.active) {
            return false;
        }

        await this.modes.deactivate(mode.name);

        return true;
    }

    async toggleMode(modeName: string): Promise<boolean> {
        const mode = await this.modes.find(modeName);

        if (!mode) {
            return false;
        }

        if (mode.active) {
            await this.modes.deactivate(mode.name);
        } else {
            await this.modes.activate(mode.name);
        }

        return true;
    }

    async getCurrentMode(): Promise<string | null> {
        return this.modes.currentMode;
    }

    async getModes(): Promise<Mode[]> {
        return await this.modes.getModes();
    }

    async setModeLook(modeName: string, color: string, icon: string): Promise<boolean> {
        const mode = await this.modes.find(modeName);

        if (!mode) {
            return false;
        }

        await this.modes.setLook(mode.name, [color, icon]);

        return true;
    }

    async getColors(): Promise<Color[]> {
        return [
            {hex: '#ef4444', label: this.translate('color.red')},
            {hex: '#f97316', label: this.translate('color.orange')},
            {hex: '#f59e0b', label: this.translate('color.amber')},
            {hex: '#eab308', label: this.translate('color.yellow')},
            {hex: '#84cc16', label: this.translate('color.lime')},
            {hex: '#22c55e', label: this.translate('color.green')},
            {hex: '#10b981', label: this.translate('color.emerald')},
            {hex: '#14b8a6', label: this.translate('color.teal')},
            {hex: '#06b6d4', label: this.translate('color.cyan')},
            {hex: '#0ea5e9', label: this.translate('color.sky')},
            {hex: '#3b82f6', label: this.translate('color.blue')},
            {hex: '#6366f1', label: this.translate('color.indigo')},
            {hex: '#8b5cf6', label: this.translate('color.violet')},
            {hex: '#a855f7', label: this.translate('color.purple')},
            {hex: '#d946ef', label: this.translate('color.fuchsia')},
            {hex: '#ec4899', label: this.translate('color.pink')},
            {hex: '#f43f5e', label: this.translate('color.rose')}
        ];
    }

    async getIcons(): Promise<Icon[]> {
        return knownIcons.map(icon => ({
            id: icon[0],
            name: icon[1],
            unicode: icon[2]
        }));
    }

    async getStatistics(): Promise<Statistics> {
        const flags = await this.flags.getFlags();
        const modes = await this.modes.getModes();

        return {
            currentFlags: flags.filter(flag => flag.active).map(flag => flag.name),
            currentMode: modes.find(mode => mode.active)?.name ?? null,

            numberOfCycles: await this.cycles.getCount(),
            numberOfFlags: await this.flags.getCount(),
            numberOfModes: await this.modes.getCount(),
            numberOfNoRepeats: await this.noRepeat.getCount(),
            numberOfSliders: await this.sliders.getCount(),
            numberOfTimers: await this.timers.getCount(),

            runsPerFlowCard: {},
            usagePerFlowCard: await this.#getStatisticsUsagePerFlowCard()
        };
    }

    async #getStatisticsUsagePerFlowCard(): Promise<Record<string, [string, number]>> {
        const result: Record<string, [string, number]> = {};

        for (const action of this.registry.actions) {
            const values = await action.card.getArgumentValues();
            result[action.id] = [action.card.manifest.titleFormatted[this.language], values.length];
        }

        for (const condition of this.registry.conditions) {
            const values = await condition.card.getArgumentValues();
            result[condition.id] = [condition.card.manifest.titleFormatted[this.language], values.length];
        }

        for (const trigger of this.registry.triggers) {
            const values = await trigger.card.getArgumentValues();
            result[trigger.id] = [trigger.card.manifest.titleFormatted[this.language], values.length];
        }

        return Object.fromEntries(
            Object.entries(result)
                .sort(([a], [b]) => a.localeCompare(b))
        );
    }
}
