"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var test_1 = require("~bioblocks-viz~/test");
describe('ContactMapContainer', function () {
    var emptyData;
    var sampleCorrectPredictedContacts;
    var sampleData;
    var sampleIncorrectPredictedContacts;
    var sampleObservedContacts;
    var sampleOutOfLinearDistContacts;
    var uniqueScores;
    beforeEach(function () {
        emptyData = {
            couplingScores: new data_1.CouplingContainer(),
            secondaryStructures: [],
        };
        // Translated from example1/coupling_scores.csv
        sampleCorrectPredictedContacts = [generateCouplingScore(56, 50, 2.4)];
        sampleIncorrectPredictedContacts = [generateCouplingScore(42, 50, 20.4)];
        sampleObservedContacts = tslib_1.__spread(sampleCorrectPredictedContacts, [generateCouplingScore(41, 52, 1.3)]);
        sampleOutOfLinearDistContacts = [
            generateCouplingScore(45, 46, 1.3),
            generateCouplingScore(44, 45, 1.3),
            generateCouplingScore(56, 57, 1.3),
        ];
        uniqueScores = new Set(Array.from(tslib_1.__spread(sampleCorrectPredictedContacts, sampleIncorrectPredictedContacts, sampleObservedContacts, sampleOutOfLinearDistContacts)));
        sampleData = {
            couplingScores: new data_1.CouplingContainer(Array.from(uniqueScores)),
            secondaryStructures: [[new data_1.Bioblocks1DSection('C', 30, 31)]],
        };
    });
    var generateCouplingScore = function (i, j, dist, extra) { return (tslib_1.__assign({ dist: dist,
        i: i,
        j: j }, extra)); };
    describe('Snapshots', function () {
        it('Should match existing snapshot when given no data.', function () {
            expect(enzyme_1.shallow(React.createElement(container_1.ContactMapContainerClass, null))).toMatchSnapshot();
        });
        it('Should match existing snapshot when given empty data.', function () {
            expect(enzyme_1.shallow(React.createElement(container_1.ContactMapContainerClass, { data: emptyData }))).toMatchSnapshot();
        });
        it('Should match snapshot when locked residues are added.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, expectedSelectedPoints;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.getAsyncShallowComponent(React.createElement(container_1.ContactMapContainerClass, null))];
                    case 1:
                        wrapper = _a.sent();
                        expectedSelectedPoints = {
                            '37,46': [37, 46],
                            8: [8],
                        };
                        wrapper.setProps({
                            lockedResiduePairs: expectedSelectedPoints,
                        });
                        wrapper.update();
                        expect(wrapper).toMatchSnapshot();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Sliders', function () {
        it('Should update linear distance filter when appropriate slider is updated.', function () {
            var wrapper = enzyme_1.shallow(React.createElement(container_1.ContactMapContainerClass, { data: sampleData }));
            var instance = wrapper.instance();
            var expected = 10;
            expect(instance.state.linearDistFilter).not.toBe(expected);
            instance.onLinearDistFilterChange()(expected);
            instance.forceUpdate();
            expect(instance.state.linearDistFilter).toBe(expected);
        });
        it('Should update number of predicted contacts to show when appropriate slider is updated.', function () {
            var wrapper = enzyme_1.shallow(React.createElement(container_1.ContactMapContainerClass, { data: sampleData }));
            var instance = wrapper.instance();
            var expectedCount = 50;
            expect(instance.state.numPredictionsToShow).not.toBe(expectedCount);
            instance.onNumPredictionsToShowChange()(expectedCount);
            wrapper.update();
            expect(instance.state.numPredictionsToShow).toBe(expectedCount);
        });
        it('Should update # of predicted contacts to show when appropriate slider is updated.', function () {
            var wrapper = enzyme_1.shallow(React.createElement(container_1.ContactMapContainerClass, { data: sampleData }));
            var instance = wrapper.instance();
            var expected = 20;
            expect(instance.state.numPredictionsToShow).not.toBe(expected);
            instance.onNumPredictionsToShowChange()(expected);
            wrapper.update();
            expect(instance.state.numPredictionsToShow).toBe(expected);
        });
    });
    it('Should update number of predictions to show when new value is received.', function () {
        var expected = 28;
        var wrapper = enzyme_1.shallow(React.createElement(container_1.ContactMapContainerClass, { data: emptyData }));
        expect(wrapper.state('numPredictionsToShow')).not.toBe(expected);
        wrapper.setState({
            numPredictionsToShow: expected,
        });
        expect(wrapper.state('numPredictionsToShow')).toBe(expected);
    });
    it('Should update points to plot when new data is provided.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.ContactMapContainerClass, { data: emptyData }));
        wrapper.setProps({
            data: sampleData,
        });
        var state = wrapper.instance().state;
        expect(state.pointsToPlot).not.toEqual([]);
        expect(state.pointsToPlot).toMatchSnapshot();
    });
});
//# sourceMappingURL=ContactMapContainer.test.js.map