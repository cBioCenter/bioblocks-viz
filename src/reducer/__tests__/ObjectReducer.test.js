"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var reducer_1 = require("~bioblocks-viz~/reducer");
describe('ObjectReducer', function () {
    it('Should handle an empty state.', function () {
        var expectedState = immutable_1.Map();
        var reducer = reducer_1.ObjectReducer('test');
        var state = reducer(undefined, { type: '' });
        expect(reducer(state, { type: 'BIOBLOCKS/DATE_CLEAR' })).toEqual(expectedState);
    });
    it('Should handle adding a new field.', function () {
        var expectedState = immutable_1.Map({ key1: 'first key', key2: 'second key' });
        var reducer = reducer_1.ObjectReducer('test');
        var state = reducer(undefined, {
            payload: { key1: 'first key' },
            type: 'BIOBLOCKS/TEST_SET',
        });
        expect(state).not.toEqual(expectedState);
        state = reducer(state, {
            payload: { key2: 'second key' },
            type: 'BIOBLOCKS/TEST_ADD',
        });
        expect(state).toEqual(expectedState);
    });
    it('Should handle clearing all fields on the object.', function () {
        var expectedState = immutable_1.Map({});
        var reducer = reducer_1.ObjectReducer('test');
        var state = reducer(undefined, {
            payload: { key1: 'first key', key2: 'second key', key3: 'third key' },
            type: 'BIOBLOCKS/TEST_SET',
        });
        expect(state).not.toEqual(expectedState);
        state = reducer(state, {
            type: 'BIOBLOCKS/TEST_CLEAR',
        });
        expect(state).toEqual(expectedState);
    });
    it('Should handle removing a single field on the object.', function () {
        var expectedState = immutable_1.Map({ key1: 'first key', key2: 'second key' });
        var reducer = reducer_1.ObjectReducer('test');
        var state = reducer(undefined, {
            payload: { key1: 'first key', key2: 'second key', key3: 'third key' },
            type: 'BIOBLOCKS/TEST_SET',
        });
        expect(state).not.toEqual(expectedState);
        state = reducer(state, {
            payload: 'key3',
            type: 'BIOBLOCKS/TEST_REMOVE',
        });
        expect(state).toEqual(expectedState);
    });
    it('Should handle removing multiple fields on the object.', function () {
        var expectedState = immutable_1.Map({ key2: 'second key' });
        var reducer = reducer_1.ObjectReducer('test');
        var state = reducer(undefined, {
            payload: { key1: 'first key', key2: 'second key', key3: 'third key' },
            type: 'BIOBLOCKS/TEST_SET',
        });
        expect(state).not.toEqual(expectedState);
        state = reducer(state, {
            payload: ['key1', 'key3'],
            type: 'BIOBLOCKS/TEST_REMOVE_MULTIPLE',
        });
        expect(state).toEqual(expectedState);
    });
    it('Should handle setting a field on the object.', function () {
        var expectedState = immutable_1.Map({ newKey: 'newValue' });
        var reducer = reducer_1.ObjectReducer('test');
        var state = reducer(undefined, { type: 'BIOBLOCKS/TEST_SET', payload: { oldKey: 'oldValue' } });
        expect(state).not.toEqual(expectedState);
        state = reducer(state, { type: 'BIOBLOCKS/TEST_SET', payload: { newKey: 'newValue' } });
        expect(state).toEqual(expectedState);
    });
    it('Should allow creating a namespaced value reducer.', function () {
        expect(reducer_1.ReducerRegistry.getReducers()).not.toHaveProperty('queen/album');
        reducer_1.createObjectReducer('album', 'queen');
        expect(reducer_1.ReducerRegistry.getReducers()).toHaveProperty('queen/album');
    });
});
//# sourceMappingURL=ObjectReducer.test.js.map