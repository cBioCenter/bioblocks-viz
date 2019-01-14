import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux';
import { logger } from 'redux-logger';
import * as thunk from 'redux-thunk';

import { IReducerMap, ReducerRegistry, RootState } from '~chell-viz~/reducer';

const middleWares: Middleware[] = [thunk.default];
if (process.env.NODE_ENV === `development`) {
  middleWares.push(logger);
}

const initialState = {};

// Preserve initial state for not-yet-loaded reducers
const combine = (reducers: IReducerMap) => {
  const reducerNames = Object.keys(reducers);
  Object.keys(initialState).forEach(item => {
    if (reducerNames.indexOf(item) === -1) {
      reducers[item] = (state: RootState | null = null) => state;
    }
  });

  return combineReducers(reducers);
};

const reducer = combine(ReducerRegistry.getReducers());

ReducerRegistry.setChangeListener((reducers: IReducerMap) => {
  Store.replaceReducer(combine(reducers));
});

const configureStore = () => createStore(reducer, initialState, applyMiddleware(...middleWares));

export const Store = configureStore();
