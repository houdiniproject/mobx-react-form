"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var defaultClearValue = function (_a) {
    var value = _a.value;
    if (_.isArray(value))
        return [];
    if (_.isDate(value))
        return null;
    if (_.isBoolean(value))
        return false;
    if (_.isNumber(value))
        return 0;
    if (_.isString(value))
        return '';
    return undefined;
};
exports.defaultClearValue = defaultClearValue;
var defaultValue = function (_a) {
    var type = _a.type, _b = _a.isEmptyArray, isEmptyArray = _b === void 0 ? false : _b;
    if (type === 'date')
        return null;
    if (type === 'checkbox')
        return false;
    if (type === 'number')
        return 0;
    return isEmptyArray ? [] : '';
};
exports.defaultValue = defaultValue;
var parsePath = function (path) {
    var $path = path;
    $path = _.replace($path, new RegExp('\\[', 'g'), '.');
    $path = _.replace($path, new RegExp('\\]', 'g'), '');
    return $path;
};
exports.parsePath = parsePath;
var parseInput = function (input, _a) {
    var type = _a.type, isEmptyArray = _a.isEmptyArray, separated = _a.separated, unified = _a.unified, initial = _a.initial;
    return input(utils.$try(separated, unified, initial, defaultValue({ type: type, isEmptyArray: isEmptyArray })));
};
exports.parseInput = parseInput;
var parseArrayProp = function ($val, $prop) {
    var $values = _.values($val);
    if ($prop === 'value' || $prop === 'initial' || $prop === 'default') {
        return _.without($values, null, undefined, '');
    }
    return $values;
};
exports.parseArrayProp = parseArrayProp;
var parseCheckArray = function (field, value, prop) {
    return field.hasIncrementalKeys
        ? parseArrayProp(value, prop)
        : value;
};
exports.parseCheckArray = parseCheckArray;
var parseCheckOutput = function ($field, $prop) {
    return ($prop === 'value')
        ? $field.$output($field[$prop])
        : $field[$prop];
};
exports.parseCheckOutput = parseCheckOutput;
var defineFieldsFromStruct = function (struct, add) {
    if (add === void 0) { add = false; }
    return _.reduceRight(struct, function ($, name) {
        var obj = {};
        if (_.endsWith(name, '[]')) {
            var val = (add) ? [$] : [];
            obj[_.trimEnd(name, '[]')] = val;
            return obj;
        }
        // no brakets
        var prev = struct[struct.indexOf(name) - 1];
        var stop = _.endsWith(prev, '[]') && (_.last(struct) === name);
        if (!add && stop)
            return obj;
        obj[name] = $;
        return obj;
    }, {});
};
var handleFieldsArrayOfStrings = function ($fields, add) {
    if (add === void 0) { add = false; }
    var fields = $fields;
    // handle array with field struct (strings)
    if (utils.isStruct(fields)) {
        fields = _.reduce(fields, function ($obj, $) {
            var _a;
            var pathStruct = _.split($, '.');
            // as array of strings (with empty values)
            if (!pathStruct.length)
                return Object.assign($obj, (_a = {}, _a[$] = '', _a));
            // define flat or nested fields from pathStruct
            return _.merge($obj, defineFieldsFromStruct(pathStruct, add));
        }, {});
    }
    return fields;
};
exports.handleFieldsArrayOfStrings = handleFieldsArrayOfStrings;
var handleFieldsArrayOfObjects = function ($fields) {
    var fields = $fields;
    // handle array of objects (with unified props)
    if (utils.isArrayOfObjects(fields)) {
        fields = _.reduce(fields, function ($obj, field) {
            var _a;
            if (utils.hasUnifiedProps({ fields: { field: field } }) && !_.has(field, 'name'))
                return undefined;
            return Object.assign($obj, (_a = {}, _a[field.name] = field, _a));
        }, {});
    }
    return fields;
};
var handleFieldsNested = function (fields, strictProps) {
    if (strictProps === void 0) { strictProps = true; }
    return _.reduce(fields, function (obj, field, key) {
        var _a, _b;
        if (utils.allowNested(field, strictProps)) {
            // define nested field
            return Object.assign(obj, (_a = {},
                _a[key] = { fields: utils.isEmptyArray(field) ? [] : handleFieldsNested(field) },
                _a));
        }
        return Object.assign(obj, (_b = {}, _b[key] = field, _b));
    }, {});
};
exports.handleFieldsNested = handleFieldsNested;
/* mapNestedValuesToUnifiedValues

FROM:

{
  street: '123 Fake St.',
  zip: '12345',
}

TO:

[{
  name: 'street'
  value: '123 Fake St.',
}, {
  name: 'zip'
  value: '12345',
}]

*/
var mapNestedValuesToUnifiedValues = function (data) {
    return _.isPlainObject(data)
        ? _.map(data, function (value, name) { return ({ value: value, name: name }); })
        : undefined;
};
/* reduceValuesToUnifiedFields

FROM:

{
  name: 'fatty',
  address: {
    street: '123 Fake St.',
    zip: '12345',
  },
};

TO:

{
  name: {
    value: 'fatty',
    fields: undefined
  },
  address: {
    value: {
      street: '123 Fake St.',
      zip: '12345'
    },
    fields: [ ... ]
  },
};

*/
var reduceValuesToUnifiedFields = function (values) {
    return _.reduce(values, function (obj, value, key) {
        var _a;
        return Object.assign(obj, (_a = {},
            _a[key] = {
                value: value,
                fields: mapNestedValuesToUnifiedValues(value),
            },
            _a));
    }, {});
};
/*
  Fallback Unified Props to Sepated Mode
*/
var handleFieldsPropsFallback = function (fields, initial) {
    if (!_.has(initial, 'values'))
        return fields;
    // if the 'values' object is passed in constructor
    // then update the fields definitions
    var values = initial.values;
    if (utils.hasUnifiedProps({ fields: fields })) {
        values = reduceValuesToUnifiedFields(values);
    }
    return _.merge(fields, values);
};
var mergeSchemaDefaults = function (fields, validator) {
    if (validator) {
        var properties = validator.schema.properties;
        if (_.isEmpty(fields) && !!properties) {
            _.each(properties, function (prop, key) {
                _.set(fields, key, {
                    value: prop.default,
                    label: prop.title,
                });
            });
        }
    }
    return fields;
};
exports.mergeSchemaDefaults = mergeSchemaDefaults;
var prepareFieldsData = function (initial, strictProps) {
    if (strictProps === void 0) { strictProps = true; }
    var fields = _.merge(handleFieldsArrayOfStrings(initial.fields, false), handleFieldsArrayOfStrings(initial.struct, false));
    fields = handleFieldsArrayOfObjects(fields);
    fields = handleFieldsPropsFallback(fields, initial);
    fields = handleFieldsNested(fields, strictProps);
    return fields;
};
exports.prepareFieldsData = prepareFieldsData;
var pathToFieldsTree = function (struct, path, n, add) {
    if (n === void 0) { n = 0; }
    if (add === void 0) { add = false; }
    var structPath = utils.pathToStruct(path);
    var structArray = _.filter(struct, function (item) { return _.startsWith(item, structPath); });
    var $tree = handleFieldsArrayOfStrings(structArray, add);
    var $struct = _.replace(structPath, new RegExp('\\[]', 'g'), "[" + n + "]");
    return handleFieldsNested(_.get($tree, $struct));
};
exports.pathToFieldsTree = pathToFieldsTree;
//# sourceMappingURL=parser.js.map