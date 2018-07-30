import { CommonProperties } from './CommonProps';
/**
  Field Initializer
*/
declare class SharedInitializer implements CommonProperties {
    path: any;
    state: any;
    fields: any;
    $submitting: boolean;
    hasNestedFields: boolean;
    container: (path?: string) => any;
    select: (path: any, fields?: any, isStrict?: boolean) => any;
    execHook: (hook: string, o: any) => any;
    invalidate: (message?: any, async?: boolean) => any;
    validator: any;
    validate: (o: any) => any;
    get: (path: string) => any;
    initFields(initial: any, update?: any): void;
    initField(key: any, path: any, data: any, update?: boolean): any;
}
export default SharedInitializer;
