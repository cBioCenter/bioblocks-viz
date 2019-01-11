import { ActionType, createAsyncAction, createStandardAction } from 'typesafe-actions';

import { Dispatch } from 'redux';
import { ISpringGraphData, SPECIES_TYPE } from '~chell-viz~/data';
import { fetchSpringData } from '~chell-viz~/helper';

const springFetchActions = createAsyncAction(
  'FETCH_SPRING_DATA_REQUEST',
  'FETCH_SPRING_DATA_SUCCESS',
  'FETCH_SPRING_DATA_FAILURE',
)<void, ISpringGraphData, Error>();

export const LabeledCellsActions = {
  addLabel: createStandardAction('ADD_LABEL')<string>(),
  setCurrentCells: createStandardAction('SET_SELECTED_CELLS')<number[]>(),
  setCurrentCellsAndCategory: createStandardAction('SET_SELECTED_CELLS_AND_CATEGORY')<{
    cells: number[];
    category: string;
  }>(),
  setSpecies: createStandardAction('SET_SPECIES')<SPECIES_TYPE>(),
  springData: { ...springFetchActions },
};

export const fetchLabeledSpringData = (datasetLocation: string) => async (dispatch: Dispatch) => {
  // First dispatch: the app state is updated to inform
  // that the API call is starting.
  dispatch(springFetchActions.request());

  // The function called by the thunk middleware can return a value,
  // that is passed on as the return value of the dispatch method.

  // In this case, we return a promise to wait for.
  // This is not required by thunk middleware, but it is convenient for us.
  try {
    const springData = await fetchSpringData(`assets/datasets/${datasetLocation}`);
    dispatch(springFetchActions.success(springData));
  } catch (e) {
    dispatch(springFetchActions.failure(e as Error));
    console.log(`An error occurred: ${e}`);
  }
};

export type LabeledCellsActionType = ActionType<typeof LabeledCellsActions>;
