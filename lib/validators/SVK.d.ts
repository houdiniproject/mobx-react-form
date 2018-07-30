import Options from '../Options';
import { ValidatorDriver } from './ValidatorDriver';
/**
  Schema Validation Keywords

    const plugins = {
      svk: {
        package: ajv,
        extend: callback,
      },
    };

*/
export default class SVK implements ValidatorDriver {
    validate: any;
    extend: any;
    promises: any[];
    schema: {};
    options: any;
    constructor(plugin: any, obj?: any);
    assignInitData(plugin: any, { options, schema, promises }: {
        options: Options;
        schema: any;
        promises: any[];
    }): void;
    initAJV(plugin: any): void;
    validateField(field: any): void;
    handleSyncError(field: any, errors: any): void;
    handleAsyncError(field: any, errors: any): void;
    findError(path: any, errors: any): any;
    executeAsyncValidation(field: any): void;
    parseValues(values: any): any;
}
