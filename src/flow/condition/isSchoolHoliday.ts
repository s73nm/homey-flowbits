import { DateTime } from 'luxon';
import { SchoolVacationAutocompleteProvider } from '../autocomplete';
import { BaseCondition } from '../base';
import { condition } from '../decorator';
import schoolHolidays from '../../data/schoolHolidays';

@condition('is_school_holiday')
export default class extends BaseCondition<Args, never> {
    async onInit(): Promise<void> {
        this.registerAutocomplete('holiday', SchoolVacationAutocompleteProvider);

        await super.onInit();
    }

    async onRun(args: Args): Promise<boolean> {
        const date = DateTime.now();

        // A school year starts on August 1.
        const startYear = date.month >= 8 ? date.year : date.year - 1;
        const endYear = startYear + 1;

        const yearSet = schoolHolidays.find(s => s.schoolyear === `${startYear}-${endYear}`);

        if (!yearSet) {
            throw new Error('Cannot find holidays for the current school year.')
        }

        const vacations = yearSet.vacations.filter(v => v.type === args.holiday.name);

        if (vacations.length === 0) {
            return false;
        }

        const vacation = vacations.find(v => v.region === null || v.region === args.region);

        if (!vacation) {
            return false;
        }

        const start = DateTime.fromISO(vacation.start);
        const end = DateTime.fromISO(vacation.end);

        return start <= date && end >= date;
    }
}

type Args = {
    readonly holiday: {
        readonly name: string;
    };
    readonly region: 'north' | 'middle' | 'south';
};
