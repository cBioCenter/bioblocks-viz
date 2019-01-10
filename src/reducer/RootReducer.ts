import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import { LabeledCellsActionType } from '~chell-viz~/action';
import { LabeledCellsReducer } from '~chell-viz~/reducer';

export const RootReducer = combineReducers({
  labeledCells: LabeledCellsReducer,
});

export type RootState = StateType<typeof RootReducer>;
export type RootAction = LabeledCellsActionType;
