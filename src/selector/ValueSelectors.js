"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:export-name
exports.selectCurrentValue = function (state, dataset, defaultValue, namespace) {
    if (defaultValue === void 0) { defaultValue = null; }
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return (state && state[namespace + "/" + dataset] ? state[namespace + "/" + dataset] : defaultValue);
};
//# sourceMappingURL=ValueSelectors.js.map