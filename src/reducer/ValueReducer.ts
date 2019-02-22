import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
// tslint:disable-next-line:no-submodule-imports
import { PayloadAction } from 'typesafe-actions/dist/types';

import { createValueActions } from '~bioblocks-viz~/action';
import { ReducerRegistry } from '~bioblocks-viz~/reducer';

export type IValueReducerState<T> = T | null;

export const ValueReducer = <T>(dataset: string, namespace = 'bioblocks'): Reducer => {
  const actions = createValueActions<T>(dataset, namespace);

  const initialState = null;

  return (state: IValueReducerState<T> = initialState, action: ActionType<typeof actions>): IValueReducerState<T> => {
    switch (action.type) {
      case getType(actions.clear):
        return null;
      case getType(actions.set): {
        return (action as PayloadAction<string, T>).payload;
      }
      default:
        return state;
    }
  };
};

export const createValueReducer = <T>(dataset: string, namespace = 'bioblocks') => {
  const reducer = ValueReducer<T>(dataset, namespace);
  const reducerName = `${namespace}/${dataset}`;
  ReducerRegistry.register(reducerName, reducer);
};
