import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import { LabelActionType } from '~chell-viz~/action';
import { LabelReducer } from '~chell-viz~/reducer';

export const RootReducer = combineReducers({
  label: LabelReducer,
});

export type RootState = StateType<typeof RootReducer>;
export type RootAction = LabelActionType;
