import { Set } from 'immutable';
import { ActionType, getType } from 'typesafe-actions';
// tslint:disable-next-line:no-submodule-imports
import { PayloadAction } from 'typesafe-actions/dist/types';

import { createContainerActions } from '~chell-viz~/action';
import { ReducerRegistry } from '~chell-viz~/reducer';

export interface IContainerReducerState<T> {
  items: Set<T>;
}

export const ContainerReducer = <T>(dataSubscription: string, namespace = 'chell'): IContainerReducerState<T> => {
  console.log(dataSubscription);
  console.log(namespace);
  const actions = createContainerActions<T>(dataSubscription, namespace);

  const initialState: IContainerReducerState<T> = {
    items: Set<T>(),
  };

  const reducer = (state = initialState, action: ActionType<typeof actions>): IContainerReducerState<T> => {
    switch (action.type) {
      case getType(actions.add): {
        const payload = (action as PayloadAction<string, T>).payload;

        return {
          ...state,
          items: state.items.contains(payload) ? state.items.remove(payload) : state.items.add(payload),
        };
      }
      case getType(actions.clear):
        return {
          ...state,
          items: Set<T>(),
        };
      case getType(actions.remove): {
        const payload = (action as PayloadAction<string, T>).payload;

        return {
          ...state,
          items: state.items.remove(payload),
        };
      }
      case getType(actions.set): {
        const payload = (action as PayloadAction<string, T[]>).payload;

        return {
          ...state,
          items: Set<T>(payload),
        };
      }
      default:
        return state;
    }
  };
  const reducerName = `${namespace}/${dataSubscription}`;
  ReducerRegistry.register(reducerName, reducer);

  return initialState;
};

export const createContainerReducer = ContainerReducer;
