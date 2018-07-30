declare const props: {
    booleans: string[];
    field: string[];
    separated: string[];
    handlers: string[];
    function: string[];
    validation: string[];
    types: {
        isDirty: string;
        isValid: string;
        isPristine: string;
        isDefault: string;
        isEmpty: string;
        hasError: string;
        focused: string;
        touched: string;
        changed: string;
        disabled: string;
        clearing: string;
        resetting: string;
    };
};
declare const getObservableMapValues: (observableMap: any) => any;
declare const getObservableMapKeys: (observableMap: any) => any;
declare const checkObserve: (collection: any) => (change: any) => any;
declare const checkPropType: ({ type, data }: {
    type: any;
    data: any;
}) => any;
declare const hasProps: ($type: any, $data: any) => boolean;
/**
  Check Allowed Properties
*/
declare const allowedProps: (type: any, data: any) => void;
/**
  Throw Error if undefined Fields
*/
declare const throwError: (path: any, fields: any, msg?: any) => void;
declare const pathToStruct: (path: any) => any;
declare const isPromise: (obj: any) => boolean;
declare const isStruct: (struct: any) => boolean;
declare const isEmptyArray: (field: any) => boolean;
declare const isArrayOfObjects: (fields: any) => boolean;
declare const hasUnifiedProps: ({ fields }: {
    fields: any;
}) => boolean;
declare const hasSeparatedProps: (initial: any) => boolean;
declare const allowNested: (field: any, strictProps: any) => any;
declare const parseIntKeys: (fields: any) => any[];
declare const hasIntKeys: (fields: any) => boolean;
declare const maxKey: (fields: any) => any;
declare const uniqueId: (field: any) => string;
declare const $isEvent: (obj: any) => boolean;
declare const $hasFiles: ($: any) => boolean;
declare const $isBool: ($: any, val: any) => boolean;
declare const $try: (...args: any[]) => any;
export { props, checkObserve, checkPropType, hasProps, allowedProps, throwError, isPromise, isStruct, isEmptyArray, isArrayOfObjects, pathToStruct, hasUnifiedProps, hasSeparatedProps, allowNested, parseIntKeys, hasIntKeys, maxKey, uniqueId, $isEvent, $hasFiles, $isBool, $try, getObservableMapKeys, getObservableMapValues, };
