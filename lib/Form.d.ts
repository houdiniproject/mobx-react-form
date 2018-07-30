import { ObservableMap } from 'mobx';
import Base from './Base';
import Validator from './Validator';
import Field from './Field';
export declare abstract class OuterForm extends Base {
    plugins?(): any;
    setup?(): any;
    options?(): any;
    bindings?(): any;
}
interface FormOptions {
    name?: string;
    options?: any;
    plugins?: any;
    bindings?: any;
    hooks?: any;
    handlers?: any;
}
export default class Form extends OuterForm {
    name: string;
    state: any;
    validator: Validator;
    debouncedValidation: any;
    $hooks: {};
    $handlers: {};
    $submitting: boolean;
    $validating: boolean;
    fields: ObservableMap;
    $touched: boolean;
    $changed: boolean;
    constructor(setup?: any, formOptions?: FormOptions);
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
    makeField<TField extends Field = Field>(data: any): Field;
    /**
     Init Form Fields and Nested Fields
     */
    init($fields?: any): void;
    invalidate(message?: string): void;
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
export {};
