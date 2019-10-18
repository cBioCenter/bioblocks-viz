"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesafe_actions_1 = require("typesafe-actions");
var action_1 = require("~bioblocks-viz~/action");
var reducer_1 = require("~bioblocks-viz~/reducer");
exports.DataReducer = function (dataset, initialState, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var actions = action_1.createDataActions(dataset, namespace);
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case typesafe_actions_1.getType(actions.success): {
                return action.payload;
            }
            case typesafe_actions_1.getType(actions.failure): {
                var payload = action.payload;
                console.error(payload);
                return initialState;
            }
            default:
                return state;
        }
    };
};
exports.createDataReducer = function (dataset, initialState, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducer = exports.DataReducer(dataset, initialState, namespace);
    var reducerName = namespace + "/" + dataset;
    reducer_1.ReducerRegistry.register(reducerName, reducer);
};
//# sourceMappingURL=DataReducer.js.map