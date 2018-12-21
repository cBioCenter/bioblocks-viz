import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import { Reducer } from '~chell-viz~/reducer';

export const Store = createStore(Reducer, composeWithDevTools(applyMiddleware(reduxThunk)));
