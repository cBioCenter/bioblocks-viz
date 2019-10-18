"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var reducer_1 = require("~bioblocks-viz~/reducer");
exports.RESIDUE_PAIR_DATASET_NAME = 'residuePair';
exports.ResiduePairReducer = function (namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return redux_1.combineReducers({
        candidates: reducer_1.ContainerReducer(exports.RESIDUE_PAIR_DATASET_NAME + "/candidates", namespace),
        hovered: reducer_1.ContainerReducer(exports.RESIDUE_PAIR_DATASET_NAME + "/hovered", namespace),
        locked: reducer_1.ObjectReducer(exports.RESIDUE_PAIR_DATASET_NAME + "/locked", namespace),
    });
};
exports.createResiduePairReducer = function (namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducer = exports.ResiduePairReducer(namespace);
    var reducerName = namespace + "/" + exports.RESIDUE_PAIR_DATASET_NAME;
    reducer_1.ReducerRegistry.register(reducerName, reducer);
};
//# sourceMappingURL=ResiduePairReducer.js.map