"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var _ = require("lodash");
var Base_1 = require("./Base");
var Validator_1 = require("./Validator");
var State_1 = require("./State");
var Field_1 = require("./Field");
var OuterForm = /** @class */ (function (_super) {
    __extends(OuterForm, _super);
    function OuterForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OuterForm;
}(Base_1.default));
exports.OuterForm = OuterForm;
var Form = /** @class */ (function (_super) {
    __extends(Form, _super);
    function Form(setup, formOptions) {
        if (setup === void 0) { setup = {}; }
        if (formOptions === void 0) { formOptions = {}; }
        var _this = _super.call(this) || this;
        _this.$hooks = {};
        _this.$handlers = {};
        _this.$submitting = false;
        _this.$validating = false;
        _this.fields = mobx_1.observable.map ? mobx_1.observable.map({}) :
            // asMap({})
            null;
        _this.name = formOptions.name;
        _this.$hooks = formOptions.hooks || {};
        _this.$handlers = formOptions.handlers || {};
        var initial = _.each({ setup: setup, options: formOptions.options || {}, plugins: formOptions.plugins || {}, bindings: formOptions.bindings || {}
        }, function (val, key) { return _.isFunction(_this[key])
            ? _.merge(val, _this[key].apply(_this, [_this]))
            : val; });
        // load data from initializers methods
        // let initial:any = {
        //   plugins: formOptions.plugins || {},
        //   setup:setup,
        //   options: formOptions.options || {},
        //   binding: formOptions.bindings || {}
        // }
        // if (this.plugins && _.isFunction(this.plugins))
        // {
        //  initial.plugins = _.merge(initial.plugins, this.plugins() )
        // }
        // if (this.setup && _.isFunction(this.setup))
        // {
        //  initial.setup = _.merge(initial.setup, this.setup() )
        // }
        // if (this.options && _.isFunction(this.options))
        // {
        //  initial.options = _.merge(initial.options, this.options() )
        // }
        // if (this.bindings && _.isFunction(this.bindings))
        // {
        //  initial.bindings = _.merge(initial.bindings, this.bindings() )
        // }
        _this.state = new State_1.default({
            form: _this,
            initial: initial.setup,
            options: initial.options,
            bindings: initial.bindings,
        });
        _this.validator = new Validator_1.default({
            form: _this,
            plugins: initial.plugins,
            schema: initial.setup.schema,
        });
        _this.initFields(initial.setup);
        _this.debouncedValidation = _.debounce(_this.validate, _this.state.options.get('validationDebounceWait'), _this.state.options.get('validationDebounceOptions'));
        // execute validation on form initialization
        if (_this.state.options.get('validateOnInit') === true) {
            _this.validator.validate({ showErrors: _this.state.options.get('showErrorsOnInit') });
        }
        _this.execHook('onInit');
        return _this;
    }
    Object.defineProperty(Form.prototype, "submitting", {
        /* ------------------------------------------------------------------ */
        /* COMPUTED */
        get: function () {
            return this.$submitting;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "validating", {
        get: function () {
            return this.$validating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "clearing", {
        get: function () {
            return this.check('clearing', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "resetting", {
        get: function () {
            return this.check('resetting', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "error", {
        get: function () {
            return this.validator.error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "hasError", {
        get: function () {
            return !!this.validator.error
                || this.check('hasError', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "isValid", {
        get: function () {
            return !this.validator.error
                && this.check('isValid', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "isDirty", {
        get: function () {
            return this.check('isDirty', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "isPristine", {
        get: function () {
            return this.check('isPristine', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "isDefault", {
        get: function () {
            return this.check('isDefault', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "isEmpty", {
        get: function () {
            return this.check('isEmpty', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "focused", {
        get: function () {
            return this.check('focused', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "touched", {
        get: function () {
            return this.check('touched', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "changed", {
        get: function () {
            return this.check('changed', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Form.prototype, "disabled", {
        get: function () {
            return this.check('disabled', true);
        },
        enumerable: true,
        configurable: true
    });
    /**
      Prototypes
    */
    Form.prototype.makeField = function (data) {
        return new Field_1.default(data);
    };
    /**
     Init Form Fields and Nested Fields
     */
    Form.prototype.init = function ($fields) {
        if ($fields === void 0) { $fields = null; }
        _.set(this, 'fields', mobx_1.observable.map
            ? mobx_1.observable.map({})
            // : asMap({})
            : null);
        this.state.initial.props.values = $fields; // eslint-disable-line
        this.state.current.props.values = $fields; // eslint-disable-line
        this.initFields({
            fields: $fields || this.state.struct(),
        });
    };
    Form.prototype.invalidate = function (message) {
        if (message === void 0) { message = null; }
        this.validator.error = message
            || this.state.options.get('defaultGenericError')
            || true;
    };
    Form.prototype.showErrors = function (show) {
        if (show === void 0) { show = true; }
        this.each(function (field) { return field.showErrors(show); });
    };
    /**
      Clear Form Fields
    */
    Form.prototype.clear = function () {
        this.$touched = false;
        this.$changed = false;
        this.each(function (field) { return field.clear(true); });
    };
    /**
      Reset Form Fields
    */
    Form.prototype.reset = function () {
        this.$touched = false;
        this.$changed = false;
        this.each(function (field) { return field.reset(true); });
    };
    __decorate([
        mobx_1.observable
    ], Form.prototype, "$submitting", void 0);
    __decorate([
        mobx_1.observable
    ], Form.prototype, "$validating", void 0);
    __decorate([
        mobx_1.observable
    ], Form.prototype, "fields", void 0);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "submitting", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "validating", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "clearing", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "resetting", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "error", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "hasError", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "isValid", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "isDirty", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "isPristine", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "isDefault", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "isEmpty", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "focused", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "touched", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "changed", null);
    __decorate([
        mobx_1.computed
    ], Form.prototype, "disabled", null);
    __decorate([
        mobx_1.action
    ], Form.prototype, "init", null);
    __decorate([
        mobx_1.action
    ], Form.prototype, "invalidate", null);
    __decorate([
        mobx_1.action
    ], Form.prototype, "clear", null);
    __decorate([
        mobx_1.action
    ], Form.prototype, "reset", null);
    return Form;
}(OuterForm));
exports.default = Form;
;
//# sourceMappingURL=Form.js.map