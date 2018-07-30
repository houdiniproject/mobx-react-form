"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var Base = /** @class */ (function () {
    function Base() {
        var _this = this;
        this.noop = function () { };
        this.execHook = function (name, fallback) {
            if (fallback === void 0) { fallback = {}; }
            return utils_1.$try(fallback[name], _this.$hooks[name], _this.hooks && _this.hooks.apply(_this, [_this])[name], _this.noop).apply(_this, [_this]);
        };
        this.execHandler = function (name, args, fallback) {
            if (fallback === void 0) { fallback = null; }
            return [utils_1.$try(_this.$handlers[name] && _this.$handlers[name].apply(_this, [_this]), _this.handlers && _this.handlers.apply(_this, [_this])[name].apply(_this, [_this]), fallback, _this.noop).apply(_this, args.slice()), _this.execHook(name)];
        };
        /**
         Interceptor
         */
        this.intercept = function (opt) {
            return _this.MOBXEvent(_.isFunction(opt)
                ? { type: 'interceptor', call: opt }
                : __assign({ type: 'interceptor' }, opt));
        };
        /**
         Observer
         */
        this.observe = function (opt) {
            return _this.MOBXEvent(_.isFunction(opt)
                ? { type: 'observer', call: opt }
                : __assign({ type: 'observer' }, opt));
        };
        /**
          Event Handler: On Clear
        */
        this.onClear = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onClear', args, function (e) {
                e.preventDefault();
                _this.clear(true);
            });
        };
        /**
          Event Handler: On Reset
        */
        this.onReset = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onReset', args, function (e) {
                e.preventDefault();
                _this.reset(true);
            });
        };
        /**
          Event Handler: On Submit
         */
        this.onSubmit = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onSubmit', args, function (e, o) {
                if (o === void 0) { o = {}; }
                e.preventDefault();
                _this.submit(o);
            });
        };
        /**
          Event Handler: On Add
        */
        this.onAdd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onAdd', args, function (e, val) {
                e.preventDefault();
                _this.add(utils_1.$isEvent(val) ? null : val);
            });
        };
        /**
          Event Handler: On Del
        */
        this.onDel = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.execHandler('onDel', args, function (e, path) {
                e.preventDefault();
                _this.del(utils_1.$isEvent(path) ? _this.path : path);
            });
        };
    }
    Object.defineProperty(Base.prototype, "hasIncrementalKeys", {
        get: function () {
            return (this.fields.size && utils_1.hasIntKeys(this.fields));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "hasNestedFields", {
        get: function () {
            return (this.fields.size !== 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "size", {
        get: function () {
            return this.fields.size;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        mobx_1.computed
    ], Base.prototype, "hasIncrementalKeys", null);
    __decorate([
        mobx_1.computed
    ], Base.prototype, "hasNestedFields", null);
    __decorate([
        mobx_1.computed
    ], Base.prototype, "size", null);
    return Base;
}());
exports.default = Base;
//# sourceMappingURL=Base.js.map