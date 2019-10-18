"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("~bioblocks-viz~/data");
describe('Marker', function () {
    it('Should return an empty color array from an empty state.', function () {
        expect(data_1.Marker.colors.autoColorFromStates([])).toEqual([]);
    });
    it('Should return color-brewer colors for a small set of data.', function () {
        var state = ['ala', 'val'];
        expect(data_1.Marker.colors.autoColorFromStates(state)).toEqual([
            { color: '#66c2a5', name: 'ala' },
            { color: '#fc8d62', name: 'val' },
        ]);
    });
    it('Should sort color-brewer colors when different counts are detected.', function () {
        var state = ['ala', 'ala', 'val'];
        expect(data_1.Marker.colors.autoColorFromStates(state)).toEqual([
            { color: '#66c2a5', name: 'ala' },
            { color: '#66c2a5', name: 'ala' },
            { color: '#fc8d62', name: 'val' },
        ]);
    });
});
//# sourceMappingURL=Marker.test.js.map