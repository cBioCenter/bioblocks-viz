"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var test_1 = require("~bioblocks-viz~/test");
describe('ContactMapComponent', function () {
    var emptyData;
    var sampleContactsWithAminoAcids;
    var sampleCorrectPredictedContacts;
    var sampleIncorrectPredictedContacts;
    var sampleOutOfLinearDistContacts;
    var sampleData;
    var sampleDataWithAminoAcid;
    var uniqueScores;
    var sampleObservedContacts;
    beforeEach(function () {
        jest.resetModuleRegistry();
        emptyData = {
            couplingScores: new data_1.CouplingContainer(),
            secondaryStructures: [],
        };
        sampleContactsWithAminoAcids = [
            generateCouplingScore(1, 10, 1.3, { A_i: 'N', A_j: 'I' }),
            generateCouplingScore(10, 1, 1.3, { A_i: 'I', A_j: 'N' }),
        ];
        sampleCorrectPredictedContacts = [generateCouplingScore(56, 50, 2.4)];
        sampleIncorrectPredictedContacts = [generateCouplingScore(42, 50, 20.4)];
        sampleOutOfLinearDistContacts = [
            generateCouplingScore(45, 46, 1.3),
            generateCouplingScore(44, 45, 1.3),
            generateCouplingScore(56, 57, 1.3),
        ];
        sampleObservedContacts = tslib_1.__spread(sampleCorrectPredictedContacts, [generateCouplingScore(41, 52, 1.3)]);
        uniqueScores = new Set(Array.from(tslib_1.__spread(sampleCorrectPredictedContacts, sampleIncorrectPredictedContacts, sampleObservedContacts, sampleOutOfLinearDistContacts)));
        sampleData = {
            couplingScores: new data_1.CouplingContainer(Array.from(uniqueScores).map(function (value, index) { return ({
                dist: value.dist,
                i: value.i,
                j: value.j,
            }); })),
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
        sampleDataWithAminoAcid = {
            couplingScores: new data_1.CouplingContainer(sampleContactsWithAminoAcids),
            secondaryStructures: [],
        };
    });
    var generateCouplingScore = function (i, j, dist, extra) { return (tslib_1.__assign({ dist: dist,
        i: i,
        j: j }, extra)); };
    // Translated from example1/coupling_scores.csv
    describe('Snapshots', function () {
        it('Should match existing snapshot when given no data.', function () {
            expect(enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, null))).toMatchSnapshot();
        });
        it('Should match existing snapshot when given empty data.', function () {
            expect(enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, { data: emptyData }))).toMatchSnapshot();
        });
        it('Should match snapshot when locked residues are added.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, expectedSelectedPoints;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: sampleData }))];
                    case 1:
                        wrapper = _a.sent();
                        expectedSelectedPoints = new Map(Object.entries({
                            '37,46': [37, 46],
                            8: [8],
                        }));
                        wrapper.setProps({
                            lockedResiduePairs: expectedSelectedPoints,
                        });
                        wrapper.update();
                        expect(wrapper).toMatchSnapshot();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should match existing snapshot when given basic data.', function () {
            expect(enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, { data: sampleData }))).toMatchSnapshot();
        });
        it('Should match existing snapshot when given data with amino acids.', function () {
            expect(enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, { data: sampleDataWithAminoAcid }))).toMatchSnapshot();
        });
        it('Should match existing snapshot when given data with a PDB.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var pdbData, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, data_1.BioblocksPDB.createPDB()];
                    case 1:
                        pdbData = (_a.experimental = _b.sent(), _a);
                        expect(enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, { data: tslib_1.__assign(tslib_1.__assign({}, sampleDataWithAminoAcid), { pdbData: pdbData }) }))).toMatchSnapshot();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should match existing snapshot when a single point are hovered.', function () {
            expect(enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, { data: sampleData, hoveredResidues: [sampleData.couplingScores.getObservedContacts()[0].i] }))).toMatchSnapshot();
        });
        it('Should match existing snapshot when multiple points are hovered.', function () {
            var contact = sampleData.couplingScores.getObservedContacts()[0];
            expect(enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, { data: sampleData, hoveredResidues: [contact.i, contact.j] }))).toMatchSnapshot();
        });
        it('Should match existing snapshot when multiple points are selected.', function () {
            var contacts = sampleData.couplingScores.getObservedContacts();
            var wrapper = enzyme_1.shallow(React.createElement(component_1.ContactMapComponent, { data: sampleData, hoveredResidues: [contacts[0].i, contacts[0].j], lockedResiduePairs: {
                    '41,52': [41, 52],
                } }));
            wrapper.setProps({
                hoveredResidues: [contacts[0].i, contacts[0].j],
                lockedResiduePairs: {
                    '41,52': [41, 52],
                    '50,56': [50, 56],
                },
            });
            expect(wrapper).toMatchSnapshot();
        });
    });
    describe('Callbacks', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            it('Should invoke callback to add locked residues when a click event is fired.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var onClickSpy, wrapper;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onClickSpy = jest.fn();
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: sampleData, toggleLockedResiduePair: onClickSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_click')];
                        case 2:
                            _a.sent();
                            expect(onClickSpy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback to add hovered residues when a hover event is fired.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var onHoverSpy, wrapper;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onHoverSpy = jest.fn();
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: sampleData, addHoveredResidues: onHoverSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover')];
                        case 2:
                            _a.sent();
                            expect(onHoverSpy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback to remove hovered residues when the mouse leaves.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var onHoverSpy, wrapper;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onHoverSpy = jest.fn();
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: sampleData, removeHoveredResidues: onHoverSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_unhover')];
                        case 2:
                            _a.sent();
                            expect(onHoverSpy).toHaveBeenCalledTimes(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback for selected residues when a click event is fired.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var onSelectedSpy, wrapper;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onSelectedSpy = jest.fn();
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: sampleData, onBoxSelection: onSelectedSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper)];
                        case 2:
                            _a.sent();
                            expect(onSelectedSpy).toHaveBeenLastCalledWith([0, 0]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback for adding a secondary structure when a mouse clicks it the first time.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var addSecondaryStructureSpy, testSecStruct, wrapper, data;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            addSecondaryStructureSpy = jest.fn();
                            testSecStruct = new data_1.Bioblocks1DSection('C', 0, 10);
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { secondaryStructures: [[testSecStruct]] }), addSelectedSecondaryStructure: addSecondaryStructureSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            data = {
                                data: { type: 'scattergl', xaxis: 'x2' },
                                x: [0],
                                y: [0],
                            };
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_click', data)];
                        case 2:
                            _a.sent();
                            expect(addSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback for removing a secondary structure when a mouse clicks one that is already locked.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var removeSecondaryStructureSpy, testSecStruct, wrapper, data;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            removeSecondaryStructureSpy = jest.fn();
                            testSecStruct = new data_1.Bioblocks1DSection('C', 0, 10);
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { secondaryStructures: [[testSecStruct]] }), removeSecondaryStructure: removeSecondaryStructureSpy, selectedSecondaryStructures: [testSecStruct] }))];
                        case 1:
                            wrapper = _a.sent();
                            data = {
                                data: { type: 'scattergl', xaxis: 'x2' },
                                x: [0],
                                y: [0],
                            };
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_click', data)];
                        case 2:
                            _a.sent();
                            expect(removeSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback for toggling a secondary structure when a mouse hovers over it.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var toggleSecondaryStructureSpy, testSecStruct, wrapper, data;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            toggleSecondaryStructureSpy = jest.fn();
                            testSecStruct = new data_1.Bioblocks1DSection('C', 0, 10);
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { secondaryStructures: [[testSecStruct]] }), addHoveredSecondaryStructure: toggleSecondaryStructureSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            data = {
                                data: { type: 'scattergl', xaxis: 'x2' },
                                x: [0],
                                y: [0],
                            };
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover', data)];
                        case 2:
                            _a.sent();
                            expect(toggleSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should not invoke callback for toggling a secondary structure when a mouse hovers over a different structure.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var toggleSecondaryStructureSpy, testSecStruct, wrapper, data;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            toggleSecondaryStructureSpy = jest.fn();
                            testSecStruct = new data_1.Bioblocks1DSection('C', 10, 11);
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { secondaryStructures: [[testSecStruct]] }), addHoveredSecondaryStructure: toggleSecondaryStructureSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            data = {
                                data: { type: 'scattergl', xaxis: 'x2' },
                                x: [0],
                                y: [0],
                            };
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover', data)];
                        case 2:
                            _a.sent();
                            expect(toggleSecondaryStructureSpy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback for removing a secondary structure when a mouse leaves it.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var removeSecondaryStructureSpy, testSecStruct, wrapper, data;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            removeSecondaryStructureSpy = jest.fn();
                            testSecStruct = new data_1.Bioblocks1DSection('C', 0, 10);
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { secondaryStructures: [[testSecStruct]] }), hoveredSecondaryStructures: [testSecStruct], removeHoveredSecondaryStructure: removeSecondaryStructureSpy, selectedSecondaryStructures: [] }))];
                        case 1:
                            wrapper = _a.sent();
                            data = {
                                data: { type: 'scattergl', xaxis: 'x2' },
                                x: 0,
                                y: 0,
                            };
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_unhover', data)];
                        case 2:
                            _a.sent();
                            expect(removeSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should not invoke callback for toggling a secondary structure when a mouse leaves a different structure.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var toggleSecondaryStructureSpy, testSecStruct, wrapper, data;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            toggleSecondaryStructureSpy = jest.fn();
                            testSecStruct = new data_1.Bioblocks1DSection('C', 10, 11);
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: tslib_1.__assign(tslib_1.__assign({}, sampleData), { secondaryStructures: [[testSecStruct]] }), addHoveredSecondaryStructure: toggleSecondaryStructureSpy }))];
                        case 1:
                            wrapper = _a.sent();
                            data = {
                                data: { type: 'scattergl', xaxis: 'x2' },
                                x: 0,
                                y: 0,
                            };
                            return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_unhover', data)];
                        case 2:
                            _a.sent();
                            expect(toggleSecondaryStructureSpy).not.toHaveBeenCalled();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should _not_ clear residues when given new data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var onClearResidueSpy, wrapper;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onClearResidueSpy = jest.fn();
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: sampleData }))];
                        case 1:
                            wrapper = _a.sent();
                            wrapper.update();
                            wrapper.setProps({
                                data: emptyData,
                            });
                            wrapper.update();
                            expect(onClearResidueSpy).toHaveBeenCalledTimes(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should invoke callback for clearing all selections when clicked.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var mocks, wrapper;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mocks = [jest.fn(), jest.fn(), jest.fn()];
                            return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.ContactMapComponent, { data: sampleData, selectedSecondaryStructures: sampleData.secondaryStructures[0], removeAllLockedResiduePairs: mocks[0], removeAllSelectedSecondaryStructures: mocks[1], removeHoveredResidues: mocks[2] }))];
                        case 1:
                            wrapper = _a.sent();
                            wrapper.find('a[children="Clear Selections"]').simulate('click');
                            mocks.forEach(function (mock) {
                                expect(mock).toHaveBeenCalledTimes(1);
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe('Configuration', function () {
        it('Should handle the node size being changed.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.ContactMapComponent, null));
            var instance = wrapper.instance();
            var expected = 10;
            expect(instance.state.pointsToPlot[0].nodeSize).not.toEqual(expected);
            instance.onNodeSizeChange(0, expected)();
            expect(instance.state.pointsToPlot[0].nodeSize).toEqual(expected);
        });
    });
});
//# sourceMappingURL=ContactMapComponent.test.js.map