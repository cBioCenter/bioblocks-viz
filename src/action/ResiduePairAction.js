"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_1 = require("~bioblocks-viz~/action");
var reducer_1 = require("~bioblocks-viz~/reducer");
// tslint:disable-next-line:export-name
exports.createResiduePairActions = function (namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return ({
        candidates: action_1.createContainerActions(reducer_1.RESIDUE_PAIR_DATASET_NAME + "/candidates", namespace),
        hovered: action_1.createContainerActions(reducer_1.RESIDUE_PAIR_DATASET_NAME + "/hovered", namespace),
        locked: action_1.createObjectActions(reducer_1.RESIDUE_PAIR_DATASET_NAME + "/locked", namespace),
    });
};
//# sourceMappingURL=ResiduePairAction.js.map