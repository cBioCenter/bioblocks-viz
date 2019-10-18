"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var selector_1 = require("~bioblocks-viz~/selector");
describe('ObjectSelector', function () {
    it('Should return an empty Map if the state does not exist.', function () {
        var expectedState = immutable_1.Map();
        expect(selector_1.selectObject(undefined, 'back')).toMatchObject(expectedState);
    });
    it('Should select the state correctly if it exists.', function () {
        var _a;
        var expectedState = immutable_1.Map({ need: 'medicine' });
        expect(selector_1.selectObject((_a = {}, _a['bioblocks/what'] = immutable_1.Map({ need: 'medicine' }), _a), 'what')).toMatchObject(expectedState);
    });
});
//# sourceMappingURL=ObjectSelectors.test.js.map