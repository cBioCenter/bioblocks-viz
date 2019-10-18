"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 *
 * Based off this post on how Twitter handles redux modules:
 * http://nicolasgallagher.com/redux-modules-and-code-splitting/
 */
var ReducerRegistryClass = /** @class */ (function () {
    function ReducerRegistryClass() {
        this.reducers = {};
        this.emitChange = null;
    }
    ReducerRegistryClass.prototype.getReducers = function () {
        return tslib_1.__assign({}, this.reducers);
    };
    ReducerRegistryClass.prototype.register = function (name, reducer) {
        var _a;
        if (Object.keys(this.reducers).includes(name)) {
            console.log("Reducer '" + name + " already exists, not replacing");
        }
        else {
            this.reducers = tslib_1.__assign(tslib_1.__assign({}, this.reducers), (_a = {}, _a[name] = reducer, _a));
        }
        if (this.emitChange) {
            this.emitChange(this.getReducers());
        }
    };
    ReducerRegistryClass.prototype.setChangeListener = function (listener) {
        this.emitChange = listener;
    };
    return ReducerRegistryClass;
}());
var configureReducerRegistry = function () { return new ReducerRegistryClass(); };
var ReducerRegistry = configureReducerRegistry();
exports.ReducerRegistry = ReducerRegistry;
//# sourceMappingURL=ReducerRegistry.js.map