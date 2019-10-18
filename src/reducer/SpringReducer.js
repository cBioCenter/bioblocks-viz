"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var reducer_1 = require("~bioblocks-viz~/reducer");
exports.SpringReducer = function (namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return redux_1.combineReducers({
        category: reducer_1.ValueReducer('spring/category', '', namespace),
        graphData: reducer_1.DataReducer('spring/graphData', { nodes: [] }, namespace),
    });
};
exports.createSpringReducer = function (namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducer = exports.SpringReducer(namespace);
    var reducerName = namespace + "/spring";
    reducer_1.ReducerRegistry.register(reducerName, reducer);
};
//# sourceMappingURL=SpringReducer.js.map