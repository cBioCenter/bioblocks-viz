"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var typesafe_actions_1 = require("typesafe-actions");
var action_1 = require("~bioblocks-viz~/action");
var reducer_1 = require("~bioblocks-viz~/reducer");
exports.ObjectReducer = function (dataset, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var actions = action_1.createObjectActions(dataset, namespace);
    var initialState = immutable_1.Map();
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case typesafe_actions_1.getType(actions.add): {
                var payload = action.payload;
                return state.merge(payload);
            }
            case typesafe_actions_1.getType(actions.clear):
                return immutable_1.Map();
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
                return immutable_1.Map(payload);
            }
            case typesafe_actions_1.getType(actions.toggle): {
                var payload_1 = action.payload;
                var result_1 = state;
                Object.keys(payload_1).forEach(function (key) {
                    result_1 = state.has(key) ? state.remove(key) : state.set(key, payload_1[key]);
                });
                return result_1;
            }
            default:
                return state;
        }
    };
};
exports.createObjectReducer = function (dataset, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducer = exports.ObjectReducer(dataset, namespace);
    var reducerName = namespace + "/" + dataset;
    reducer_1.ReducerRegistry.register(reducerName, reducer);
};
//# sourceMappingURL=ObjectReducer.js.map