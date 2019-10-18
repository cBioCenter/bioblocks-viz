"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
describe('UMAPTranscriptionalContainer', function () {
    var categoricalAnnotations = {};
    var dataMatrix = [[]];
    beforeEach(function () {
        categoricalAnnotations = {
            banjo: {
                label_colors: {
                    bear: 'brown',
                    bird: 'red',
                },
                label_list: ['bear', 'bird'],
            },
        };
        dataMatrix = [[1, 2, 3], [4, 5, 6]];
    });
    it('Should render when given an empty data matrix.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPTranscriptionalContainerClass, { dataMatrix: [[]] }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render labels.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return tslib_1.__generator(this, function (_a) {
            wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPTranscriptionalContainerClass, { categoricalAnnotations: categoricalAnnotations, dataMatrix: dataMatrix, labelCategory: 'banjo' }));
            expect(wrapper).toMatchSnapshot();
            return [2 /*return*/];
        });
    }); });
    it('Should generate colors if none are provided.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, instance, expected;
        return tslib_1.__generator(this, function (_a) {
            wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPTranscriptionalContainerClass, { categoricalAnnotations: {
                    banjo: tslib_1.__assign(tslib_1.__assign({}, categoricalAnnotations.banjo), { label_colors: {} }),
                }, dataMatrix: dataMatrix, labelCategory: 'banjo' }));
            instance = wrapper.instance();
            expected = {
                banjo: [{ color: '#66c2a5', name: 'bear' }, { color: '#fc8d62', name: 'bird' }],
            };
            expect(instance.state.completeSampleAnnotations).toEqual(expected);
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=UMAPTranscriptionalContainer.test.js.map