"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
describe('AuxiliaryAxis', function () {
    var sampleSections;
    beforeEach(function () {
        sampleSections = [new data_1.Bioblocks1DSection('kanto', 1, 151), new data_1.Bioblocks1DSection('johto', 152, 251)];
    });
    it('Should allow passing a specific axis index.', function () {
        var result = new component_1.AuxiliaryAxis(sampleSections, 4);
        expect(result.axisIndex).toEqual(4);
    });
    it('Should allow a data transform function to be run on each section.', function () {
        var dataTransformSpy = {
            johto: jest.fn(function () { return ({ main: 0, opposite: 0 }); }),
            kanto: jest.fn(function () { return ({ main: 0, opposite: 0 }); }),
        };
        var result = new component_1.AuxiliaryAxis(sampleSections, 0, new helper_1.ColorMapper(), dataTransformSpy);
        expect(result.axis.size).toEqual(2);
        expect(dataTransformSpy.johto).toHaveBeenCalled();
        expect(dataTransformSpy.kanto).toHaveBeenCalled();
    });
    it('Should allow a filter function to determine if a section gets transformed.', function () {
        var filterSpy = jest.fn();
        var result = new component_1.AuxiliaryAxis(sampleSections, 0, new helper_1.ColorMapper(), undefined, filterSpy);
        expect(result.axis.size).toEqual(2);
        expect(filterSpy).toHaveBeenCalledTimes(2);
    });
    it('Should allow a filter function that can disable the transform function on certain sections.', function () {
        var dataTransformSpy = {
            johto: jest.fn(function () { return ({ main: 0, opposite: 0 }); }),
            kanto: jest.fn(),
        };
        var filterSpy = jest.fn(function (section) { return section.label === 'kanto'; });
        var result = new component_1.AuxiliaryAxis(sampleSections, 0, new helper_1.ColorMapper(), dataTransformSpy, filterSpy);
        expect(result.axis.size).toEqual(1);
        expect(filterSpy).toHaveBeenCalled();
        expect(dataTransformSpy.johto).toHaveBeenCalled();
        expect(dataTransformSpy.kanto).not.toHaveBeenCalled();
    });
    it('Should allow a color map to color specific sections.', function () {
        var colorMap = new helper_1.ColorMapper(new Map([['johto', 'gold'], ['kanto', 'red']]));
        var result = new component_1.AuxiliaryAxis(tslib_1.__spread(sampleSections, [new data_1.Bioblocks1DSection('unova', 494, 649)]), 0, colorMap);
        expect(result.axis.size).toEqual(3);
        var johtoAxis = result.getAxisById('johto');
        var kantoAxis = result.getAxisById('kanto');
        var unovaAxis = result.getAxisById('unova');
        if (!johtoAxis || !kantoAxis || !unovaAxis) {
            expect(johtoAxis).not.toBeUndefined();
            expect(kantoAxis).not.toBeUndefined();
            expect(unovaAxis).not.toBeUndefined();
        }
        else {
            expect(johtoAxis.x.line && johtoAxis.x.line.color).toEqual('gold');
            expect(kantoAxis.x.line && kantoAxis.x.line.color).toEqual('red');
            expect(unovaAxis.x.line && unovaAxis.x.line.color).toEqual('black');
        }
    });
});
//# sourceMappingURL=AuxiliaryAxis.test.js.map