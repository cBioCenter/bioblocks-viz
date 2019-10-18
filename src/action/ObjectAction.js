"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesafe_actions_1 = require("typesafe-actions");
// tslint:disable-next-line:export-name
exports.createObjectActions = function (datasetName, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducerName = (namespace + "/" + datasetName).toUpperCase();
    return {
        add: typesafe_actions_1.createStandardAction(reducerName + "_ADD").map(function (payload) { return ({
            meta: datasetName,
            payload: payload,
        }); }),
        clear: typesafe_actions_1.createStandardAction(reducerName + "_CLEAR")(),
        remove: typesafe_actions_1.createStandardAction(reducerName + "_REMOVE").map(function (payload) { return ({
            meta: datasetName,
            payload: payload,
        }); }),
        removeMultiple: typesafe_actions_1.createStandardAction(reducerName + "_REMOVE_MULTIPLE").map(function (payload) { return ({
            meta: datasetName,
            payload: payload,
        }); }),
        set: typesafe_actions_1.createStandardAction(reducerName + "_SET").map(function (payload) { return ({
            meta: datasetName,
            payload: payload,
        }); }),
        toggle: typesafe_actions_1.createStandardAction(reducerName + "_TOGGLE").map(function (payload) { return ({
            meta: datasetName,
            payload: payload,
        }); }),
    };
};
//# sourceMappingURL=ObjectAction.js.map