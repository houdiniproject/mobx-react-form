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
var utils = require("../utils");
var parser = require("../parser");
/**
  Field Initializer
*/
var SharedInitializer = /** @class */ (function () {
    function SharedInitializer() {
    }
    SharedInitializer.prototype.initFields = function (initial, update) {
        var _this = this;
        var $path = function (key) { return _.trimStart([_this.path, key].join('.'), '.'); };
        var fields;
        fields = parser.prepareFieldsData(initial, this.state.strict);
        fields = parser.mergeSchemaDefaults(fields, this.validator);
        // create fields
        _.each(fields, function (field, key) {
            return _.isNil(_this.select($path(key), null, false)) &&
                _this.initField(key, $path(key), field, update);
        });
    };
    SharedInitializer.prototype.initField = function (key, path, data, update) {
        if (update === void 0) { update = false; }
        var _a;
        var initial = this.state.get('current', 'props');
        var struct = utils.pathToStruct(path);
        // try to get props from separated objects
        var $try = function (prop) { return _.get(initial[prop], struct); };
        var props = {
            $value: $try('values'),
            $label: $try('labels'),
            $placeholder: $try('placeholders'),
            $default: $try('defaults'),
            $initial: $try('initials'),
            $disabled: $try('disabled'),
            $bindings: $try('bindings'),
            $type: $try('types'),
            $options: $try('options'),
            $extra: $try('extra'),
            $related: $try('related'),
            $hooks: $try('hooks'),
            $handlers: $try('handlers'),
            $validatedWith: $try('validatedWith'),
            $validators: $try('validators'),
            $rules: $try('rules'),
            $observers: $try('observers'),
            $interceptors: $try('interceptors'),
            $input: $try('input'),
            $output: $try('output'),
        };
        var field = this.state.form.makeField({
            key: key, path: path, data: data, props: props, update: update, state: this.state,
        });
        this.fields.merge((_a = {}, _a[key] = field, _a));
        return field;
    };
    __decorate([
        mobx_1.action
    ], SharedInitializer.prototype, "initField", null);
    return SharedInitializer;
}());
exports.default = SharedInitializer;
//# sourceMappingURL=Initializer.js.map