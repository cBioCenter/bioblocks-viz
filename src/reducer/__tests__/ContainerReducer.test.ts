import { Set } from 'immutable';

import { ContainerReducer } from '~chell-viz~/reducer';

describe('ContainerReducer', () => {
  it('Should handle undefined state.', () => {
    const expectedState = Set();
    const reducer = ContainerReducer('nier');
    expect(reducer(undefined, { type: 'load' })).toMatchObject(expectedState);
  });

  it('Should handle adding elements.', () => {
    const expectedState = Set<number>([4, 2, 42]);
    const reducer = ContainerReducer('indices');
    let state = reducer(undefined, { type: 'CHELL/INDICES_ADD', payload: 4 });
    state = reducer(state, { type: 'CHELL/INDICES_ADD', payload: 2 });
    state = reducer(state, { type: 'CHELL/INDICES_ADD', payload: 42 });
    expect(state).toMatchObject(expectedState);
  });

  it('Should handle adding multiple elements.', () => {
    const expectedState = Set<number>([4, 2, 42]);
    const reducer = ContainerReducer('indices');
    const state = reducer(undefined, { type: 'CHELL/INDICES_ADD_MULTIPLE', payload: [4, 2, 42] });
    expect(state).toMatchObject(expectedState);
  });

  it('Should handle clearing elements.', () => {
    const expectedState = Set<number>();
    const reducer = ContainerReducer('indices');
    const state = reducer(undefined, { type: 'CHELL/INDICES_SET', payload: [1, 2, 3] });
    expect(state).not.toMatchObject(expectedState);
    expect(reducer(state, { type: 'CHELL/INDICES_CLEAR' })).toMatchObject(expectedState);
  });

  it('Should handle removing elements.', () => {
    const expectedState = Set<number>([1, 3]);
    const reducer = ContainerReducer('nier');
    const state = reducer(undefined, { type: 'CHELL/NIER_SET', payload: [1, 2, 3] });
    expect(state).not.toMatchObject(expectedState);
    expect(reducer(state, { type: 'CHELL/NIER_REMOVE', payload: 2 })).toMatchObject(expectedState);
  });

  it('Should handle removing elements.', () => {
    const expectedState = Set<number>([2]);
    const reducer = ContainerReducer('nier');
    const state = reducer(undefined, { type: 'CHELL/NIER_SET', payload: [1, 2, 3] });
    expect(state).not.toMatchObject(expectedState);
    expect(reducer(state, { type: 'CHELL/NIER_REMOVE_MULTIPLE', payload: [1, 3] })).toMatchObject(expectedState);
  });

  it('Should handle setting elements.', () => {
    const expectedState = Set<number>([1, 2, 3]);
    const reducer = ContainerReducer('nier');
    const state = reducer(undefined, { type: 'CHELL/NIER_SET', payload: [1, 2, 3] });
    expect(state).toMatchObject(expectedState);
    expect(reducer(state, { type: 'CHELL/NIER_SET', payload: [4] })).toMatchObject(Set([4]));
  });
});
