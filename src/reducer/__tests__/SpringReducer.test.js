"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reducer_1 = require("~bioblocks-viz~/reducer");
describe('SpringReducer', function () {
    it('Should handle undefined state.', function () {
        var expectedState = {
            category: '',
            graphData: { nodes: [] },
        };
        var reducer = reducer_1.SpringReducer();
        expect(reducer(undefined, { type: 'load' })).toMatchObject(expectedState);
    });
    it('Should allow creating a namespaced spring reducer.', function () {
        expect(reducer_1.ReducerRegistry.getReducers()).not.toHaveProperty('nirvana/spring');
        reducer_1.createSpringReducer('nirvana');
        expect(reducer_1.ReducerRegistry.getReducers()).toHaveProperty('nirvana/spring');
    });
});
//# sourceMappingURL=SpringReducer.test.js.map