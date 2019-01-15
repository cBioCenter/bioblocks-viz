import { LABELED_CELL_REDUCER_NAME, LabeledCellsState, RootState } from '~chell-viz~/reducer';

export const selectCurrentCells = (state: RootState) =>
  (state[LABELED_CELL_REDUCER_NAME] as LabeledCellsState).currentCells;

export const selectCurrentSpecies = (state: RootState) =>
  (state[LABELED_CELL_REDUCER_NAME] as LabeledCellsState).species;
