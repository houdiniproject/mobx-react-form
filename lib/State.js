"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var _ = require("lodash");
var Options_1 = require("./Options");
var Bindings_1 = require("./Bindings");
var utils = require("./utils");
var State = /** @class */ (function () {
    function State(_a) {
        var form = _a.form, initial = _a.initial, options = _a.options, bindings = _a.bindings;
        this.strict = false;
        this.disposers = {
            interceptor: {},
            observer: {},
        };
        this.$struct = [];
        this.initial = {
            props: {},
            fields: {},
        };
        this.current = {
            props: {},
            fields: {},
        };
        this.set('form', form);
        this.initProps(initial);
        this.options = new Options_1.default();
        this.options.set(options);
        this.bindings = new Bindings_1.default();
        this.bindings.register(bindings);
        this.observeOptions();
    }
    State.prototype.initProps = function (initial) {
        var initialProps = _.pick(initial, utils.props.separated.concat(utils.props.validation, utils.props.function, utils.props.handlers));
        this.set('initial', 'props', initialProps);
        var $unified = utils.hasUnifiedProps(initial);
        var $separated = utils.hasSeparatedProps(initial);
        if ($unified && $separated) {
            console.warn(// eslint-disable-line
            'WARNING: Your mobx-react-form instance ', this.form.name, ' is running in MIXED Mode (Unified + Separated) as fields properties definition.', 'This mode is experimental, use it at your own risk, or use only one mode.');
        }
        if (($separated || utils.isStruct(initial.fields)) && !$unified) {
            var struct = utils.$try(initial.struct || initial.fields);
            this.struct(struct);
            this.strict = true;
            this.mode = 'separated';
            return;
        }
        this.struct(initial.struct);
        this.mode = 'unified';
    };
    /**
      Get/Set Fields Structure
    */
    State.prototype.struct = function (data) {
        if (data === void 0) { data = null; }
        if (data)
            this.$struct = data;
        return this.$struct;
    };
    /**
      Get Props/Fields
    */
    State.prototype.get = function (type, subtype) {
        return this[type][subtype];
    };
    /**
      Set Props/Fields
    */
    State.prototype.set = function (type, subtype, state) {
        if (state === void 0) { state = null; }
        if (type === 'form') {
            // subtype is the form here
            this.form = subtype;
        }
        if (type === 'initial') {
            Object.assign(this.initial[subtype], state);
            Object.assign(this.current[subtype], state);
        }
        if (type === 'current') {
            Object.assign(this.current[subtype], state);
        }
    };
    State.prototype.extra = function (data) {
        if (data === void 0) { data = null; }
        if (_.isString(data))
            return _.get(this.$extra, data);
        if (data === null)
            return this.$extra;
        this.$extra = data;
        return null;
    };
    State.prototype.observeOptions = function () {
        var _this = this;
        // Fix Issue #201
        mobx_1.observe(this.options.options, utils.checkObserve([{
                // start observing fields validateOnChange
                type: 'update',
                key: 'validateOnChange',
                to: true,
                exec: function () { return _this.form.each(function (field) { return field.observeValidationOnChange(); }); },
            }, {
                // stop observing fields validateOnChange
                type: 'update',
                key: 'validateOnChange',
                to: false,
                exec: function () { return _this.form.each(function (field) { return field.disposeValidationOnChange(); }); },
            }, {
                // start observing fields validateOnBlur
                type: 'update',
                key: 'validateOnBlur',
                to: true,
                exec: function () { return _this.form.each(function (field) { return field.observeValidationOnBlur(); }); },
            }, {
                // stop observing fields validateOnBlur
                type: 'update',
                key: 'validateOnBlur',
                to: false,
                exec: function () { return _this.form.each(function (field) { return field.disposeValidationOnBlur(); }); },
            }]));
    };
    return State;
}());
exports.default = State;
//# sourceMappingURL=State.js.map