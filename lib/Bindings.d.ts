export default class Bindings {
    templates: {};
    rewriters: {
        default: {
            id: string;
            name: string;
            type: string;
            value: string;
            checked: string;
            label: string;
            placeholder: string;
            disabled: string;
            onChange: string;
            onBlur: string;
            onFocus: string;
            autoFocus: string;
        };
    };
    load(field: any, name: string, props: any): any;
    register(bindings: any): this;
}
