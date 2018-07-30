"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("../utils");
var Options_1 = require("../Options");
/**
  Schema Validation Keywords

    const plugins = {
      svk: {
        package: ajv,
        extend: callback,
      },
    };

*/
var SVK = /** @class */ (function () {
    function SVK(plugin, obj) {
        if (obj === void 0) { obj = {}; }
        this.validate = null;
        this.extend = null;
        this.promises = [];
        this.schema = {};
        this.assignInitData(plugin, obj);
        this.initAJV(plugin);
    }
    SVK.prototype.assignInitData = function (plugin, _a) {
        var _b = _a.options, options = _b === void 0 ? new Options_1.default() : _b, _c = _a.schema, schema = _c === void 0 ? {} : _c, _d = _a.promises, promises = _d === void 0 ? [] : _d;
        options.set({
            ajv: {
                v5: true,
                allErrors: true,
                coerceTypes: true,
                errorDataPath: 'property',
            },
        });
        this.options = options;
        this.schema = schema;
        this.promises = promises;
        this.extend = plugin.extend;
    };
    SVK.prototype.initAJV = function (plugin) {
        if (!this.schema)
            return;
        // get ajv package
        var AJV = plugin.package || plugin;
        // create ajv instance
        var ajvInstance = new AJV(this.options.get('ajv'));
        // extend ajv using "extend" callback
        if (_.isFunction(this.extend))
            this.extend(ajvInstance);
        // create ajvInstance validator (compiling rules)
        this.validate = ajvInstance.compile(this.schema);
    };
    SVK.prototype.validateField = function (field) {
        var _this = this;
        var data = (_a = {}, _a[field.path] = field.validatedValue, _a);
        var validate = this.validate(this.parseValues(data));
        // check if is $async schema
        if (utils.isPromise(validate)) {
            var $p = validate
                .then(function () { return field.setValidationAsyncData(true); })
                .catch(function (err) { return err && _this.handleAsyncError(field, err.errors); })
                .then(function () { return _this.executeAsyncValidation(field); })
                .then(function () { return field.showAsyncErrors(); });
            // push the promise into array
            this.promises.push($p);
            return;
        }
        // check sync errors
        this.handleSyncError(field, this.validate.errors);
        var _a;
    };
    SVK.prototype.handleSyncError = function (field, errors) {
        var fieldErrorObj = this.findError(field.key, errors);
        // if fieldErrorObj is not undefined, the current field is invalid.
        if (_.isUndefined(fieldErrorObj))
            return;
        // the current field is now invalid
        // add additional info to the message
        var msg = field.label + " " + fieldErrorObj.message;
        // invalidate the current field with message
        field.invalidate(msg);
    };
    SVK.prototype.handleAsyncError = function (field, errors) {
        // find current field error message from ajv errors
        var fieldErrorObj = this.findError(field.path, errors);
        // if fieldErrorObj is not undefined, the current field is invalid.
        if (_.isUndefined(fieldErrorObj))
            return;
        // the current field is now invalid
        // add additional info to the message
        var msg = field.label + " " + fieldErrorObj.message;
        // set async validation data on the field
        field.setValidationAsyncData(false, msg);
    };
    SVK.prototype.findError = function (path, errors) {
        return _.find(errors, function (_a) {
            var dataPath = _a.dataPath;
            var $dataPath;
            $dataPath = _.trimStart(dataPath, '.');
            $dataPath = _.trim($dataPath, '[\'');
            $dataPath = _.trim($dataPath, '\']');
            return _.includes($dataPath, "" + path);
        });
    };
    SVK.prototype.executeAsyncValidation = function (field) {
        if (field.validationAsyncData.valid === false) {
            field.invalidate(field.validationAsyncData.message, true);
        }
    };
    SVK.prototype.parseValues = function (values) {
        if (this.options.get('allowRequired') === true) {
            return _.omitBy(values, (_.isEmpty || _.isNull || _.isUndefined || _.isNaN));
        }
        return values;
    };
    return SVK;
}());
exports.default = SVK;
//# sourceMappingURL=SVK.js.map