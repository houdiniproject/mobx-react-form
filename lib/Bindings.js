"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils_1 = require("./utils");
var Bindings = /** @class */ (function () {
    function Bindings() {
        this.templates = {};
        this.rewriters = {
            default: {
                id: 'id',
                name: 'name',
                type: 'type',
                value: 'value',
                checked: 'checked',
                label: 'label',
                placeholder: 'placeholder',
                disabled: 'disabled',
                onChange: 'onChange',
                onBlur: 'onBlur',
                onFocus: 'onFocus',
                autoFocus: 'autoFocus',
            },
        };
    }
    Bindings.prototype.load = function (field, name, props) {
        if (name === void 0) { name = 'default'; }
        if (_.has(this.rewriters, name)) {
            var $bindings_1 = {};
            _.each(this.rewriters[name], function ($v, $k) {
                return _.merge($bindings_1, (_a = {}, _a[$v] = utils_1.$try(props[$k], field[$k]), _a));
                var _a;
            });
            return $bindings_1;
        }
        return this.templates[name]({
            keys: this.rewriters[name],
            $try: utils_1.$try,
            field: field,
            props: props,
        });
    };
    Bindings.prototype.register = function (bindings) {
        var _this = this;
        _.each(bindings, function (val, key) {
            if (_.isFunction(val))
                _.merge(_this.templates, (_a = {}, _a[key] = val, _a));
            if (_.isPlainObject(val))
                _.merge(_this.rewriters, (_b = {}, _b[key] = val, _b));
            var _a, _b;
        });
        return this;
    };
    return Bindings;
}());
exports.default = Bindings;
//# sourceMappingURL=Bindings.js.map