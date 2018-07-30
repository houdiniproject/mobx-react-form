"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var Form_1 = require("./Form");
exports.Form = Form_1.default;
var Field_1 = require("./Field");
exports.Field = Field_1.default;
/* shared prototype methods */
var Initializer_1 = require("./shared/Initializer");
var Helpers_1 = require("./shared/Helpers");
var Actions_1 = require("./shared/Actions");
var Utils_1 = require("./shared/Utils");
var Events_1 = require("./shared/Events");
var TEST = process.env.TEST;
/**
  Enables MobX strict mode globally (TEST only).
  - - - - - - - - - - - - - - - - - -
  In strict mode, it is not allowed to
  change any state outside of an action
*/
if (TEST) {
    if (mobx_1.configure) {
        mobx_1.configure({ enforceActions: true });
    }
    else {
        // useStrict(true);
    }
}
/**
  Extend Classes with Prototype
  - - - - - - - - - - - - - - - - - -
  Cannot use Object.assign as @action
  methods on mixins are non-enumerable
*/
function extend(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
var shared = [
    Initializer_1.default,
    Actions_1.default,
    Helpers_1.default,
    Utils_1.default,
    Events_1.default,
];
extend(Form_1.default, shared);
extend(Field_1.default, shared);
exports.default = Form_1.default;
//# sourceMappingURL=index.js.map