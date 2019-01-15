import { Set } from 'immutable';

import { ActionType, getType } from 'typesafe-actions';
import { createToggleableActions } from '~chell-viz~/action';
import { ReducerRegistry } from '~chell-viz~/reducer';

export function ToggleableReducer<T>(reducerName: string) {
  const actions = createToggleableActions<T>();

  const initialState = {
    items: Set<T>(),
  };

  type ToggleableState = typeof initialState;

  const reducer = (state = initialState, action: ActionType<typeof actions>): ToggleableState => {
    switch (action.type) {
      case getType(actions.add):
        return {
          ...state,
          items: state.items.contains(action.payload)
            ? state.items.remove(action.payload)
            : state.items.add(action.payload),
        };
      case getType(actions.clear):
        return {
          ...state,
          items: Set<T>(),
        };
      case getType(actions.remove):
        return {
          ...state,
          items: state.items.remove(action.payload),
        };
      case getType(actions.set):
        return {
          ...state,
          items: Set<T>(action.payload),
        };
      default:
        return state;
    }
  };
  ReducerRegistry.register(reducerName, reducer);
}
