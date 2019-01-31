import { Map } from 'immutable';

import { createObjectReducer, ObjectReducer, ReducerRegistry } from '~chell-viz~/reducer';

describe('ObjectReducer', () => {
  it('Should handle an empty state.', () => {
    const expectedState = Map();
    const reducer = ObjectReducer('test');
    const state = reducer(undefined, { type: '' });
    expect(reducer(state, { type: 'CHELL/DATE_CLEAR' })).toEqual(expectedState);
  });

  it('Should handle adding a new field.', () => {
    const expectedState = Map({ key1: 'first key', key2: 'second key' });
    const reducer = ObjectReducer('test');
    let state = reducer(undefined, {
      payload: { key1: 'first key' },
      type: 'CHELL/TEST_SET',
    });
    expect(state).not.toEqual(expectedState);
    state = reducer(state, {
      payload: { key2: 'second key' },
      type: 'CHELL/TEST_ADD',
    });
    expect(state).toEqual(expectedState);
  });

  it('Should handle clearing all fields on the object.', () => {
    const expectedState = Map({});
    const reducer = ObjectReducer('test');
    let state = reducer(undefined, {
      payload: { key1: 'first key', key2: 'second key', key3: 'third key' },
      type: 'CHELL/TEST_SET',
    });
    expect(state).not.toEqual(expectedState);
    state = reducer(state, {
      type: 'CHELL/TEST_CLEAR',
    });
    expect(state).toEqual(expectedState);
  });

  it('Should handle removing a single field on the object.', () => {
    const expectedState = Map({ key1: 'first key', key2: 'second key' });
    const reducer = ObjectReducer('test');
    let state = reducer(undefined, {
      payload: { key1: 'first key', key2: 'second key', key3: 'third key' },
      type: 'CHELL/TEST_SET',
    });
    expect(state).not.toEqual(expectedState);
    state = reducer(state, {
      payload: 'key3',
      type: 'CHELL/TEST_REMOVE',
    });
    expect(state).toEqual(expectedState);
  });

  it('Should handle removing multiple fields on the object.', () => {
    const expectedState = Map({ key2: 'second key' });
    const reducer = ObjectReducer('test');
    let state = reducer(undefined, {
      payload: { key1: 'first key', key2: 'second key', key3: 'third key' },
      type: 'CHELL/TEST_SET',
    });
    expect(state).not.toEqual(expectedState);
    state = reducer(state, {
      payload: ['key1', 'key3'],
      type: 'CHELL/TEST_REMOVE_MULTIPLE',
    });
    expect(state).toEqual(expectedState);
  });

  it('Should handle setting a field on the object.', () => {
    const expectedState = Map({ newKey: 'newValue' });
    const reducer = ObjectReducer('test');
    let state = reducer(undefined, { type: 'CHELL/TEST_SET', payload: { oldKey: 'oldValue' } });
    expect(state).not.toEqual(expectedState);
    state = reducer(state, { type: 'CHELL/TEST_SET', payload: { newKey: 'newValue' } });
    expect(state).toEqual(expectedState);
  });

  it('Should allow creating a namespaced value reducer.', () => {
    expect(ReducerRegistry.getReducers()).not.toHaveProperty('queen/album');
    createObjectReducer('album', 'queen');
    expect(ReducerRegistry.getReducers()).toHaveProperty('queen/album');
  });
});
