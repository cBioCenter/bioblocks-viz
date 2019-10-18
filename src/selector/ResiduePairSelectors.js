"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
// tslint:disable-next-line:export-name
exports.getResiduePairs = function (state, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return (state === undefined || !state[namespace + "/residuePair"]
        ? {
            candidates: immutable_1.Set(),
            hovered: immutable_1.Set(),
            locked: immutable_1.Map(),
        }
        : state[namespace + "/residuePair"]);
};
exports.getCandidates = function (state, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return exports.getResiduePairs(state, namespace).candidates;
};
exports.getHovered = function (state, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return exports.getResiduePairs(state, namespace).hovered;
};
exports.getLocked = function (state, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return exports.getResiduePairs(state, namespace).locked;
};
//# sourceMappingURL=ResiduePairSelectors.js.map