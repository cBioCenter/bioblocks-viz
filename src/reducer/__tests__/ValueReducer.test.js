"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reducer_1 = require("~bioblocks-viz~/reducer");
describe('ValueReducer', function () {
    it('Should handle clearing the value.', function () {
        var expectedState = null;
        var reducer = reducer_1.ValueReducer('date', null);
        var state = reducer(undefined, { type: 'BIOBLOCKS/DATE_CLEAR' });
        expect(reducer(state, { type: 'BIOBLOCKS/DATE_CLEAR' })).toEqual(expectedState);
    });
    it('Should handle setting a value.', function () {
        var expectedState = 'Today';
        var reducer = reducer_1.ValueReducer('date', '');
        var state = reducer(undefined, { type: 'BIOBLOCKS/DATE_SET', payload: 'Today' });
        expect(state).toEqual(expectedState);
    });
    it('Should allow creating a namespaced value reducer.', function () {
        expect(reducer_1.ReducerRegistry.getReducers()).not.toHaveProperty('queen/album');
        reducer_1.createValueReducer('album', null, 'queen');
        expect(reducer_1.ReducerRegistry.getReducers()).toHaveProperty('queen/album');
    });
});
//# sourceMappingURL=ValueReducer.test.js.map