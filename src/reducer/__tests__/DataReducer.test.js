"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reducer_1 = require("~bioblocks-viz~/reducer");
describe('DataReducer', function () {
    it('Should handle undefined state.', function () {
        var expectedState = '';
        var reducer = reducer_1.DataReducer('nier', '');
        expect(reducer(undefined, { type: 'load' })).toEqual(expectedState);
    });
    it('Should handle adding elements.', function () {
        var expectedState = 4;
        var reducer = reducer_1.DataReducer('indices', '');
        var state = reducer(undefined, { type: 'BIOBLOCKS/INDICES_FETCH_DATA_SUCCESS', payload: 4 });
        expect(state).toEqual(expectedState);
    });
    it('Should handle adding multiple elements.', function () {
        var expectedState = null;
        var reducer = reducer_1.DataReducer('indices', null);
        var state = reducer(undefined, { type: 'BIOBLOCKS/INDICES_FETCH_DATA_FAILURE' });
        expect(state).toEqual(expectedState);
    });
    it('Should allow creating a DataReducer.', function () {
        expect(reducer_1.ReducerRegistry.getReducers()).not.toHaveProperty('ludo/horror');
        reducer_1.createDataReducer('horror', '', 'ludo');
        expect(reducer_1.ReducerRegistry.getReducers()).toHaveProperty('ludo/horror');
    });
});
//# sourceMappingURL=DataReducer.test.js.map