"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("../utils");
var parser = require("../parser");
/**
  Field Utils
*/
var SharedUtils = /** @class */ (function () {
    function SharedUtils() {
    }
    /**
     Fields Selector
     */
    SharedUtils.prototype.select = function (path, fields, isStrict) {
        if (fields === void 0) { fields = null; }
        if (isStrict === void 0) { isStrict = true; }
        var $path = parser.parsePath(path);
        var keys = _.split($path, '.');
        var head = _.head(keys);
        keys.shift();
        var $fields = _.isNil(fields)
            ? this.fields.get(head)
            : fields.get(head);
        var stop = false;
        _.each(keys, function ($key) {
            if (stop)
                return;
            if (_.isNil($fields)) {
                $fields = undefined;
                stop = true;
            }
            else {
                $fields = $fields.fields.get($key);
            }
        });
        if (isStrict)
            utils.throwError(path, $fields);
        return $fields;
    };
    /**
      Get Container
     */
    SharedUtils.prototype.container = function ($path) {
        var path = parser.parsePath(utils.$try($path, this.path));
        var cpath = _.trim(path.replace(new RegExp('[^./]+$'), ''), '.');
        if (!!this.path && _.isNil($path)) {
            return cpath !== ''
                ? this.state.form.select(cpath, null, false)
                : this.state.form;
        }
        return cpath !== ''
            ? this.select(cpath, null, false)
            : this;
    };
    /**
      Has Field
     */
    SharedUtils.prototype.has = function (path) {
        return this.fields.has(path);
    };
    /**
     Map Fields
    */
    SharedUtils.prototype.map = function (cb) {
        return utils.getObservableMapValues(this.fields).map(cb);
    };
    /**
     * Iterates deeply over fields and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, depth).
     *
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Array|Object} [fields=form.fields] fields to iterate over.
     * @param {number} [depth=1] The recursion depth for internal use.
     * @returns {Array} Returns [fields.values()] of input [fields] parameter.
     * @example
     *
     * JSON.stringify(form)
     * // => {
       *   "fields": {
       *     "state": {
       *       "fields": {
       *         "city": {
       *           "fields": { "places": {
       *                "fields": {},
       *                "key": "places", "path": "state.city.places", "$value": "NY Places"
       *              }
       *           },
       *           "key": "city", "path": "state.city", "$value": "New York"
       *         }
       *       },
       *       "key": "state", "path": "state", "$value": "USA"
       *     }
       *   }
       * }
     *
     * const data = {};
     * form.each(field => data[field.path] = field.value);
     * // => {
       *   "state": "USA",
       *   "state.city": "New York",
       *   "state.city.places": "NY Places"
       * }
     *
     */
    SharedUtils.prototype.each = function (iteratee, fields, depth) {
        var _this = this;
        if (fields === void 0) { fields = null; }
        if (depth === void 0) { depth = 0; }
        var $fields = fields || this.fields;
        _.each(utils.getObservableMapValues($fields), function (field, index) {
            iteratee(field, index, depth);
            if (field.fields.size !== 0) {
                _this.each(iteratee, field.fields, depth + 1);
            }
        });
    };
    return SharedUtils;
}());
exports.default = SharedUtils;
//# sourceMappingURL=Utils.js.map