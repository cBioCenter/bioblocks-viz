import { createStore } from 'redux';

import { rootReducer } from '~chell-viz~/reducer';

const configureStore = (initialState = {}) => createStore(rootReducer, initialState);

export const Store = configureStore();
