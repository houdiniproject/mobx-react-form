"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var _ = require("lodash");
var utils_1 = require("./utils");
var VJF_1 = require("./validators/VJF"); // Vanilla JavaScript Functions
var SVK_1 = require("./validators/SVK"); // Json Schema Validation Keywords
var DVR_1 = require("./validators/DVR"); // Declarative Validation Rules
var Validator = /** @class */ (function () {
    function Validator(obj) {
        if (obj === void 0) { obj = {}; }
        this.promises = [];
        this.form = {};
        this.options = {};
        this.schema = {};
        this.plugins = {
            vjf: true,
            dvr: false,
            svk: false,
        };
        this.drivers = {};
        _.merge(this.plugins, obj.plugins);
        this.form = obj.form;
        this.schema = obj.schema || {};
        this.initDrivers({ vjf: VJF_1.default, dvr: DVR_1.default, svk: SVK_1.default });
        this.checkSVKValidationPlugin();
    }
    Validator.prototype.initDrivers = function (drivers) {
        var _this = this;
        var self = this;
        _.map(drivers, function (Class, key) {
            if (self.plugins[key]) {
                self.drivers[key] = new Class(self.plugins[key], {
                    schema: (key === 'svk') ? _this.schema : null,
                    options: self.form.state.options,
                    promises: self.promises,
                });
            }
        });
    };
    Validator.prototype.validate = function (opt, obj) {
        var _this = this;
        if (opt === void 0) { opt = {}; }
        if (obj === void 0) { obj = {}; }
        var path = utils_1.$try(opt.path, opt);
        var field = utils_1.$try(opt.field, this.form.select(path, null, null));
        var related = utils_1.$try(opt.related, obj.related, true);
        var showErrors = utils_1.$try(opt.showErrors, obj.showErrors, false);
        var instance = field || this.form;
        instance.$validating = true;
        this.error = null;
        return new Promise(function (resolve) {
            // validate instance (form or filed)
            if (instance.path || _.isString(path)) {
                _this.validateField({
                    field: instance,
                    showErrors: showErrors,
                    related: related,
                    path: path,
                });
            }
            // validate nested fields
            instance.each(function ($field) {
                return _this.validateField({
                    path: $field.path,
                    field: $field,
                    showErrors: showErrors,
                    related: related,
                });
            });
            // wait all promises
            resolve(Promise.all(_this.promises));
        })
            .then(mobx_1.action(function () {
            instance.$validating = false;
            instance.$clearing = false;
            instance.$resetting = false;
        }))
            .catch(mobx_1.action(function (err) {
            instance.$validating = false;
            instance.$clearing = false;
            instance.$resetting = false;
            throw err;
        }))
            .then(function () { return instance; });
    };
    Validator.prototype.validateField = function (_a) {
        var _this = this;
        var _b = _a.field, field = _b === void 0 ? null : _b, path = _a.path, _c = _a.showErrors, showErrors = _c === void 0 ? false : _c, _d = _a.related, related = _d === void 0 ? false : _d;
        var instance = field || this.form.select(path);
        // check if the field is a valid instance
        if (!instance.path)
            throw new Error('Validation Error: Invalid Field Instance');
        // do not validate disabled fields
        if (instance.disabled && !this.form.state.options.get('validateDisabledFields'))
            return;
        // reset field validation
        instance.resetValidation();
        // validate with all drivers
        _.each(this.drivers, function (driver) {
            return driver.validateField(instance, _this.form);
        });
        // send error to the view
        instance.showErrors(showErrors);
        // related validation
        if (related)
            this.relatedFieldValidation(instance, showErrors);
    };
    /**
      Validate 'related' fields if specified
      and related validation allowed (recursive)
    */
    Validator.prototype.relatedFieldValidation = function (field, showErrors) {
        var _this = this;
        if (!field.related || !field.related.length)
            return;
        _.each(field.related, function (path) {
            return _this.validateField({ path: path, showErrors: showErrors, related: false });
        });
    };
    Validator.prototype.checkSVKValidationPlugin = function () {
        if (_.isNil(this.drivers.svk) && !_.isEmpty(this.schema)) {
            // eslint-disable-next-line
            console.warn('The SVK validation schema is defined', 'but no plugin provided (SVK).');
        }
    };
    __decorate([
        mobx_1.observable
    ], Validator.prototype, "error", void 0);
    __decorate([
        mobx_1.action
    ], Validator.prototype, "validate", null);
    __decorate([
        mobx_1.action
    ], Validator.prototype, "validateField", null);
    return Validator;
}());
exports.default = Validator;
//# sourceMappingURL=Validator.js.map