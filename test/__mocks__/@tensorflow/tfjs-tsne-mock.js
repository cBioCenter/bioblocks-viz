"use strict";
var tslib_1 = require("tslib");
var tensorFlowTSNEMock = Promise.resolve({
    tsne: function (data) { return ({
        compute: function (iterations) { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()];
        }); }); },
        coordsArray: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve(data)];
        }); }); },
        iterate: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()];
        }); }); },
    }); },
});
module.exports = tensorFlowTSNEMock;
//# sourceMappingURL=tfjs-tsne-mock.js.map