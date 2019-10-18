"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.BioblocksMiddleware = function (store) { return function (next) { return function (action) {
    var e_1, _a;
    var dispatchResult = next(action);
    try {
        for (var _b = tslib_1.__values(BioblocksMiddlewareTransformer.transforms.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var splitKey = key.split('-');
            if (splitKey[0].includes(action.meta)) {
                var transformFn = BioblocksMiddlewareTransformer.transforms.get(key);
                if (transformFn) {
                    var state = store.getState();
                    var payload = transformFn(state);
                    store.dispatch({
                        payload: payload,
                        type: (splitKey[splitKey.length - 1] + "_SET").toUpperCase(),
                    });
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return dispatchResult;
}; }; };
var BioblocksMiddlewareTransformer = /** @class */ (function () {
    function BioblocksMiddlewareTransformer(requiredDataSubs) {
        if (requiredDataSubs === void 0) { requiredDataSubs = []; }
        this.requiredDataSubs = requiredDataSubs;
    }
    BioblocksMiddlewareTransformer.addTransform = function (transform) {
        var DEFAULT_NAMESPACE = 'bioblocks';
        var fromState = transform.fromState, toState = transform.toState;
        var fromKey = typeof fromState === 'string'
            ? fromState
            : (fromState.namespace ? fromState.namespace : DEFAULT_NAMESPACE) + "/" + fromState.stateName;
        var toKey = typeof toState === 'string'
            ? toState
            : (toState.namespace ? toState.namespace : DEFAULT_NAMESPACE) + "/" + toState.stateName;
        this.transforms.set(fromKey + "-" + toKey, transform.fn);
    };
    BioblocksMiddlewareTransformer.transforms = new Map();
    return BioblocksMiddlewareTransformer;
}());
exports.BioblocksMiddlewareTransformer = BioblocksMiddlewareTransformer;
//# sourceMappingURL=BioblocksMiddleware.js.map