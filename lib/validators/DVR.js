"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
/**
  Declarative Validation Rules

    const plugins = {
      dvr: {
        package: validatorjs,
        extend: callback,
      },
    };

*/
var DVR = /** @class */ (function () {
    function DVR(plugin, obj) {
        if (obj === void 0) { obj = {}; }
        this.promises = [];
        this.asyncRules = [];
        this.validators = {};
        this.validator = null;
        this.extend = null;
        this.assignInitData(plugin, obj);
        this.extendValidator();
    }
    DVR.prototype.assignInitData = function (plugin, _a) {
        var _b = _a.options, options = _b === void 0 ? {} : _b, _c = _a.promises, promises = _c === void 0 ? [] : _c;
        this.options = options;
        this.promises = promises;
        this.extend = plugin.extend;
        this.validator = plugin.package || plugin;
    };
    DVR.prototype.extendValidator = function () {
        var _this = this;
        // extend the validator with custom "registerAsyncRule" method
        _.extend(this.validator, {
            registerAsyncRule: function (key, callback) { return _this.registerAsyncRule(key, callback); },
        });
        // extend using "extend" callback
        if (_.isFunction(this.extend))
            this.extend(this.validator);
    };
    DVR.prototype.validateField = function (field, form) {
        // get form fields data
        var data = {}; // eslint-disable-next-line
        form.each(function ($field) { return (data[$field.path] = $field.validatedValue); });
        this.validateFieldAsync(field, form, data);
        this.validateFieldSync(field, form, data);
    };
    DVR.prototype.validateFieldSync = function (field, form, data) {
        var _a, _b;
        var $rules = this.rules(field.rules, 'sync');
        // exit if no rules found
        if (_.isEmpty($rules[0]))
            return;
        // get field rules
        var rules = (_a = {}, _a[field.path] = $rules, _a);
        // create the validator instance
        var Validator = this.validator;
        var validation = new Validator(data, rules);
        // set label into errors messages instead key
        validation.setAttributeNames((_b = {}, _b[field.path] = field.label, _b));
        // check validation
        if (validation.passes())
            return;
        // the validation is failed, set the field error
        field.invalidate(_.first(validation.errors.get(field.path)));
    };
    DVR.prototype.validateFieldAsync = function (field, form, data) {
        var _this = this;
        var _a, _b;
        var $rules = this.rules(field.rules, 'async');
        // exit if no rules found
        if (_.isEmpty($rules[0]))
            return;
        // get field rules
        var rules = (_a = {}, _a[field.path] = $rules, _a);
        // create the validator instance
        var Validator = this.validator;
        var validation = new Validator(data, rules);
        // set label into errors messages instead key
        validation.setAttributeNames((_b = {}, _b[field.path] = field.label, _b));
        var $p = new Promise(function (resolve) {
            return validation.checkAsync(function () { return _this.handleAsyncPasses(field, resolve); }, function () { return _this.handleAsyncFails(field, validation, resolve); });
        });
        this.promises.push($p);
    };
    DVR.prototype.handleAsyncPasses = function (field, resolve) {
        field.setValidationAsyncData(true);
        field.showAsyncErrors();
        resolve();
    };
    DVR.prototype.handleAsyncFails = function (field, validation, resolve) {
        field.setValidationAsyncData(false, _.first(validation.errors.get(field.path)));
        this.executeAsyncValidation(field);
        field.showAsyncErrors();
        resolve();
    };
    DVR.prototype.executeAsyncValidation = function (field) {
        if (field.validationAsyncData.valid === false) {
            field.invalidate(field.validationAsyncData.message, true);
        }
    };
    DVR.prototype.registerAsyncRule = function (key, callback) {
        console.error("registerAsyncRule");
        this.asyncRules.push(key);
        this.validator.registerAsync(key, callback);
    };
    DVR.prototype.rules = function (rules, type) {
        var $rules = _.isString(rules) ? _.split(rules, '|') : rules;
        if (type === 'sync')
            return _.difference($rules, this.asyncRules);
        if (type === 'async')
            return _.intersection($rules, this.asyncRules);
        return [];
    };
    return DVR;
}());
exports.default = DVR;
//# sourceMappingURL=DVR.js.map