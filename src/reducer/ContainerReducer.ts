import { Set } from 'immutable';
import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
// tslint:disable-next-line:no-submodule-imports
import { PayloadAction } from 'typesafe-actions/dist/types';

import { createContainerActions } from '~bioblocks-viz~/action';
import { ReducerRegistry } from '~bioblocks-viz~/reducer';

export type IContainerReducerState<T> = Set<T>;

export const ContainerReducer = <T>(dataset: string, namespace = 'bioblocks'): Reducer => {
  const actions = createContainerActions<T>(dataset, namespace);

  const initialState = Set<T>();

  return (
    state: IContainerReducerState<T> = initialState,
    action: ActionType<typeof actions>,
  ): IContainerReducerState<T> => {
    switch (action.type) {
      case getType(actions.add): {
        const payload = (action as PayloadAction<string, T>).payload;

        return state.add(payload);
      }
      case getType(actions.addMultiple): {
        const payload = (action as PayloadAction<string, T[]>).payload;

        return payload.reduce((prev, cur) => prev.add(cur), state);
      }
      case getType(actions.clear):
        return Set<T>();
      case getType(actions.remove): {
        const payload = (action as PayloadAction<string, T>).payload;

        return state.remove(payload);
      }
      case getType(actions.removeMultiple): {
        const payload = (action as PayloadAction<string, T[]>).payload;

        return payload.reduce((prev, cur) => prev.remove(cur), state);
      }
      case getType(actions.set): {
        const payload = (action as PayloadAction<string, T[]>).payload;

        return Set<T>(payload);
      }
      default:
        return state;
    }
  };
};

export const createContainerReducer = <T>(dataset: string, namespace = 'bioblocks') => {
  const reducer = ContainerReducer<T>(dataset, namespace);
  const reducerName = `${namespace}/${dataset}`;
  ReducerRegistry.register(reducerName, reducer);
};
