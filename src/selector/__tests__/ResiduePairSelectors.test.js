"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var selector_1 = require("~bioblocks-viz~/selector");
describe('ResiduePairSelectors', function () {
    it('Should create a new residuePair state if one does not exist.', function () {
        var expectedState = {
            candidates: immutable_1.Set(),
            hovered: immutable_1.Set(),
            locked: immutable_1.Map(),
        };
        var state = {};
        expect(selector_1.getResiduePairs(state)).toMatchObject(expectedState);
        expect(selector_1.getCandidates(state)).toMatchObject(expectedState.candidates);
        expect(selector_1.getHovered(state)).toMatchObject(expectedState.hovered);
        expect(selector_1.getLocked(state)).toMatchObject(expectedState.locked);
    });
    it('Should select the residuePair state if one already exist.', function () {
        var _a;
        var expectedState = {
            candidates: immutable_1.Set([4, 2, 42]),
            hovered: immutable_1.Set([7, 13]),
            locked: immutable_1.Map([{ '1,3': [1, 3] }]),
        };
        var state = (_a = {},
            _a['bioblocks/residuePair'] = {
                candidates: immutable_1.Set([4, 2, 42]),
                hovered: immutable_1.Set([7, 13]),
                locked: immutable_1.Map([{ '1,3': [1, 3] }]),
            },
            _a);
        expect(selector_1.getResiduePairs(state)).toMatchObject(expectedState);
        expect(selector_1.getCandidates(state)).toMatchObject(expectedState.candidates);
        expect(selector_1.getHovered(state)).toMatchObject(expectedState.hovered);
        expect(selector_1.getLocked(state)).toMatchObject(expectedState.locked);
    });
});
//# sourceMappingURL=ResiduePairSelectors.test.js.map