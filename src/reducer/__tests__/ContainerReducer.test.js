"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var reducer_1 = require("~bioblocks-viz~/reducer");
describe('ContainerReducer', function () {
    it('Should handle undefined state.', function () {
        var expectedState = immutable_1.Set();
        var reducer = reducer_1.ContainerReducer('nier');
        expect(reducer(undefined, { type: 'load' })).toMatchObject(expectedState);
    });
    it('Should handle adding elements.', function () {
        var expectedState = immutable_1.Set([4, 2, 42]);
        var reducer = reducer_1.ContainerReducer('indices');
        var state = reducer(undefined, { type: 'BIOBLOCKS/INDICES_ADD', payload: 4 });
        state = reducer(state, { type: 'BIOBLOCKS/INDICES_ADD', payload: 2 });
        state = reducer(state, { type: 'BIOBLOCKS/INDICES_ADD', payload: 42 });
        expect(state).toMatchObject(expectedState);
    });
    it('Should handle adding multiple elements.', function () {
        var expectedState = immutable_1.Set([4, 2, 42]);
        var reducer = reducer_1.ContainerReducer('indices');
        var state = reducer(undefined, { type: 'BIOBLOCKS/INDICES_ADD_MULTIPLE', payload: [4, 2, 42] });
        expect(state).toMatchObject(expectedState);
    });
    it('Should handle clearing elements.', function () {
        var expectedState = immutable_1.Set();
        var reducer = reducer_1.ContainerReducer('indices');
        var state = reducer(undefined, { type: 'BIOBLOCKS/INDICES_SET', payload: [1, 2, 3] });
        expect(state).not.toMatchObject(expectedState);
        expect(reducer(state, { type: 'BIOBLOCKS/INDICES_CLEAR' })).toMatchObject(expectedState);
    });
    it('Should handle removing elements.', function () {
        var expectedState = immutable_1.Set([1, 3]);
        var reducer = reducer_1.ContainerReducer('nier');
        var state = reducer(undefined, { type: 'BIOBLOCKS/NIER_SET', payload: [1, 2, 3] });
        expect(state).not.toMatchObject(expectedState);
        expect(reducer(state, { type: 'BIOBLOCKS/NIER_REMOVE', payload: 2 })).toMatchObject(expectedState);
    });
    it('Should handle removing elements.', function () {
        var expectedState = immutable_1.Set([2]);
        var reducer = reducer_1.ContainerReducer('nier');
        var state = reducer(undefined, { type: 'BIOBLOCKS/NIER_SET', payload: [1, 2, 3] });
        expect(state).not.toMatchObject(expectedState);
        expect(reducer(state, { type: 'BIOBLOCKS/NIER_REMOVE_MULTIPLE', payload: [1, 3] })).toMatchObject(expectedState);
    });
    it('Should handle setting elements.', function () {
        var expectedState = immutable_1.Set([1, 2, 3]);
        var reducer = reducer_1.ContainerReducer('nier');
        var state = reducer(undefined, { type: 'BIOBLOCKS/NIER_SET', payload: [1, 2, 3] });
        expect(state).toMatchObject(expectedState);
        expect(reducer(state, { type: 'BIOBLOCKS/NIER_SET', payload: [4] })).toMatchObject(immutable_1.Set([4]));
    });
});
//# sourceMappingURL=ContainerReducer.test.js.map