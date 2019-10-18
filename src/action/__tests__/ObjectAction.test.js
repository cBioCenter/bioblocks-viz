"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_1 = require("~bioblocks-viz~/action");
describe('ObjectAction', function () {
    it('Should create add actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: { element: 'earth' },
            type: 'BIOBLOCKS/EXAMPLE_ADD',
        };
        expect(action_1.createObjectActions('example').add({ element: 'earth' })).toEqual(expectedAction);
    });
    it('Should create clear actions.', function () {
        var expectedAction = {
            type: 'BIOBLOCKS/EXAMPLE_CLEAR',
        };
        expect(action_1.createObjectActions('example').clear()).toEqual(expectedAction);
    });
    it('Should create remove actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: 'element',
            type: 'BIOBLOCKS/EXAMPLE_REMOVE',
        };
        expect(action_1.createObjectActions('example').remove('element')).toEqual(expectedAction);
    });
    it('Should create remove multiple actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: ['earth', 'wind'],
            type: 'BIOBLOCKS/EXAMPLE_REMOVE_MULTIPLE',
        };
        expect(action_1.createObjectActions('example').removeMultiple(['earth', 'wind'])).toEqual(expectedAction);
    });
    it('Should create set actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: { element: 'fire' },
            type: 'BIOBLOCKS/EXAMPLE_SET',
        };
        expect(action_1.createObjectActions('example').set({ element: 'fire' })).toEqual(expectedAction);
    });
    it('Should use a namespace if provided.', function () {
        var namespace = 'FRATELLIS';
        expect(action_1.createObjectActions('music', namespace).clear().type).toEqual('FRATELLIS/MUSIC_CLEAR');
        expect(action_1.createObjectActions('music', namespace).set({ best: 'Z Movie Saga' }).type).toEqual('FRATELLIS/MUSIC_SET');
    });
});
//# sourceMappingURL=ObjectAction.test.js.map