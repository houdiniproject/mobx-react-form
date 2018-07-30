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
var Options = /** @class */ (function () {
    function Options() {
        this.options = {
            uniqueId: utils_1.uniqueId,
            defaultGenericError: null,
            submitThrowsError: true,
            showErrorsOnInit: false,
            showErrorsOnSubmit: true,
            showErrorsOnBlur: true,
            showErrorsOnChange: true,
            showErrorsOnClear: false,
            showErrorsOnReset: true,
            validateOnInit: true,
            validateOnBlur: true,
            validateOnChange: false,
            validateDisabledFields: false,
            strictUpdate: false,
            strictDelete: true,
            retrieveOnlyDirtyValues: false,
            retrieveOnlyEnabledFields: false,
            autoParseNumbers: false,
            allowRequired: false,
            validationDebounceWait: 250,
            validationDebounceOptions: {
                leading: false,
                trailing: true,
            },
        };
    }
    Options.prototype.get = function (key, field) {
        if (key === void 0) { key = null; }
        if (field === void 0) { field = null; }
        // handle field option
        if (_.has(field, 'path')) {
            if (_.has(field.$options, key)) {
                return field.$options[key];
            }
        }
        // fallback on global form options
        if (key)
            return this.options[key];
        return mobx_1.toJS(this.options);
    };
    Options.prototype.set = function (options) {
        if (mobx_1.set) {
            mobx_1.set(this.options, options);
        }
        else {
            mobx_1.extendObservable(this.options, options);
        }
    };
    __decorate([
        mobx_1.observable
    ], Options.prototype, "options", void 0);
    __decorate([
        mobx_1.action
    ], Options.prototype, "set", null);
    return Options;
}());
exports.default = Options;
//# sourceMappingURL=Options.js.map