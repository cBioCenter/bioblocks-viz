"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selector_1 = require("~bioblocks-viz~/selector");
describe('ValueSelector', function () {
    it('Should return an empty value if the state does not exist.', function () {
        expect(selector_1.selectCurrentValue(undefined, 'back')).toBeNull();
    });
    it('Should select the state correctly if it exists.', function () {
        var _a;
        var spyFn = jest.fn();
        var state = (_a = {},
            _a['bioblocks/bool'] = true,
            _a['bioblocks/function'] = spyFn,
            _a['bioblocks/number'] = 42,
            _a['bioblocks/object'] = { key: 'value' },
            _a['bioblocks/string'] = 'true',
            _a);
        expect(selector_1.selectCurrentValue(state, 'bool')).toEqual(true);
        expect(selector_1.selectCurrentValue(state, 'function')).toEqual(spyFn);
        expect(selector_1.selectCurrentValue(state, 'number')).toEqual(42);
        expect(selector_1.selectCurrentValue(state, 'object')).toEqual({ key: 'value' });
        expect(selector_1.selectCurrentValue(state, 'string')).toEqual('true');
    });
});
//# sourceMappingURL=ValueSelectors.test.js.map