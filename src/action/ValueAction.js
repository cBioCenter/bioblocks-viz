"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesafe_actions_1 = require("typesafe-actions");
// tslint:disable-next-line:export-name
exports.createValueActions = function (datasetName, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducerName = (namespace + "/" + datasetName).toUpperCase();
    return {
        clear: typesafe_actions_1.createStandardAction(reducerName + "_CLEAR")(),
        set: typesafe_actions_1.createStandardAction(reducerName + "_SET").map(function (payload) { return ({
            meta: datasetName,
            payload: payload,
        }); }),
    };
};
//# sourceMappingURL=ValueAction.js.map