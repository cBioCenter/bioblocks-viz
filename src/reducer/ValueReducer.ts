// ~bb-viz~
// Value Reducer
// Reducer for a primitive JavaScript value.
// ~bb-viz~

import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
// tslint:disable-next-line:no-submodule-imports
import { PayloadAction } from 'typesafe-actions/dist/types';

import { createValueActions } from '~bioblocks-viz~/action';
import { ReducerRegistry } from '~bioblocks-viz~/reducer';

export type IValueReducerState<T> = T;

export const ValueReducer = <T>(dataset: string, initialState: T, namespace = 'bioblocks'): Reducer => {
  const actions = createValueActions<T>(dataset, namespace);

  return (state: IValueReducerState<T> = initialState, action: ActionType<typeof actions>): IValueReducerState<T> => {
    switch (action.type) {
      case getType(actions.clear):
        return initialState;
      case getType(actions.set): {
        return (action as PayloadAction<string, T>).payload;
      }
      default:
        return state;
    }
  };
};

export const createValueReducer = <T>(dataset: string, initialState: T, namespace = 'bioblocks') => {
  const reducer = ValueReducer<T>(dataset, initialState, namespace);
  const reducerName = `${namespace}/${dataset}`;
  ReducerRegistry.register(reducerName, reducer);
};
