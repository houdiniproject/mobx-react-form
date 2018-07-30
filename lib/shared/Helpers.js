"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
  Field Helpers
*/
var SharedHelpers = /** @class */ (function () {
    function SharedHelpers() {
    }
    /**
     Fields Selector (alias of select)
     */
    SharedHelpers.prototype.$ = function (key) { return this.select(key); };
    /**
     Fields Values (recursive with Nested Fields)
     */
    SharedHelpers.prototype.values = function () { return this.get('value'); };
    /**
     Fields Errors (recursive with Nested Fields)
     */
    SharedHelpers.prototype.errors = function () { return this.get('error'); };
    /**
     Fields Labels (recursive with Nested Fields)
     */
    SharedHelpers.prototype.labels = function () { return this.get('label'); };
    /**
     Fields Placeholders (recursive with Nested Fields)
     */
    SharedHelpers.prototype.placeholders = function () { return this.get('placeholder'); };
    /**
     Fields Default Values (recursive with Nested Fields)
     */
    SharedHelpers.prototype.defaults = function () { return this.get('default'); };
    /**
     Fields Initial Values (recursive with Nested Fields)
     */
    SharedHelpers.prototype.initials = function () { return this.get('initial'); };
    /**
     Fields Types (recursive with Nested Fields)
     */
    SharedHelpers.prototype.types = function () { return this.get('type'); };
    return SharedHelpers;
}());
;
exports.default = SharedHelpers;
//# sourceMappingURL=Helpers.js.map