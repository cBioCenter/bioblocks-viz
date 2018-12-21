import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import { LabelAction } from '~chell-viz~/action';
import { LabelReducer } from '~chell-viz~/reducer';

export const rootReducer = combineReducers({
  label: LabelReducer,
});

export type RootState = StateType<typeof rootReducer>;
export type RootAction = LabelAction;
