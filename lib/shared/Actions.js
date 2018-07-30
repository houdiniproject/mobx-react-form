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
  Field Actions
*/
var SharedActions = /** @class */ (function () {
    function SharedActions() {
    }
    SharedActions.prototype.validate = function (opt, obj) {
        if (opt === void 0) { opt = {}; }
        if (obj === void 0) { obj = {}; }
        var $opt = _.merge(opt, { path: this.path });
        return this.state.form.validator.validate($opt, obj);
    };
    /**
      Submit
    */
    SharedActions.prototype.submit = function (o) {
        var _this = this;
        if (o === void 0) { o = {}; }
        this.$submitting = true;
        var exec = function (isValid) { return isValid
            ? _this.execHook('onSuccess', o)
            : _this.execHook('onError', o); };
        var validate = function () {
            return _this.validate({
                showErrors: _this.state.options.get('showErrorsOnSubmit', _this),
            })
                .then(function (_a) {
                var isValid = _a.isValid;
                var handler = exec(isValid);
                if (isValid)
                    return handler;
                var $err = _this.state.options.get('defaultGenericError', _this);
                var $throw = _this.state.options.get('submitThrowsError', _this);
                if ($throw && $err)
                    _this.invalidate();
                return handler;
            })
                // eslint-disable-next-line
                .then(mobx_1.action(function () { return (_this.$submitting = false); }))
                .catch(mobx_1.action(function (err) {
                _this.$submitting = false;
                throw err;
            }))
                .then(function () { return _this; });
        };
        return utils.isPromise(exec)
            ? exec.then(function () { return validate(); })
            : validate();
    };
    /**
     Check Field Computed Values
     */
    SharedActions.prototype.check = function (prop, deep) {
        if (deep === void 0) { deep = false; }
        utils.allowedProps('booleans', [prop]);
        return deep
            ? utils.checkPropType({
                type: utils.props.types[prop],
                data: this.deepCheck(utils.props.types[prop], prop, this.fields),
            })
            : this[prop];
    };
    SharedActions.prototype.deepCheck = function (type, prop, fields) {
        var _this = this;
        return _.reduce(utils.getObservableMapValues(fields), function (check, field) {
            if (field.fields.size === 0) {
                check.push(field[prop]);
                return check;
            }
            var $deep = _this.deepCheck(type, prop, field.fields);
            check.push(utils.checkPropType({ type: type, data: $deep }));
            return check;
        }, []);
    };
    /**
     Update Field Values recurisvely
     OR Create Field if 'undefined'
     */
    SharedActions.prototype.update = function (fields) {
        if (!_.isPlainObject(fields)) {
            throw new Error('The update() method accepts only plain objects.');
        }
        return this.deepUpdate(parser.prepareFieldsData({ fields: fields }));
    };
    SharedActions.prototype.deepUpdate = function (fields, path, recursion) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (recursion === void 0) { recursion = true; }
        _.each(fields, function (field, key) {
            var $key = _.has(field, 'name') ? field.name : key;
            var $path = _.trimStart(path + "." + $key, '.');
            var $field = _this.select($path, null, false);
            var $container = _this.select(path, null, false)
                || _this.state.form.select(_this.path, null, false);
            if (!_.isNil($field) && !_.isNil(field)) {
                if (_.isArray($field.values())) {
                    _.each(utils.getObservableMapValues($field.fields), function ($f) {
                        return $field.fields.delete($f.name);
                    });
                }
                if (_.isNil(field.fields)) {
                    $field.value = field;
                    return;
                }
            }
            if (!_.isNil($container)) {
                // get full path when using update() with select() - FIX: #179
                var $newFieldPath = _.trimStart([_this.path, $path].join('.'), '.');
                // init field into the container field
                $container.initField($key, $newFieldPath, field, true);
            }
            if (recursion) {
                // handle nested fields if undefined or null
                var $fields = parser.pathToFieldsTree(_this.state.struct(), $path);
                _this.deepUpdate($fields, $path, false);
            }
            if (recursion && _.has(field, 'fields') && !_.isNil(field.fields)) {
                // handle nested fields if defined
                _this.deepUpdate(field.fields, $path);
            }
        });
    };
    /**
      Get Fields Props
     */
    SharedActions.prototype.get = function (prop, strict) {
        if (prop === void 0) { prop = null; }
        if (strict === void 0) { strict = true; }
        if (_.isNil(prop)) {
            return this.deepGet(utils.props.booleans.concat(utils.props.field, utils.props.validation), this.fields);
        }
        utils.allowedProps('all', _.isArray(prop) ? prop : [prop]);
        if (_.isString(prop)) {
            if (strict && this.fields.size === 0) {
                return parser.parseCheckOutput(this, prop);
            }
            var value = this.deepGet(prop, this.fields);
            return parser.parseCheckArray(this, value, prop);
        }
        return this.deepGet(prop, this.fields);
    };
    /**
      Get Fields Props Recursively
     */
    SharedActions.prototype.deepGet = function (prop, fields) {
        var _this = this;
        return _.reduce(utils.getObservableMapValues(fields), function (obj, field) {
            var _a, _b, _c;
            var $nested = function ($fields) { return ($fields.size !== 0)
                ? _this.deepGet(prop, $fields)
                : undefined; };
            Object.assign(obj, (_a = {},
                _a[field.key] = { fields: $nested(field.fields) },
                _a));
            if (_.isString(prop)) {
                var removeValue = (prop === 'value') &&
                    ((_this.state.options.get('retrieveOnlyDirtyValues', _this) && field.isPristine) ||
                        (_this.state.options.get('retrieveOnlyEnabledFields', _this) && field.disabled));
                if (field.fields.size === 0) {
                    delete obj[field.key]; // eslint-disable-line
                    if (removeValue)
                        return obj;
                    return Object.assign(obj, (_b = {},
                        _b[field.key] = parser.parseCheckOutput(field, prop),
                        _b));
                }
                var value = _this.deepGet(prop, field.fields);
                if (prop === 'value')
                    value = field.$output(value);
                delete obj[field.key]; // eslint-disable-line
                if (removeValue)
                    return obj;
                return Object.assign(obj, (_c = {},
                    _c[field.key] = parser.parseCheckArray(field, value, prop),
                    _c));
            }
            _.each(prop, function ($prop) {
                var _a;
                return Object.assign(obj[field.key], (_a = {},
                    _a[$prop] = field[$prop],
                    _a));
            });
            return obj;
        }, {});
    };
    /**
     Set Fields Props
     */
    SharedActions.prototype.set = function (prop, data) {
        // UPDATE CUSTOM PROP
        if (_.isString(prop) && !_.isUndefined(data)) {
            utils.allowedProps('field', [prop]);
            var deep = (_.isObject(data) && prop === 'value') || _.isPlainObject(data);
            if (deep && this.hasNestedFields)
                this.deepSet(prop, data, '', true);
            else
                _.set(this, "$" + prop, data);
            return;
        }
        // NO PROP NAME PROVIDED ("prop" is value)
        if (_.isNil(data)) {
            if (this.hasNestedFields)
                this.deepSet('value', prop, '', true);
            else
                this.set('value', prop);
        }
    };
    /**
      Set Fields Props Recursively
     */
    SharedActions.prototype.deepSet = function ($, data, path, recursion) {
        var _this = this;
        if (path === void 0) { path = ''; }
        if (recursion === void 0) { recursion = false; }
        var err = 'You are updating a not existent field:';
        var isStrict = this.state.options.get('strictUpdate', this);
        _.each(data, function ($val, $key) {
            var $path = _.trimStart(path + "." + $key, '.');
            // get the field by path joining keys recursively
            var field = _this.select($path, null, isStrict);
            // if no field found when is strict update, throw error
            if (isStrict)
                utils.throwError($path, field, err);
            // update the field/fields if defined
            if (!_.isUndefined(field)) {
                // update field values or others props
                if (!_.isUndefined($val)) {
                    field.set($, $val, recursion);
                }
                // update values recursively only if field has nested
                if (field.fields.size && _.isObject($val)) {
                    _this.deepSet($, $val, $path, recursion);
                }
            }
        });
    };
    /**
     Add Field
     */
    SharedActions.prototype.add = function (obj) {
        var _this = this;
        if (utils.isArrayOfObjects(obj)) {
            return _.each(obj, function (values) {
                var _a;
                return _this.update((_a = {},
                    _a[utils.maxKey(_this.fields)] = values,
                    _a));
            });
        }
        var key; // eslint-disable-next-line
        if (_.has(obj, 'key'))
            key = obj.key;
        if (_.has(obj, 'name'))
            key = obj.name;
        if (!key)
            key = utils.maxKey(this.fields);
        var $path = function ($key) { return _.trimStart([_this.path, $key].join('.'), '.'); };
        var tree = parser.pathToFieldsTree(this.state.struct(), this.path, 0, true);
        return this.initField(key, $path(key), _.merge(tree[0], obj));
    };
    /**
     Del Field
     */
    SharedActions.prototype.del = function ($path) {
        if ($path === void 0) { $path = null; }
        var isStrict = this.state.options.get('strictDelete', this);
        var path = parser.parsePath(utils.$try($path, this.path));
        var container = this.container($path);
        var keys = _.split(path, '.');
        var last = _.last(keys);
        if (isStrict && !container.fields.has(last)) {
            var msg = "Key \"" + last + "\" not found when trying to delete field";
            var fullpath = _.trim([this.path, path].join('.'), '.');
            utils.throwError(fullpath, null, msg);
        }
        container.fields.delete(last);
    };
    __decorate([
        mobx_1.action
    ], SharedActions.prototype, "submit", null);
    __decorate([
        mobx_1.action
    ], SharedActions.prototype, "deepUpdate", null);
    __decorate([
        mobx_1.action
    ], SharedActions.prototype, "set", null);
    __decorate([
        mobx_1.action
    ], SharedActions.prototype, "add", null);
    __decorate([
        mobx_1.action
    ], SharedActions.prototype, "del", null);
    return SharedActions;
}());
;
exports.default = SharedActions;
//# sourceMappingURL=Actions.js.map