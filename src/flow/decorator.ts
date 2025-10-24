type Constructor<T = {}> = new (...args: any[]) => T;

export function action(id: string) {
    return <T extends Constructor>(ActionClass: T): T => {
        return class extends ActionClass {
            get actionId(): string {
                return id;
            }

            constructor(...args: any[]) {
                super(...args);
            }
        };
    };
}

export function actionFunction(id: string) {

}

export function condition(id: string) {
    return <T extends Constructor>(ConditionClass: T): T => {
        return class extends ConditionClass {
            get conditionId(): string {
                return id;
            }

            constructor(...args: any[]) {
                super(...args);
            }
        };
    };
}

export function trigger(id: string) {
    return <T extends Constructor>(TriggerClass: T): T => {
        return class extends TriggerClass {
            get triggerId(): string {
                return id;
            }

            constructor(...args: any[]) {
                super(...args);
            }
        };
    };
}
