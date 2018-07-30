export default class Validator {
    promises: any[];
    form: any;
    options: {};
    schema: {};
    plugins: {
        vjf: boolean;
        dvr: boolean;
        svk: boolean;
    };
    drivers: any;
    error: any;
    constructor(obj?: any);
    initDrivers(drivers: any): void;
    validate(opt?: any, obj?: any): Promise<any>;
    validateField({field, path, showErrors, related}: {
        field?: null;
        path: any;
        showErrors?: boolean;
        related?: boolean;
    }): void;
    /**
      Validate 'related' fields if specified
      and related validation allowed (recursive)
    */
    relatedFieldValidation(field: any, showErrors: any): void;
    checkSVKValidationPlugin(): void;
}
