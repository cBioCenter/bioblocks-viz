"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
describe('InfoPanelContainer', function () {
    var pdbData;
    var sampleData;
    beforeEach(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('../../../test/data/protein.pdb')];
                case 1:
                    pdbData = _a.sent();
                    sampleData = {
                        couplingScores: new data_1.CouplingContainer([{ i: 1, j: 2 }, { i: 3, j: 4 }]),
                        secondaryStructures: [
                            [
                                {
                                    end: 31,
                                    label: 'C',
                                    length: 2,
                                    start: 30,
                                },
                            ],
                        ],
                    };
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should match existing snapshot when given no props.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.InfoPanelContainerClass, null));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given sample data.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.InfoPanelContainerClass, { data: sampleData }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given sample data and a known PDB.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.InfoPanelContainerClass, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { pdbData: { experimental: pdbData } }) }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given sample data and a predicted PDB.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.InfoPanelContainerClass, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { pdbData: { predicted: pdbData } }) }));
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=InfoPanelContainer.test.js.map