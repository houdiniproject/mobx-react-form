"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var _ = require("lodash");
var utils = require("../utils");
var parser = require("../parser");
/**
  Field Events
*/
var SharedEvents = /** @class */ (function () {
    function SharedEvents() {
    }
    /**
     MobX Event (observe/intercept)
     */
    SharedEvents.prototype.MOBXEvent = function (_a) {
        var _this = this;
        var _b = _a.path, path = _b === void 0 ? null : _b, _c = _a.key, key = _c === void 0 ? 'value' : _c, call = _a.call, type = _a.type;
        var _d;
        var $instance = this.select(path || this.path, null, null) || this;
        var $call = function (change) { return call.apply(null, [{
                change: change,
                form: _this.state.form,
                path: $instance.path || null,
                field: $instance.path ? $instance : null,
            }]); };
        var fn;
        var ffn;
        if (type === 'observer') {
            fn = mobx_1.observe;
            ffn = $instance.fields.observe;
        }
        if (type === 'interceptor') {
            // eslint-disable-next-line
            key = "$" + key;
            fn = mobx_1.intercept;
            ffn = $instance.fields.intercept;
        }
        var $dkey = $instance.path
            ? key + "@" + $instance.path
            : key;
        _.merge(this.state.disposers[type], (_d = {},
            _d[$dkey] = (key === 'fields')
                ? ffn.apply(function (change) { return $call(change); })
                : fn($instance, key, function (change) { return $call(change); }),
            _d));
    };
    /**
     Dispose MOBX Events
     */
    SharedEvents.prototype.dispose = function (opt) {
        if (opt === void 0) { opt = null; }
        if (this.path && opt)
            return this.disposeSingle(opt);
        return this.disposeAll();
    };
    /**
     Dispose All Events (observe/intercept)
     */
    SharedEvents.prototype.disposeAll = function () {
        var dispose = function (disposer) { return disposer.apply(); };
        _.each(this.state.disposers.interceptor, dispose);
        _.each(this.state.disposers.observer, dispose);
        this.state.disposers = { interceptor: {}, observer: {} };
        return null;
    };
    /**
     Dispose Single Event (observe/intercept)
     */
    SharedEvents.prototype.disposeSingle = function (_a) {
        var type = _a.type, _b = _a.key, key = _b === void 0 ? 'value' : _b, _c = _a.path, path = _c === void 0 ? null : _c;
        var $path = parser.parsePath(utils.$try(path, this.path));
        // eslint-disable-next-line
        if (type === 'interceptor')
            key = "$" + key; // target observables
        this.state.disposers[type][key + "@" + $path].apply();
        delete this.state.disposers[type][key + "@" + $path];
    };
    return SharedEvents;
}());
;
exports.default = SharedEvents;
//# sourceMappingURL=Events.js.map