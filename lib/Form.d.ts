import { ObservableMap } from 'mobx';
import Base from './Base';
import Field from './Field';
export default class Form extends Base {
    name: any;
    state: any;
    validator: any;
    debouncedValidation: any;
    $hooks: {};
    $handlers: {};
    $submitting: boolean;
    $validating: boolean;
    fields: ObservableMap;
    $touched: boolean;
    $changed: boolean;
    constructor(setup?: any, {name, options, plugins, bindings, hooks, handlers}?: {
        name?: any;
        options?: {};
        plugins?: {};
        bindings?: {};
        hooks?: {};
        handlers?: {};
    });
    readonly submitting: boolean;
    readonly validating: boolean;
    readonly clearing: any;
    readonly resetting: any;
    readonly error: any;
    readonly hasError: any;
    readonly isValid: any;
    readonly isDirty: any;
    readonly isPristine: any;
    readonly isDefault: any;
    readonly isEmpty: any;
    readonly focused: any;
    readonly touched: any;
    readonly changed: any;
    readonly disabled: any;
    /**
      Prototypes
    */
    makeField(data: any): Field;
    /**
     Init Form Fields and Nested Fields
     */
    init($fields?: any): void;
    invalidate(message?: any): void;
    showErrors(show?: boolean): void;
    /**
      Clear Form Fields
    */
    clear(): void;
    /**
      Reset Form Fields
    */
    reset(): void;
}
