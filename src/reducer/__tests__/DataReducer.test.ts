import { createDataReducer, DataReducer, ReducerRegistry } from '~chell-viz~/reducer';

describe('DataReducer', () => {
  it('Should handle undefined state.', () => {
    const expectedState = null;
    const reducer = DataReducer('nier');
    expect(reducer(undefined, { type: 'load' })).toEqual(expectedState);
  });

  it('Should handle adding elements.', () => {
    const expectedState = 4;
    const reducer = DataReducer('indices');
    const state = reducer(undefined, { type: 'CHELL/INDICES_FETCH_DATA_SUCCESS', payload: 4 });
    expect(state).toEqual(expectedState);
  });

  it('Should handle adding multiple elements.', () => {
    const expectedState = null;
    const reducer = DataReducer('indices');
    const state = reducer(undefined, { type: 'CHELL/INDICES_FETCH_DATA_FAILURE' });
    expect(state).toEqual(expectedState);
  });

  it('Should allow creating a DataReducer', () => {
    expect(ReducerRegistry.getReducers()).not.toHaveProperty('ludo/horror');
    createDataReducer('horror', 'ludo');
    expect(ReducerRegistry.getReducers()).toHaveProperty('ludo/horror');
  });
});
