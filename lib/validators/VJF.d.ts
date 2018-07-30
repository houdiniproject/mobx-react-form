import { ValidatorDriver } from './ValidatorDriver';
/**
  Vanilla JavaScript Functions
*/
export default class VJF implements ValidatorDriver {
    options: any;
    promises: any[];
    validator: any;
    constructor(plugin: any, { promises, options }: {
        promises?: any[];
        options?: {};
    });
    validateField(field: any, form: any): void;
    collectData($fn: any, field: any, form: any): void;
    executeValidation(field: any): void;
    executeAsyncValidation(field: any): void;
    handleFunctionResult($fn: any, field: any, form: any): any;
}
