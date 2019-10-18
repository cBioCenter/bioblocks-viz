"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_1 = require("~bioblocks-viz~/action");
describe('ValueAction', function () {
    it('Should create clear actions.', function () {
        var expectedAction = {
            type: 'BIOBLOCKS/EXAMPLE_CLEAR',
        };
        expect(action_1.createValueActions('example').clear()).toEqual(expectedAction);
    });
    it('Should create set actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: ['Earth', 'Wind', 'Fire'],
            type: 'BIOBLOCKS/EXAMPLE_SET',
        };
        expect(action_1.createValueActions('example').set(['Earth', 'Wind', 'Fire'])).toEqual(expectedAction);
    });
    it('Should use a namespace if provided.', function () {
        var namespace = 'FRATELLIS';
        expect(action_1.createValueActions('music', namespace).clear().type).toEqual('FRATELLIS/MUSIC_CLEAR');
        expect(action_1.createValueActions('music', namespace).set(['Rosanna', 'Chelsea Dagger']).type).toEqual('FRATELLIS/MUSIC_SET');
    });
});
//# sourceMappingURL=ValueAction.test.js.map