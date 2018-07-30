import { CommonProperties } from './CommonProps';
/**
  Field Actions
*/
declare class SharedActions implements CommonProperties {
    path: any;
    state: any;
    fields: any;
    $submitting: boolean;
    hasNestedFields: boolean;
    container: (path: string) => any;
    select: (path: any, fields?: any, isStrict?: boolean) => any;
    execHook: (hook: string, o: any) => any;
    invalidate: (message?: any, async?: boolean) => any;
    validator: any;
    initField: (key: any, path: any, data: any, update?: boolean) => any;
    validate(opt?: {}, obj?: {}): any;
    /**
      Submit
    */
    submit(o?: {}): any;
    /**
     Check Field Computed Values
     */
    check(prop: any, deep?: boolean): any;
    deepCheck(type: any, prop: any, fields: any): any[];
    /**
     Update Field Values recurisvely
     OR Create Field if 'undefined'
     */
    update(fields: any): void;
    deepUpdate(fields: any, path?: string, recursion?: boolean): void;
    /**
      Get Fields Props
     */
    get(prop?: any, strict?: boolean): any;
    /**
      Get Fields Props Recursively
     */
    deepGet(prop: any, fields: any): any;
    /**
     Set Fields Props
     */
    set(prop: any, data: any): void;
    /**
      Set Fields Props Recursively
     */
    deepSet($: any, data: any, path?: string, recursion?: boolean): void;
    /**
     Add Field
     */
    add(obj: any): any;
    /**
     Del Field
     */
    del($path?: any): void;
}
export default SharedActions;
