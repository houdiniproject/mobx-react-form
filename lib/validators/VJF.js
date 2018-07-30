"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var mobx_1 = require("mobx");
var utils = require("../utils");
/**
  Vanilla JavaScript Functions
*/
var VJF = /** @class */ (function () {
    function VJF(plugin, _a) {
        var _b = _a.promises, promises = _b === void 0 ? [] : _b, _c = _a.options, options = _c === void 0 ? {} : _c;
        this.validator = null;
        if (_.isPlainObject(plugin)) {
            this.validator = plugin;
        }
        this.promises = promises;
        this.options = options;
    }
    VJF.prototype.validateField = function (field, form) {
        var _this = this;
        // exit if field does not have validation functions
        if (!field.validators)
            return;
        // get validators from validate property
        var $fn = mobx_1.toJS(field.validators);
        // map only if is an array of validator functions
        if (_.isArray($fn)) {
            $fn.map(function (fn) { return _this.collectData(fn, field, form); });
        }
        // it's just one function
        if (_.isFunction($fn)) {
            this.collectData($fn, field, form);
        }
        // execute the function validation
        this.executeValidation(field);
    };
    VJF.prototype.collectData = function ($fn, field, form) {
        var _this = this;
        var res = this.handleFunctionResult($fn, field, form);
        // check and execute only if is a promise
        if (utils.isPromise(res)) {
            var $p = res
                .then(function ($res) { return field.setValidationAsyncData($res[0], $res[1]); })
                .then(function () { return _this.executeAsyncValidation(field); })
                .then(function () { return field.showAsyncErrors(); });
            // push the promise into array
            this.promises.push($p);
            return;
        }
        // is a plain function
        field.validationFunctionsData.unshift({
            valid: res[0],
            message: res[1],
        });
    };
    VJF.prototype.executeValidation = function (field) {
        // otherwise find an error message to show
        field.validationFunctionsData
            .map(function (rule) { return (rule.valid === false)
            && field.invalidate(rule.message); });
    };
    VJF.prototype.executeAsyncValidation = function (field) {
        if (field.validationAsyncData.valid === false) {
            field.invalidate(field.validationAsyncData.message, true);
        }
    };
    VJF.prototype.handleFunctionResult = function ($fn, field, form) {
        // executre validation function
        var res = $fn({ field: field, form: form, validator: this.validator });
        /**
          Handle "array"
        */
        if (_.isArray(res)) {
            var isValid = res[0] || false;
            var message = res[1] || 'Error';
            return [isValid, message];
        }
        /**
          Handle "boolean"
        */
        if (_.isBoolean(res)) {
            return [res, 'Error'];
        }
        /**
          Handle "string"
        */
        if (_.isString(res)) {
            return [false, res];
        }
        /**
          Handle "object / promise"
        */
        if (utils.isPromise(res)) {
            return res; // the promise
        }
        /**
          Handle other cases
        */
        return [false, 'Error'];
    };
    return VJF;
}());
exports.default = VJF;
//# sourceMappingURL=VJF.js.map