/**
  Vanilla JavaScript Functions
*/
export default class VJF {
    validator: any;
    options: any;
    promises: any[];
    constructor(plugin: any, {promises, options}: {
        promises?: undefined[];
        options?: {};
    });
    validateField(field: any, form: any): void;
    collectData($fn: any, field: any, form: any): void;
    executeValidation(field: any): void;
    executeAsyncValidation(field: any): void;
    handleFunctionResult($fn: any, field: any, form: any): any;
}
