"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var redux_logger_1 = require("redux-logger");
var thunk = require("redux-thunk");
var reducer_1 = require("~bioblocks-viz~/reducer");
var middleWares = [thunk.default];
if (process.env.NODE_ENV === "development") {
    middleWares.push(redux_logger_1.logger);
}
middleWares.push(reducer_1.BioblocksMiddleware);
// TODO define initial non-dynamic state for Bioblocks.
var initialState = {
    visualizations: new Array(),
};
// Preserve initial state for not-yet-loaded reducers
var combine = function (reducers) {
    var reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach(function (item) {
        if (reducerNames.indexOf(item) === -1) {
            reducers[item] = function (state) {
                if (state === void 0) { state = null; }
                return state;
            };
        }
    });
    return redux_1.combineReducers(reducers);
};
var reducer = combine(reducer_1.ReducerRegistry.getReducers());
reducer_1.ReducerRegistry.setChangeListener(function (reducers) {
    exports.BBStore.replaceReducer(combine(reducers));
});
var configureStore = function () {
    return redux_1.createStore(reducer, initialState, redux_1.applyMiddleware.apply(void 0, tslib_1.__spread(middleWares)));
};
exports.BBStore = configureStore();
//# sourceMappingURL=BBStore.js.map