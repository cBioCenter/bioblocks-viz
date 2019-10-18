"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_1 = require("~bioblocks-viz~/action");
// tslint:disable-next-line:export-name
exports.fetchSpringGraphData = function (fetchFn, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return function (dispatch) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var actions, data, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actions = action_1.createDataActions('spring/graphData', namespace);
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
exports.createSpringActions = function (namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return ({
        category: tslib_1.__assign({}, action_1.createValueActions('spring/category', namespace)),
        graphData: tslib_1.__assign({}, action_1.createDataActions('spring/graphData', namespace)),
        species: tslib_1.__assign({}, action_1.createValueActions('spring/species', namespace)),
    });
};
//# sourceMappingURL=SpringAction.js.map