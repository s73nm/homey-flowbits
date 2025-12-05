import { DateTime, Shortcuts } from '@basmilius/homey-common';
import { REALTIME_LABELS_UPDATE, SETTING_LABEL_LOOKS, SETTING_LABELS } from '../const';
import { AutocompleteProviders, Triggers } from '../flow';
import type { Event, FlowBitsApp, Label, Look } from '../types';

export default class extends Shortcuts<FlowBitsApp> {
    get labels(): Record<string, [string, DateTime]> {
        return Object.fromEntries(
            Object.entries<[string, string]>(this.settings.get(SETTING_LABELS) ?? {})
                .map(([key, [value, lastUpdate]]) => [
                    key,
                    [value, DateTime.fromISO(lastUpdate)]
                ])
        );
    }

    set labels(value: Record<string, [string, DateTime]>) {
        this.settings.set(SETTING_LABELS, Object.fromEntries(
            Object.entries(value)
                .map(([key, [value, lastUpdate]]) => [
                    key,
                    [value, lastUpdate.toISO()]
                ])
        ));
    }

    get looks(): Record<string, Look> {
        return this.settings.get(SETTING_LABEL_LOOKS) ?? {};
    }

    set looks(value: Record<string, Look>) {
        this.settings.set(SETTING_LABEL_LOOKS, value);
    }

    async find(name: string): Promise<Label | null> {
        const labels = await this.getLabels();
        const label = labels.find(label => label.name === name);

        return label ?? null;
    }

    async getCount(): Promise<number> {
        const labels = await this.getLabels();

        return labels.length;
    }

    async getLabels(): Promise<Event[]> {
        const provider = this.#autocompleteProvider();
        const labels = await provider.find('');

        if (labels.length === 0) {
            return [];
        }

        const results: Event[] = [];

        for (const label of labels) {
            const look = await this.getLook(label.name);
            const data = this.labels[label.name] ?? null;

            results.push({
                color: look?.[0],
                icon: look?.[1],
                lastUpdate: data?.[1]?.toISO() ?? undefined,
                name: label.name
            });
        }

        return results;
    }

    async clearValue(name: string): Promise<void> {
        const labels = this.labels;
        delete labels[name];
        this.labels = labels;

        await this.#triggerChanged(name);
    }

    async getValue(name: string): Promise<string | null> {
        return this.labels[name]?.[0] ?? null;
    }

    async hasValue(name: string, value: string): Promise<boolean> {
        return name in this.labels && this.labels[name]?.[0] === value;
    }

    async setValue(name: string, value: string): Promise<void> {
        this.labels = {
            ...this.labels,
            [name]: [value, DateTime.now()]
        };

        await Promise.allSettled([
            this.#triggerBecomes(name, value),
            this.#triggerChanged(name)
        ]);
    }

    async getLook(name: string): Promise<Look | null> {
        return this.looks[name] ?? ['#204ef6', ''];
    }

    async setLook(name: string, look: Look): Promise<void> {
        this.looks = {
            ...this.looks,
            [name]: look
        };

        await this.#triggerRealtime();
    }

    async update(): Promise<void> {
        await this.#triggerRealtime();
    }

    async #triggerBecomes(name: string, value: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.LabelBecomes)
            ?.trigger({name, value});
    }

    async #triggerChanged(name: string): Promise<void> {
        this.registry
            .findTrigger(Triggers.LabelChanged)
            ?.trigger({name});
    }

    async #triggerRealtime(): Promise<void> {
        this.realtime(REALTIME_LABELS_UPDATE);
    }

    #autocompleteProvider(): AutocompleteProviders.Label {
        const provider = this.registry.findAutocompleteProvider(AutocompleteProviders.Label);

        if (!provider) {
            throw new Error('Failed to get the label autocomplete provider.');
        }

        return provider;
    }
}
