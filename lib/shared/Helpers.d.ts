import { CommonProperties } from "./CommonProps";
/**
  Field Helpers
*/
declare class SharedHelpers implements CommonProperties {
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
    validate: (o: any) => any;
    initField: (key: any, path: any, data: any, update?: boolean) => any;
    get: (path: string) => any;
    /**
     Fields Selector (alias of select)
     */
    $(key: any): any;
    /**
     Fields Values (recursive with Nested Fields)
     */
    values(): any;
    /**
     Fields Errors (recursive with Nested Fields)
     */
    errors(): any;
    /**
     Fields Labels (recursive with Nested Fields)
     */
    labels(): any;
    /**
     Fields Placeholders (recursive with Nested Fields)
     */
    placeholders(): any;
    /**
     Fields Default Values (recursive with Nested Fields)
     */
    defaults(): any;
    /**
     Fields Initial Values (recursive with Nested Fields)
     */
    initials(): any;
    /**
     Fields Types (recursive with Nested Fields)
     */
    types(): any;
}
export default SharedHelpers;
