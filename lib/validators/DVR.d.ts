import { ValidatorDriver } from './ValidatorDriver';
/**
  Declarative Validation Rules

    const plugins = {
      dvr: {
        package: validatorjs,
        extend: callback,
      },
    };

*/
export default class DVR implements ValidatorDriver {
    promises: any[];
    asyncRules: any[];
    validators: {};
    validator: any;
    extend: any;
    options: any;
    constructor(plugin: any, obj?: {});
    assignInitData(plugin: any, { options, promises }: {
        options?: {};
        promises?: any[];
    }): void;
    extendValidator(): void;
    validateField(field: any, form: any): void;
    validateFieldSync(field: any, form: any, data: any): void;
    validateFieldAsync(field: any, form: any, data: any): void;
    handleAsyncPasses(field: any, resolve: any): void;
    handleAsyncFails(field: any, validation: any, resolve: any): void;
    executeAsyncValidation(field: any): void;
    registerAsyncRule(key: any, callback: any): void;
    rules(rules: any, type: any): any[];
}
