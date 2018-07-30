declare const defaultClearValue: ({value}: {
    value: any;
}) => false | any[] | "" | 0;
declare const defaultValue: ({type, isEmptyArray}: {
    type: any;
    isEmptyArray?: boolean;
}) => false | any[] | "" | 0;
declare const parsePath: (path: any) => any;
declare const parseInput: (input: any, {type, isEmptyArray, separated, unified, initial}: {
    type?: any;
    isEmptyArray?: any;
    separated?: any;
    unified?: any;
    initial?: any;
}) => any;
declare const parseArrayProp: ($val: any, $prop: any) => any[];
declare const parseCheckArray: (field: any, value: any, prop: any) => any;
declare const parseCheckOutput: ($field: any, $prop: any) => any;
declare const handleFieldsArrayOfStrings: ($fields: any, add?: boolean) => any;
declare const handleFieldsNested: (fields: any, strictProps?: boolean) => any;
declare const mergeSchemaDefaults: (fields: any, validator: any) => any;
declare const prepareFieldsData: (initial: any, strictProps?: boolean) => any;
declare const pathToFieldsTree: (struct: any, path: any, n?: number, add?: boolean) => any;
export { defaultValue, defaultClearValue, parseInput, parsePath, parseArrayProp, parseCheckArray, parseCheckOutput, mergeSchemaDefaults, handleFieldsNested, handleFieldsArrayOfStrings, prepareFieldsData, pathToFieldsTree };
