import { Set } from 'immutable';
import { LabeledCellsReducer } from '~chell-viz~/reducer';

describe('LabeledCellsReducer', () => {
  it('Should return the initial state when fetching SPRING data.', () => {
    const initialState = {
      categories: Set<string>(),
      currentCells: Set<number>(),
      graphData: { nodes: [] },
      labelsByCategory: new Map<string, Set<string>>(),
      selectedLabels: Set<string>(['']),
      species: 'homo_sapiens',
    };

    expect(LabeledCellsReducer(undefined, { type: 'FETCH_SPRING_DATA_REQUEST' })).toEqual(initialState);
  });

  it('Should handle adding labels with no matching cells.', () => {
    const expectedState = {
      currentCells: Set<number>(),
      selectedLabels: Set<string>(['heart']),
    };

    expect(LabeledCellsReducer(undefined, { type: 'ADD_LABEL', payload: 'heart' })).toMatchObject(expectedState);
  });

  it('Should handle adding labels with matching cells.', () => {
    const expectedState = {
      currentCells: Set<number>(),
      selectedLabels: Set<string>(['P11A']),
    };

    expect(LabeledCellsReducer(undefined, { type: 'ADD_LABEL', payload: 'P11A' })).toMatchObject(expectedState);
  });

  it('Should handle setting cells.', () => {
    const expectedState = {
      currentCells: Set<number>([1, 2, 3]),
    };

    expect(LabeledCellsReducer(undefined, { type: 'SET_SELECTED_CELLS', payload: [1, 2, 3] })).toMatchObject(
      expectedState,
    );
  });
});
