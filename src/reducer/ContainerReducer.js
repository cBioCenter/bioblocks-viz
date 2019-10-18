"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var typesafe_actions_1 = require("typesafe-actions");
var action_1 = require("~bioblocks-viz~/action");
var reducer_1 = require("~bioblocks-viz~/reducer");
exports.ContainerReducer = function (dataset, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var actions = action_1.createContainerActions(dataset, namespace);
    var initialState = immutable_1.Set();
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case typesafe_actions_1.getType(actions.add): {
                var payload = action.payload;
                return state.add(payload);
            }
            case typesafe_actions_1.getType(actions.addMultiple): {
                var payload = action.payload;
                return payload.reduce(function (prev, cur) { return prev.add(cur); }, state);
            }
            case typesafe_actions_1.getType(actions.clear):
                return immutable_1.Set();
            case typesafe_actions_1.getType(actions.remove): {
                var payload = action.payload;
                return state.remove(payload);
            }
            case typesafe_actions_1.getType(actions.removeMultiple): {
                var payload = action.payload;
                return payload.reduce(function (prev, cur) { return prev.remove(cur); }, state);
            }
            case typesafe_actions_1.getType(actions.set): {
                var payload = action.payload;
                return immutable_1.Set(payload);
            }
            default:
                return state;
        }
    };
};
exports.createContainerReducer = function (dataset, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducer = exports.ContainerReducer(dataset, namespace);
    var reducerName = namespace + "/" + dataset;
    reducer_1.ReducerRegistry.register(reducerName, reducer);
};
//# sourceMappingURL=ContainerReducer.js.map