import Actions from './shared/Actions';
import Events from './shared/Events';
import Helpers from './shared/Helpers';
import Initializers from './shared/Initializer';
import Utils from './shared/Utils';
export default abstract class Base implements Actions, Events, Helpers, Initializers, Utils {
    abstract invalidate(message?: any, async?: boolean): any;
    state: any;
    $submitting: boolean;
    validator: any;
    /** shared actions */
    validate: (opt?: {}, obj?: {}) => any;
    submit: (o?: {}) => any;
    check: (prop: any, deep?: boolean) => any;
    deepCheck: (type: any, prop: any, fields: any) => any[];
    update: (fields: any) => void;
    deepUpdate: (fields: any, path?: string, recursion?: boolean) => void;
    get: (prop?: any, strict?: boolean) => any;
    deepGet: (prop: any, fields: any) => any;
    set: (prop: any, data: any) => void;
    deepSet: ($: any, data: any, path?: string, recursion?: boolean) => void;
    add: (obj: any) => any;
    del: ($path?: any) => void;
    /** shared events */
    MOBXEvent: ({ path, key, call, type, }: {
        path?: any;
        key?: string;
        call: any;
        type: any;
    }) => void;
    dispose: (opt?: any) => any;
    disposeAll: () => any;
    disposeSingle: ({ type, key, path }: {
        type: any;
        key?: string;
        path?: any;
    }) => void;
    /** helpers */
    $: (key: any) => any;
    values: () => any;
    errors: () => any;
    labels: () => any;
    placeholders: () => any;
    defaults: () => any;
    initials: () => any;
    types: () => any;
    /** Initializers */
    initFields: (initial: any, update?: any) => any;
    initField: (key: any, path: any, data: any, update?: boolean) => any;
    /** Utils */
    select: (path: any, fields?: any, isStrict?: boolean) => any;
    container: ($path: any) => any;
    has: (path: any) => boolean;
    map: (cb: any) => any;
    each: (iteratee: any, fields?: any, depth?: number) => void;
    noop: () => void;
    $handlers: any;
    $hooks: any;
    fields: any;
    handlers: any;
    path: any;
    hooks?(): any;
    abstract clear(deep: boolean): void;
    abstract reset(deep: boolean): void;
    execHook: (name: any, fallback?: {}) => any;
    execHandler: (name: any, args: any, fallback?: any) => any[];
    readonly hasIncrementalKeys: any;
    readonly hasNestedFields: any;
    readonly size: any;
    /**
     Interceptor
     */
    intercept: (opt: any) => void;
    /**
     Observer
     */
    observe: (opt: any) => void;
    /**
      Event Handler: On Clear
    */
    onClear: (...args: any[]) => any[];
    /**
      Event Handler: On Reset
    */
    onReset: (...args: any[]) => any[];
    /**
      Event Handler: On Submit
     */
    onSubmit: (...args: any[]) => any[];
    /**
      Event Handler: On Add
    */
    onAdd: (...args: any[]) => any[];
    /**
      Event Handler: On Del
    */
    onDel: (...args: any[]) => any[];
}
