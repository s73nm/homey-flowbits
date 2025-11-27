import { Shortcuts } from '@basmilius/homey-common';
import type { Flag, FlowBitsApp, Mode, Statistics } from '../types';

export default class extends Shortcuts<FlowBitsApp> {
    async activateFlag(flagName: string): Promise<boolean> {
        const flag = await this.app.flags.find(flagName);

        if (!flag || flag.active) {
            return false;
        }

        await this.app.flags.activate(flag.name);

        return true;
    }

    async deactivateFlag(flagName: string): Promise<boolean> {
        const flag = await this.app.flags.find(flagName);

        if (!flag || !flag.active) {
            return false;
        }

        await this.app.flags.deactivate(flag.name);

        return true;
    }

    async toggleFlag(flagName: string): Promise<boolean> {
        const flag = await this.app.flags.find(flagName);

        if (!flag) {
            return false;
        }

        if (flag.active) {
            await this.app.flags.deactivate(flag.name);
        } else {
            await this.app.flags.activate(flag.name);
        }

        return true;
    }

    async getFlags(): Promise<Flag[]> {
        return await this.app.flags.getFlags();
    }

    async setFlagLook(flagName: string, color: string, icon: string): Promise<boolean> {
        const flag = await this.app.flags.find(flagName);

        if (!flag) {
            return false;
        }

        await this.app.flags.setLook(flag.name, [color, icon]);

        return true;
    }

    async activateMode(modeName: string): Promise<boolean> {
        const mode = await this.app.modes.find(modeName);

        if (!mode || mode.active) {
            return false;
        }

        await this.app.modes.activate(mode.name);

        return true;
    }

    async deactivateMode(modeName: string): Promise<boolean> {
        const mode = await this.app.modes.find(modeName);

        if (!mode || !mode.active) {
            return false;
        }

        await this.app.modes.deactivate(mode.name);

        return true;
    }

    async toggleMode(modeName: string): Promise<boolean> {
        const mode = await this.app.modes.find(modeName);

        if (!mode) {
            return false;
        }

        if (mode.active) {
            await this.app.modes.deactivate(mode.name);
        } else {
            await this.app.modes.activate(mode.name);
        }

        return true;
    }

    async getCurrentMode(): Promise<string | null> {
        return this.app.modes.currentMode;
    }

    async getModes(): Promise<Mode[]> {
        return await this.app.modes.getModes();
    }

    async setModeLook(modeName: string, color: string, icon: string): Promise<boolean> {
        const mode = await this.app.modes.find(modeName);

        if (!mode) {
            return false;
        }

        await this.app.modes.setLook(mode.name, [color, icon]);

        return true;
    }

    async getStatistics(): Promise<Statistics> {
        const flags = await this.app.flags.getFlags();
        const modes = await this.app.modes.getModes();

        return {
            currentFlags: flags.filter(flag => flag.active).map(flag => flag.name),
            currentMode: modes.find(mode => mode.active)?.name ?? null,

            numberOfCycles: await this.app.cycles.getCount(),
            numberOfFlags: await this.app.flags.getCount(),
            numberOfModes: await this.app.modes.getCount(),
            numberOfNoRepeats: await this.app.noRepeat.getCount(),
            numberOfSliders: await this.app.sliders.getCount(),
            numberOfTimers: await this.app.timers.getCount(),

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
