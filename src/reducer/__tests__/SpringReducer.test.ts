import { createSpringReducer, ReducerRegistry, SpringReducer } from '~bioblocks-viz~/reducer';

describe('SpringReducer', () => {
  it('Should handle undefined state.', () => {
    const expectedState = {
      category: '',
      graphData: { nodes: [] },
    };
    const reducer = SpringReducer();
    expect(reducer(undefined, { type: 'load' })).toMatchObject(expectedState);
  });

  it('Should allow creating a namespaced spring reducer.', () => {
    expect(ReducerRegistry.getReducers()).not.toHaveProperty('nirvana/spring');
    createSpringReducer('nirvana');
    expect(ReducerRegistry.getReducers()).toHaveProperty('nirvana/spring');
  });
});
