export default class Options {
    options: {
        uniqueId: (field: any) => string;
        defaultGenericError: any;
        submitThrowsError: boolean;
        showErrorsOnInit: boolean;
        showErrorsOnSubmit: boolean;
        showErrorsOnBlur: boolean;
        showErrorsOnChange: boolean;
        showErrorsOnClear: boolean;
        showErrorsOnReset: boolean;
        validateOnInit: boolean;
        validateOnBlur: boolean;
        validateOnChange: boolean;
        validateDisabledFields: boolean;
        strictUpdate: boolean;
        strictDelete: boolean;
        retrieveOnlyDirtyValues: boolean;
        retrieveOnlyEnabledFields: boolean;
        autoParseNumbers: boolean;
        allowRequired: boolean;
        validationDebounceWait: number;
        validationDebounceOptions: {
            leading: boolean;
            trailing: boolean;
        };
    };
    get(key?: any, field?: any): any;
    set(options: any): void;
}
