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
var utils_1 = require("./utils");
var parser_1 = require("./parser");
var setupFieldProps = function (instance, props, data) {
    return Object.assign(instance, {
        $value: instance.$initial,
        $label: props.$label || data.label || '',
        $placeholder: props.$placeholder || data.placeholder || '',
        $disabled: props.$disabled || data.disabled || false,
        $bindings: props.$bindings || data.bindings || 'default',
        $related: props.$related || data.related || [],
        $validators: mobx_1.toJS(props.$validators || data.validators || null),
        $validatedWith: props.$validatedWith || data.validatedWith || 'value',
        $rules: props.$rules || data.rules || null,
        $observers: props.$observers || data.observers || null,
        $interceptors: props.$interceptors || data.interceptors || null,
        $extra: props.$extra || data.extra || null,
        $options: props.$options || data.options || {},
        $hooks: props.$hooks || data.hooks || {},
        $handlers: props.$handlers || data.handlers || {},
    });
};
var setupDefaultProp = function (instance, data, props, update, _a) {
    var isEmptyArray = _a.isEmptyArray, checkArray = _a.checkArray;
    return parser_1.parseInput(instance.$input, {
        isEmptyArray: isEmptyArray,
        type: instance.type,
        unified: update ? '' : checkArray(data.default),
        separated: checkArray(props.$default),
        initial: checkArray(instance.$initial),
    });
};
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    function Field(_a) {
        var key = _a.key, path = _a.path, _b = _a.data, data = _b === void 0 ? {} : _b, _c = _a.props, props = _c === void 0 ? {} : _c, _d = _a.update, update = _d === void 0 ? false : _d, state = _a.state;
        var _this = _super.call(this) || this;
        _this.fields = mobx_1.observable.map ? mobx_1.observable.map({}) :
            // asMap({})
            null;
        _this.hasInitialNestedFields = false;
        _this.incremental = false;
        _this.$hooks = {};
        _this.$handlers = {};
        _this.$input = function ($) { return $; };
        _this.$output = function ($) { return $; };
        _this.$disabled = false;
        _this.$focused = false;
        _this.$touched = false;
        _this.$changed = false;
        _this.$submitting = false;
        _this.$validating = false;
        _this.$clearing = false;
        _this.$resetting = false;
        _this.autoFocus = false;
        _this.showError = false;
        _this.errorSync = null;
        _this.errorAsync = null;
        _this.validationErrorStack = [];
        _this.validationFunctionsData = [];
        _this.validationAsyncData = {};
        /* ------------------------------------------------------------------ */
        /* EVENTS HANDLERS */
        _this.sync = mobx_1.action(function (e, v) {
            if (v === void 0) { v = null; }
            _this.$changed = true;
            var $get = function ($) { return utils_1.$isBool($, _this.value)
                ? $.target.checked
                : $.target.value; };
            // assume "v" or "e" are the values
            if (_.isNil(e) || _.isNil(e.target)) {
                if (!_.isNil(v) && !_.isNil(v.target)) {
                    v = $get(v); // eslint-disable-line
                }
                _this.value = utils_1.$try(e, v);
                return;
            }
            if (!_.isNil(e.target)) {
                _this.value = $get(e);
                return;
            }
            _this.value = e;
        });
        _this.onChange = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_this.type === 'file')
                ? _this.onDrop.apply(_this, args) : _this.execHandler('onChange', args, _this.sync);
        };
        _this.onToggle = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onToggle', args, _this.sync);
        };
        _this.onBlur = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onBlur', args, mobx_1.action(function () {
                _this.$focused = false;
            }));
        };
        _this.onFocus = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onFocus', args, mobx_1.action(function () {
                _this.$focused = true;
                _this.$touched = true;
            }));
        };
        _this.onDrop = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onDrop', args, mobx_1.action(function () {
                var e = args[0];
                var files = null;
                if (utils_1.$isEvent(e) && utils_1.$hasFiles(e)) {
                    files = _.map(e.target.files);
                }
                _this.files = files || args;
            }));
        };
        _this.state = state;
        _this.setupField(key, path, data, props, update);
        _this.checkDVRValidationPlugin();
        _this.initNestedFields(data, update);
        _this.incremental = (_this.hasIncrementalKeys !== 0);
        _this.debouncedValidation = _.debounce(_this.validate, _this.state.options.get('validationDebounceWait', _this), _this.state.options.get('validationDebounceOptions', _this));
        _this.observeValidationOnBlur();
        _this.observeValidationOnChange();
        _this.initMOBXEvent('observers');
        _this.initMOBXEvent('interceptors');
        _this.execHook('onInit');
        return _this;
    }
    Object.defineProperty(Field.prototype, "checkValidationErrors", {
        /* ------------------------------------------------------------------ */
        /* COMPUTED */
        get: function () {
            return ((this.validationAsyncData.valid === false)
                && !_.isEmpty(this.validationAsyncData))
                || !_.isEmpty(this.validationErrorStack)
                || _.isString(this.errorAsync)
                || _.isString(this.errorSync);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "checked", {
        get: function () {
            return (this.type === 'checkbox') ? this.value : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "value", {
        get: function () {
            return this.getComputedProp('value');
        },
        set: function (newVal) {
            if (this.$value === newVal)
                return;
            // handle numbers
            if (this.state.options.get('autoParseNumbers', this) === true) {
                if (_.isNumber(this.$initial)) {
                    if (new RegExp('^-?\\d+(,\\d+)*(\\.\\d+([eE]\\d+)?)?$', 'g').exec(newVal)) {
                        this.$value = _.toNumber(newVal);
                        return;
                    }
                }
            }
            // handle parse value
            this.$value = newVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "initial", {
        get: function () {
            return this.getComputedProp('initial');
        },
        set: function (val) {
            this.$initial = parser_1.parseInput(this.$input, { separated: val });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "default", {
        get: function () {
            return this.getComputedProp('default');
        },
        set: function (val) {
            this.$default = parser_1.parseInput(this.$input, { separated: val });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "actionRunning", {
        get: function () {
            return (this.submitting || this.clearing || this.resetting);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "submitting", {
        get: function () {
            return mobx_1.toJS(this.$submitting);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "validating", {
        get: function () {
            return mobx_1.toJS(this.$validating);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "type", {
        get: function () {
            return mobx_1.toJS(this.$type);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "label", {
        get: function () {
            return mobx_1.toJS(this.$label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "placeholder", {
        get: function () {
            return mobx_1.toJS(this.$placeholder);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "extra", {
        get: function () {
            return mobx_1.toJS(this.$extra);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "options", {
        get: function () {
            return mobx_1.toJS(this.$options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "bindings", {
        get: function () {
            return mobx_1.toJS(this.$bindings);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "related", {
        get: function () {
            return mobx_1.toJS(this.$related);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "disabled", {
        get: function () {
            return mobx_1.toJS(this.$disabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "rules", {
        get: function () {
            return mobx_1.toJS(this.$rules);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "validators", {
        get: function () {
            return mobx_1.toJS(this.$validators);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "validatedValue", {
        get: function () {
            return this[this.$validatedWith];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "error", {
        get: function () {
            if (this.showError === false)
                return null;
            return (this.errorAsync || this.errorSync || null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "hasError", {
        get: function () {
            return this.checkValidationErrors
                || this.check('hasError', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "isValid", {
        get: function () {
            return !this.checkValidationErrors
                && this.check('isValid', true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "isDirty", {
        get: function () {
            return this.hasNestedFields
                ? this.check('isDirty', true)
                : !_.isEqual(this.$default, this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "isPristine", {
        get: function () {
            return this.hasNestedFields
                ? this.check('isPristine', true)
                : _.isEqual(this.$default, this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "isDefault", {
        get: function () {
            return this.hasNestedFields
                ? this.check('isDefault', true)
                : _.isEqual(this.$default, this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "resetting", {
        get: function () {
            return this.hasNestedFields
                ? this.check('resetting', true)
                : this.$resetting;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "clearing", {
        get: function () {
            return this.hasNestedFields
                ? this.check('clearing', true)
                : this.$clearing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "isEmpty", {
        get: function () {
            if (this.hasNestedFields)
                return this.check('isEmpty', true);
            if (_.isBoolean(this.value))
                return !!this.$value;
            if (_.isNumber(this.value))
                return false;
            if (_.isDate(this.value))
                return false;
            return _.isEmpty(this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "focused", {
        get: function () {
            return this.hasNestedFields
                ? this.check('focused', true)
                : this.$focused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "touched", {
        get: function () {
            return this.hasNestedFields
                ? this.check('touched', true)
                : this.$touched;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "changed", {
        get: function () {
            return this.hasNestedFields
                ? this.check('changed', true)
                : this.$changed;
        },
        enumerable: true,
        configurable: true
    });
    /**prototypes */
    Field.prototype.setupField = function ($key, $path, $data, $props, update) {
        this.key = $key;
        this.path = $path;
        this.id = this.state.options.get('uniqueId').apply(this, [this]);
        var isEmptyArray = (_.has($data, 'fields') && _.isArray($data.fields));
        var checkArray = function (val) { return isEmptyArray ? [] : val; };
        var $value = $props.$value, $type = $props.$type, $input = $props.$input, $output = $props.$output;
        // eslint-disable-next-line
        if (_.isNil($data))
            $data = '';
        if (_.isPlainObject($data)) {
            var value = $data.value, type = $data.type, input = $data.input, output = $data.output;
            this.name = _.toString($data.name || $key);
            this.$type = $type || type || 'text';
            this.$input = utils_1.$try($input, input, this.$input);
            this.$output = utils_1.$try($output, output, this.$output);
            this.$initial = parser_1.parseInput(this.$input, {
                isEmptyArray: isEmptyArray,
                type: this.type,
                unified: checkArray(value),
                separated: checkArray($props.$initial),
                initial: checkArray($data.initial),
            });
            this.$default = setupDefaultProp(this, $data, $props, update, {
                isEmptyArray: isEmptyArray, checkArray: checkArray,
            });
            setupFieldProps(this, $props, $data);
            return;
        }
        /* The field IS the value here */
        this.name = _.toString($key);
        this.$type = $type || 'text';
        this.$input = utils_1.$try($input, this.$input);
        this.$output = utils_1.$try($output, this.$output);
        this.$initial = parser_1.parseInput(this.$input, {
            isEmptyArray: isEmptyArray,
            type: this.type,
            unified: checkArray($data),
            separated: checkArray($value),
        });
        this.$default = setupDefaultProp(this, $data, $props, update, {
            isEmptyArray: isEmptyArray, checkArray: checkArray,
        });
        setupFieldProps(this, $props, $data);
    };
    Field.prototype.getComputedProp = function (key) {
        var _this = this;
        if (this.incremental || this.hasNestedFields) {
            var $val = (key === 'value')
                ? this.get(key, false)
                : mobx_1.untracked(function () { return _this.get(key, false); });
            return !_.isEmpty($val) ? $val : [];
        }
        var val = this["$" + key];
        if (_.isArray(val) || mobx_1.isObservableArray(val)) {
            return [].slice.call(val);
        }
        return mobx_1.toJS(val);
    };
    Field.prototype.checkDVRValidationPlugin = function () {
        var drivers = this.state.form.validator.drivers;
        if (_.isNil(drivers.dvr) && !_.isNil(this.rules)) {
            // eslint-disable-next-line
            console.warn('The DVR validation rules are defined', 'but no plugin provided (DVR). Field:', this.path);
        }
    };
    Field.prototype.initNestedFields = function (field, update) {
        var fields = _.isNil(field) ? null : field.fields;
        if (_.isArray(fields) && !_.isEmpty(fields)) {
            this.hasInitialNestedFields = true;
        }
        this.initFields({ fields: fields }, update);
    };
    Field.prototype.invalidate = function (message, async) {
        if (async === void 0) { async = false; }
        if (async === true) {
            this.errorAsync = message;
            return;
        }
        if (_.isArray(message)) {
            this.validationErrorStack = message;
            this.showErrors(true);
            return;
        }
        this.validationErrorStack.unshift(message);
        this.showErrors(true);
    };
    Field.prototype.setValidationAsyncData = function (valid, message) {
        if (valid === void 0) { valid = false; }
        if (message === void 0) { message = ''; }
        this.validationAsyncData = { valid: valid, message: message };
    };
    Field.prototype.resetValidation = function (deep) {
        if (deep === void 0) { deep = false; }
        this.showError = true;
        this.errorSync = null;
        this.errorAsync = null;
        this.validationAsyncData = {};
        this.validationFunctionsData = [];
        this.validationErrorStack = [];
        if (deep)
            this.each(function (field) { return field.resetValidation(); });
    };
    Field.prototype.clear = function (deep) {
        if (deep === void 0) { deep = true; }
        this.$clearing = true;
        this.$touched = false;
        this.$changed = false;
        this.$value = parser_1.defaultClearValue({ value: this.$value });
        this.files = undefined;
        if (deep)
            this.each(function (field) { return field.clear(true, false); });
        this.validate({
            showErrors: this.state.options.get('showErrorsOnClear', this),
        });
    };
    Field.prototype.reset = function (deep) {
        if (deep === void 0) { deep = true; }
        this.$resetting = true;
        this.$touched = false;
        this.$changed = false;
        var useDefaultValue = (this.$default !== this.$initial);
        if (useDefaultValue)
            this.value = this.$default;
        if (!useDefaultValue)
            this.value = this.$initial;
        this.files = undefined;
        if (deep)
            this.each(function (field) { return field.reset(true, false); });
        this.validate({
            showErrors: this.state.options.get('showErrorsOnReset', this),
        });
    };
    Field.prototype.focus = function () {
        // eslint-disable-next-line
        this.state.form.each(function (field) { return (field.autoFocus = false); });
        this.autoFocus = true;
    };
    Field.prototype.showErrors = function (show) {
        if (show === void 0) { show = true; }
        this.showError = show;
        this.errorSync = _.head(this.validationErrorStack);
        this.each(function (field) { return field.showErrors(show); });
    };
    Field.prototype.showAsyncErrors = function () {
        if (this.validationAsyncData.valid === false) {
            this.errorAsync = this.validationAsyncData.message;
            return;
        }
        this.errorAsync = null;
    };
    Field.prototype.observeValidationOnBlur = function () {
        var _this = this;
        var opt = this.state.options;
        if (opt.get('validateOnBlur', this)) {
            this.disposeValidationOnBlur = mobx_1.observe(this, '$focused', function (change) {
                return (change.newValue === false) &&
                    _this.debouncedValidation({
                        showErrors: opt.get('showErrorsOnBlur', _this),
                    });
            });
        }
    };
    Field.prototype.observeValidationOnChange = function () {
        var _this = this;
        var opt = this.state.options;
        if (opt.get('validateOnChange', this)) {
            this.disposeValidationOnChange = mobx_1.observe(this, '$value', function () {
                return !_this.actionRunning &&
                    _this.debouncedValidation({
                        showErrors: opt.get('showErrorsOnChange', _this),
                    });
            });
        }
    };
    Field.prototype.initMOBXEvent = function (type) {
        if (!_.isArray(this["$" + type]))
            return;
        var fn;
        if (type === 'observers')
            fn = this.observe;
        if (type === 'interceptors')
            fn = this.intercept;
        this["$" + type].map(function (obj) { return fn(_.omit(obj, 'path')); });
    };
    Field.prototype.bind = function (props) {
        if (props === void 0) { props = {}; }
        return this.state.bindings.load(this, this.bindings, props);
    };
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$options", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$value", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$type", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$label", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$placeholder", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$default", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$initial", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$bindings", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$extra", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$related", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$validatedWith", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$validators", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$rules", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$disabled", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$focused", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$touched", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$changed", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$submitting", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$validating", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$clearing", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "$resetting", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "autoFocus", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "showError", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "errorSync", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "errorAsync", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "validationErrorStack", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "validationFunctionsData", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "validationAsyncData", void 0);
    __decorate([
        mobx_1.observable
    ], Field.prototype, "files", void 0);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "checkValidationErrors", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "checked", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "value", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "initial", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "default", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "actionRunning", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "submitting", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "validating", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "type", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "label", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "placeholder", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "extra", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "options", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "bindings", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "related", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "disabled", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "rules", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "validators", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "validatedValue", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "error", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "hasError", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "isValid", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "isDirty", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "isPristine", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "isDefault", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "resetting", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "clearing", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "isEmpty", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "focused", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "touched", null);
    __decorate([
        mobx_1.computed
    ], Field.prototype, "changed", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "setupField", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "initNestedFields", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "invalidate", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "setValidationAsyncData", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "resetValidation", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "clear", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "reset", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "focus", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "showErrors", null);
    __decorate([
        mobx_1.action
    ], Field.prototype, "showAsyncErrors", null);
    return Field;
}(Base_1.default));
exports.default = Field;
;
//# sourceMappingURL=Field.js.map