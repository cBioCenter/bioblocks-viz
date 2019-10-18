"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typesafe_actions_1 = require("typesafe-actions");
// tslint:disable-next-line:export-name
exports.createDataActions = function (datasetName, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    var reducerName = (namespace + "/" + datasetName).toUpperCase();
    return typesafe_actions_1.createAsyncAction(reducerName + "_FETCH_DATA_REQUEST", reducerName + "_FETCH_DATA_SUCCESS", reducerName + "_FETCH_DATA_FAILURE")();
};
exports.fetchDataset = function (datasetName, fetchFn, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return function (dispatch) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var actions, data, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actions = exports.createDataActions(datasetName, namespace);
                    dispatch(actions.request());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchFn()];
                case 2:
                    data = _a.sent();
                    dispatch(actions.success(data));
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    dispatch(actions.failure(e_1));
                    console.log("An error occurred: " + e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
};
//# sourceMappingURL=DataAction.js.map