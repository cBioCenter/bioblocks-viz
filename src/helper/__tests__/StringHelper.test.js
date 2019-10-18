"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("~bioblocks-viz~/helper");
describe('String Helper', function () {
    it('Should transform a string such that only the first letter is capitalized.', function () {
        var expected = 'Abc';
        expect(helper_1.capitalizeFirstLetter('abc')).toEqual(expected);
        expect(helper_1.capitalizeFirstLetter('abC')).toEqual(expected);
        expect(helper_1.capitalizeFirstLetter('aBc')).toEqual(expected);
        expect(helper_1.capitalizeFirstLetter('aBC')).toEqual(expected);
        expect(helper_1.capitalizeFirstLetter('Abc')).toEqual(expected);
        expect(helper_1.capitalizeFirstLetter('AbC')).toEqual(expected);
        expect(helper_1.capitalizeFirstLetter('ABc')).toEqual(expected);
        expect(helper_1.capitalizeFirstLetter('ABC')).toEqual(expected);
    });
});
//# sourceMappingURL=StringHelper.test.js.map