"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesafe_actions_1 = require("typesafe-actions");
var action_1 = require("~bioblocks-viz~/action");
var reducer_1 = require("~bioblocks-viz~/reducer");
exports.ValueReducer = function (dataset, initialState, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var actions = action_1.createValueActions(dataset, namespace);
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case typesafe_actions_1.getType(actions.clear):
                return initialState;
            case typesafe_actions_1.getType(actions.set): {
                return action.payload;
            }
            default:
                return state;
        }
    };
};
exports.createValueReducer = function (dataset, initialState, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducer = exports.ValueReducer(dataset, initialState, namespace);
    var reducerName = namespace + "/" + dataset;
    reducer_1.ReducerRegistry.register(reducerName, reducer);
};
//# sourceMappingURL=ValueReducer.js.map