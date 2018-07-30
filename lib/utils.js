"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var mobx_1 = require("mobx");
var props = {
    booleans: ['hasError', 'isValid', 'isDirty', 'isPristine', 'isDefault', 'isEmpty', 'focused', 'touched', 'changed', 'disabled', 'resetting', 'clearing'],
    field: ['value', 'initial', 'default', 'label', 'placeholder', 'disabled', 'related', 'options', 'extra', 'bindings', 'type', 'hooks', 'handlers', 'error'],
    separated: ['values', 'initials', 'defaults', 'labels', 'placeholders', 'disabled', 'related', 'options', 'extra', 'bindings', 'types', 'hooks', 'handlers'],
    handlers: ['onChange', 'onToggle', 'onFocus', 'onBlur', 'onDrop', 'onSubmit', 'onReset', 'onClear', 'onAdd', 'onDel'],
    function: ['observers', 'interceptors', 'input', 'output'],
    validation: ['rules', 'validators', 'validateWith'],
    types: {
        isDirty: 'some',
        isValid: 'every',
        isPristine: 'every',
        isDefault: 'every',
        isEmpty: 'every',
        hasError: 'some',
        focused: 'some',
        touched: 'some',
        changed: 'some',
        disabled: 'every',
        clearing: 'every',
        resetting: 'every',
    },
};
exports.props = props;
var getObservableMapValues = function (observableMap) {
    return mobx_1.values
        ? mobx_1.values(observableMap)
        : observableMap.values();
};
exports.getObservableMapValues = getObservableMapValues;
var getObservableMapKeys = function (observableMap) {
    return mobx_1.values
        ? mobx_1.keys(observableMap)
        : observableMap.keys();
};
exports.getObservableMapKeys = getObservableMapKeys;
var checkObserveItem = function (change) { return function (_a) {
    var key = _a.key, to = _a.to, type = _a.type, exec = _a.exec;
    return (change.type === type && change.name === key && change.newValue === to)
        && exec.apply(change, [change]);
}; };
var checkObserve = function (collection) { return function (change) {
    return collection.map(checkObserveItem(change));
}; };
exports.checkObserve = checkObserve;
var checkPropType = function (_a) {
    var type = _a.type, data = _a.data;
    var $check;
    switch (type) {
        case 'some':
            $check = function ($data) { return _.some($data, Boolean); };
            break;
        case 'every':
            $check = function ($data) { return _.every($data, Boolean); };
            break;
        default: $check = null;
    }
    return $check(data);
};
exports.checkPropType = checkPropType;
var hasProps = function ($type, $data) {
    var $props;
    switch ($type) {
        case 'booleans':
            $props = props.booleans;
            break;
        case 'field':
            $props = props.field.concat(props.validation, props.function, props.handlers);
            break;
        case 'all':
            $props = ['id'].concat(props.booleans, props.field, props.validation, props.function, props.handlers);
            break;
        default: $props = null;
    }
    return _.intersection($data, $props).length > 0;
};
exports.hasProps = hasProps;
/**
  Check Allowed Properties
*/
var allowedProps = function (type, data) {
    if (hasProps(type, data))
        return;
    var $msg = 'The selected property is not allowed';
    throw new Error($msg + " (" + JSON.stringify(data) + ")");
};
exports.allowedProps = allowedProps;
/**
  Throw Error if undefined Fields
*/
var throwError = function (path, fields, msg) {
    if (msg === void 0) { msg = null; }
    if (!_.isNil(fields))
        return;
    var $msg = _.isNil(msg) ? 'The selected field is not defined' : msg;
    throw new Error($msg + " (" + path + ")");
};
exports.throwError = throwError;
var pathToStruct = function (path) {
    var struct;
    struct = _.replace(path, new RegExp('[.]\\d+($|.)', 'g'), '[].');
    struct = _.replace(struct, '..', '.');
    struct = _.trim(struct, '.');
    return struct;
};
exports.pathToStruct = pathToStruct;
var hasSome = function (obj, keys) {
    return _.some(keys, _.partial(_.has, obj));
};
var isPromise = function (obj) { return (!!obj && typeof obj.then === 'function'
    && (typeof obj === 'object' || typeof obj === 'function')); };
exports.isPromise = isPromise;
var isStruct = function (struct) {
    return (_.isArray(struct) && _.every(struct, _.isString));
};
exports.isStruct = isStruct;
var isEmptyArray = function (field) {
    return (_.isEmpty(field) && _.isArray(field));
};
exports.isEmptyArray = isEmptyArray;
var isArrayOfObjects = function (fields) {
    return _.isArray(fields) && _.every(fields, _.isPlainObject);
};
exports.isArrayOfObjects = isArrayOfObjects;
var $getKeys = function (fields) {
    return _.union(_.map(_.values(fields), function (values) { return _.keys(values); })[0]);
};
var hasUnifiedProps = function (_a) {
    var fields = _a.fields;
    return !isStruct({ fields: fields }) && hasProps('field', $getKeys(fields));
};
exports.hasUnifiedProps = hasUnifiedProps;
var hasSeparatedProps = function (initial) { return (hasSome(initial, props.separated) ||
    hasSome(initial, props.validation)); };
exports.hasSeparatedProps = hasSeparatedProps;
var allowNested = function (field, strictProps) {
    return _.isObject(field) && !_.isDate(field) && !_.has(field, 'fields')
        && (!hasSome(field, props.field.concat(props.validation, props.function, props.handlers)) || strictProps);
};
exports.allowNested = allowNested;
var parseIntKeys = function (fields) {
    return _.map(getObservableMapKeys(fields), _.ary(_.toNumber, 1));
};
exports.parseIntKeys = parseIntKeys;
var hasIntKeys = function (fields) {
    return _.every(parseIntKeys(fields), _.isInteger);
};
exports.hasIntKeys = hasIntKeys;
var maxKey = function (fields) {
    var max = _.max(parseIntKeys(fields));
    return _.isUndefined(max) ? 0 : max + 1;
};
exports.maxKey = maxKey;
var uniqueId = function (field) {
    return _.uniqueId([_.replace(field.path, new RegExp('\\.', 'g'), '-'), '--'].join(''));
};
exports.uniqueId = uniqueId;
var $isEvent = function (obj) {
    if (_.isNil(obj) || typeof Event === 'undefined')
        return false;
    return (obj instanceof Event || !_.isNil(obj.target)); // eslint-disable-line
};
exports.$isEvent = $isEvent;
var $hasFiles = function ($) {
    return ($.target.files && $.target.files.length !== 0);
};
exports.$hasFiles = $hasFiles;
var $isBool = function ($, val) {
    return _.isBoolean(val) &&
        _.isBoolean($.target.checked);
};
exports.$isBool = $isBool;
var $try = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var found = null;
    args.map(function (val) {
        return ((found === null) && !_.isNil(val))
            && (found = val);
    });
    return found;
};
exports.$try = $try;
//# sourceMappingURL=utils.js.map