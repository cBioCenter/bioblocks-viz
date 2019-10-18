"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var selector_1 = require("~bioblocks-viz~/selector");
describe('ContainerSelector', function () {
    it('Should return an empty Set if the state does not exist.', function () {
        var expectedState = immutable_1.Set();
        expect(selector_1.selectCurrentItems(undefined, 'back')).toMatchObject(expectedState);
    });
    it('Should select the state correctly if it exists.', function () {
        var _a;
        var expectedState = immutable_1.Set([1, 2, 3]);
        expect(selector_1.selectCurrentItems((_a = {}, _a['bioblocks/forward'] = immutable_1.Set([1, 2, 3]), _a), 'forward')).toMatchObject(expectedState);
    });
});
//# sourceMappingURL=ContainerSelectors.test.js.map