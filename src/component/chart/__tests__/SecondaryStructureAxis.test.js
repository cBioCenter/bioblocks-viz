"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
describe('SecondaryStructureAxis', function () {
    var genSeqEntry = function (structId, resno, length) {
        if (length === void 0) { length = 1; }
        return [new data_1.Bioblocks1DSection(structId, resno, resno + length - 1)];
    };
    it('Should create an empty axis when no secondary structure is provided.', function () {
        var result = new component_1.SecondaryStructureAxis([]);
        expect(result.axis).toEqual(new Map());
    });
    it('Should handle an axis made up of a single secondary structure entry.', function () {
        var result = new component_1.SecondaryStructureAxis(genSeqEntry('E', 0), 0, 0);
        expect(result.axis.size).toBe(1);
    });
    it('Should handle an axis made up of different secondary structure types.', function () {
        var result = new component_1.SecondaryStructureAxis(tslib_1.__spread(genSeqEntry('B', 0), genSeqEntry('C', 1), genSeqEntry('E', 2)), 0, 0);
        expect(result.axis.size).toBe(3);
    });
    it('Should allow custom color mappings.', function () {
        var newColorMap = new helper_1.ColorMapper(new Map([['C', 'purple'], ['E', 'orange'], ['H', 'black']]), 'black');
        var result = new component_1.SecondaryStructureAxis(tslib_1.__spread(genSeqEntry('C', 1), genSeqEntry('E', 2), genSeqEntry('H', 0)), 0, 2, newColorMap);
        var cAxis = result.getAxisById('C');
        var eAxis = result.getAxisById('E');
        var hAxis = result.getAxisById('H');
        if (!cAxis || !eAxis || !hAxis) {
            expect(cAxis).not.toBeUndefined();
            expect(eAxis).not.toBeUndefined();
            expect(hAxis).not.toBeUndefined();
        }
        else {
            expect(cAxis.x.line && cAxis.x.line.color).toBe(newColorMap.getColorFor('C'));
            expect(cAxis.y.line && cAxis.y.line.color).toBe(newColorMap.getColorFor('C'));
            expect(eAxis.x.line && eAxis.x.line.color).toBe(newColorMap.getColorFor('E'));
            expect(eAxis.y.line && eAxis.y.line.color).toBe(newColorMap.getColorFor('E'));
            expect(hAxis.x.line && hAxis.x.line.color).toBe(newColorMap.getColorFor('H'));
            expect(hAxis.y.line && hAxis.y.line.color).toBe(newColorMap.getColorFor('H'));
        }
    });
    describe('Alpha Helix', function () {
        it('Should use points for a sine wave for alpha helix secondary structures.', function () {
            var result = new component_1.SecondaryStructureAxis(genSeqEntry('H', 1, 5));
            var expectedMainAxis = [1, 1, 2, 3, 4, 5, 5];
            var axis = result.getAxisById('H');
            expect(axis.x.x).toEqual(expectedMainAxis);
            expect(axis.y.y).toEqual(expectedMainAxis);
            expect(axis.x.y.length).toEqual(axis.y.x.length);
            expect(axis.x.y[0]).toBeNull();
            expect(axis.y.x[0]).toBeNull();
            for (var i = 1; i < axis.x.y.length - 1; ++i) {
                expect(axis.x.y[i]).toEqual(Math.sin(i));
                expect(axis.y.x[i]).toEqual(Math.sin(i));
            }
            expect(axis.x.y[axis.x.y.length - 1]).toBeNull();
            expect(axis.y.x[axis.y.x.length - 1]).toBeNull();
        });
    });
    describe('Beta Sheet', function () {
        it('Should use arrow symbols for drawing beta sheets.', function () {
            var result = new component_1.SecondaryStructureAxis(genSeqEntry('E', 1, 5));
            var lineSymbol = 'line-ne';
            var rightArrow = 'triangle-right';
            var downArrow = 'triangle-down';
            var axis = result.getAxisById('E');
            if (!axis.x.marker.symbol || !axis.y.marker.symbol) {
                fail("Axis symbols must be undefined. X: " + axis.x.marker.symbol + " , y: " + axis.y.marker.symbol);
            }
            else {
                expect(axis.x.marker.symbol).toHaveLength(7);
                expect(axis.x.marker.symbol.length).toEqual(axis.y.marker.symbol.length);
                for (var i = 1; i < axis.x.marker.symbol.length - 2; ++i) {
                    expect(axis.x.marker.symbol[i]).toEqual(lineSymbol);
                    expect(axis.x.marker.symbol[i]).toEqual(lineSymbol);
                }
                expect(axis.x.marker.symbol[5]).toEqual(rightArrow);
                expect(axis.y.marker.symbol[5]).toEqual(downArrow);
            }
        });
    });
});
//# sourceMappingURL=SecondaryStructureAxis.test.js.map