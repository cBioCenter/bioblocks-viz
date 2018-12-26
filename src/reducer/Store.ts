import { createStore } from 'redux';

import { RootReducer } from '~chell-viz~/reducer';

const configureStore = (initialState = {}) => createStore(RootReducer, initialState);

export const Store = configureStore();
