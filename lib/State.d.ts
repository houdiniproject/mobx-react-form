export default class State {
    strict: boolean;
    form: any;
    mode: any;
    options: any;
    bindings: any;
    $extra: any;
    disposers: {
        interceptor: {};
        observer: {};
    };
    $struct: any[];
    initial: {
        props: {};
        fields: {};
    };
    current: {
        props: {};
        fields: {};
    };
    constructor({ form, initial, options, bindings, }: {
        form: any;
        initial: any;
        options: any;
        bindings: any;
    });
    initProps(initial: any): void;
    /**
      Get/Set Fields Structure
    */
    struct(data?: any): any[];
    /**
      Get Props/Fields
    */
    get(type: any, subtype: any): any;
    /**
      Set Props/Fields
    */
    set(type: any, subtype: any, state?: any): void;
    extra(data?: any): any;
    observeOptions(): void;
}
