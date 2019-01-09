import { applyMiddleware, createStore, Middleware } from 'redux';
import { logger } from 'redux-logger';
import * as thunk from 'redux-thunk';

import { RootReducer } from '~chell-viz~/reducer';

const middleWares: Middleware[] = [thunk.default];
if (process.env.NODE_ENV === `development`) {
  middleWares.push(logger);
}
const configureStore = (initialState = {}) => createStore(RootReducer, initialState, applyMiddleware(...middleWares));

export const Store = configureStore();
