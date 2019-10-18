"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
// tslint:disable-next-line:export-name
exports.selectObject = function (state, dataset, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return state && state[namespace + "/" + dataset]
        ? state[namespace + "/" + dataset]
        : immutable_1.Map();
};
//# sourceMappingURL=ObjectSelectors.js.map