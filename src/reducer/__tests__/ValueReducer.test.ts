import { createValueReducer, ReducerRegistry, ValueReducer } from '~bioblocks-viz~/reducer';

describe('ValueReducer', () => {
  it('Should handle clearing the value.', () => {
    const expectedState = null;
    const reducer = ValueReducer('date');
    const state = reducer(undefined, { type: 'BIOBLOCKS/DATE_CLEAR' });
    expect(reducer(state, { type: 'BIOBLOCKS/DATE_CLEAR' })).toEqual(expectedState);
  });

  it('Should handle setting a value.', () => {
    const expectedState = 'Today';
    const reducer = ValueReducer('date');
    const state = reducer(undefined, { type: 'BIOBLOCKS/DATE_SET', payload: 'Today' });
    expect(state).toEqual(expectedState);
  });

  it('Should allow creating a namespaced value reducer.', () => {
    expect(ReducerRegistry.getReducers()).not.toHaveProperty('queen/album');
    createValueReducer('album', 'queen');
    expect(ReducerRegistry.getReducers()).toHaveProperty('queen/album');
  });
});
