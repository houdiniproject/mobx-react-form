import { CommonProperties } from './CommonProps';
/**
  Field Events
*/
declare class SharedEvents implements CommonProperties {
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
     MobX Event (observe/intercept)
     */
    MOBXEvent({path, key, call, type}: {
        path?: null;
        key?: string;
        call: any;
        type: any;
    }): void;
    /**
     Dispose MOBX Events
     */
    dispose(opt?: any): any;
    /**
     Dispose All Events (observe/intercept)
     */
    disposeAll(): any;
    /**
     Dispose Single Event (observe/intercept)
     */
    disposeSingle({type, key, path}: {
        type: any;
        key?: string;
        path?: null;
    }): void;
}
export default SharedEvents;
