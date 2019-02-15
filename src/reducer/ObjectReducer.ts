import { Map } from 'immutable';
import { Reducer } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
// tslint:disable-next-line:no-submodule-imports
import { PayloadAction } from 'typesafe-actions/dist/types';

import { createObjectActions } from '~bioblocks-viz~/action';
import { ReducerRegistry } from '~bioblocks-viz~/reducer';

export type IObjectReducerState<T> = Map<string, T>;

export const ObjectReducer = <T>(dataset: string, namespace = 'bioblocks'): Reducer => {
  const actions = createObjectActions<T>(dataset, namespace);

  const initialState = Map<string, T>();

  return (state: IObjectReducerState<T> = initialState, action: ActionType<typeof actions>): IObjectReducerState<T> => {
    switch (action.type) {
      case getType(actions.add): {
        const payload = (action as PayloadAction<string, Map<string, T>>).payload;

        return state.merge(payload);
      }
      case getType(actions.clear):
        return Map<string, T>();
      case getType(actions.remove): {
        const payload = (action as PayloadAction<string, string>).payload;

        return state.remove(payload);
      }
      case getType(actions.removeMultiple): {
        const payload = (action as PayloadAction<string, string[]>).payload;

        return payload.reduce((prev, cur) => prev.remove(cur), state);
      }
      case getType(actions.set): {
        const payload = (action as PayloadAction<string, Map<string, T>>).payload;

        return Map<string, T>(payload);
      }
      case getType(actions.toggle): {
        const payload = (action as PayloadAction<string, { [key: string]: T }>).payload;

        let result = state;
        Object.keys(payload).forEach(key => {
          result = state.has(key) ? state.remove(key) : state.set(key, payload[key]);
        });

        return result;
      }
      default:
        return state;
    }
  };
};

export const createObjectReducer = <T>(dataset: string, namespace = 'bioblocks') => {
  const reducer = ObjectReducer<T>(dataset, namespace);
  const reducerName = `${namespace}/${dataset}`;
  ReducerRegistry.register(reducerName, reducer);
};
