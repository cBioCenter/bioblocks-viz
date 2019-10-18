"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_1 = require("~bioblocks-viz~/action");
describe('ContainerAction', function () {
    it('Should create add actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: 'Heart',
            type: 'BIOBLOCKS/EXAMPLE_ADD',
        };
        expect(action_1.createContainerActions('example').add('Heart')).toEqual(expectedAction);
    });
    it('Should create add multiple actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: ['Earth', 'Wind', 'Fire'],
            type: 'BIOBLOCKS/EXAMPLE_ADD_MULTIPLE',
        };
        expect(action_1.createContainerActions('example').addMultiple(['Earth', 'Wind', 'Fire'])).toEqual(expectedAction);
    });
    it('Should create clear actions.', function () {
        var expectedAction = {
            type: 'BIOBLOCKS/EXAMPLE_CLEAR',
        };
        expect(action_1.createContainerActions('example').clear()).toEqual(expectedAction);
    });
    it('Should create remove actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: 'Heart',
            type: 'BIOBLOCKS/EXAMPLE_REMOVE',
        };
        expect(action_1.createContainerActions('example').remove('Heart')).toEqual(expectedAction);
    });
    it('Should create remove multiple actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: ['Heart', 'Air'],
            type: 'BIOBLOCKS/EXAMPLE_REMOVE_MULTIPLE',
        };
        expect(action_1.createContainerActions('example').removeMultiple(['Heart', 'Air'])).toEqual(expectedAction);
    });
    it('Should create set actions.', function () {
        var expectedAction = {
            meta: 'example',
            payload: ['Fire', 'Wind', 'Earth'],
            type: 'BIOBLOCKS/EXAMPLE_SET',
        };
        expect(action_1.createContainerActions('example').set(['Fire', 'Wind', 'Earth'])).toEqual(expectedAction);
    });
    it('Should use a namespace if provided.', function () {
        var namespace = 'FRATELLIS';
        expect(action_1.createContainerActions('music', namespace).add('Nina').type).toEqual('FRATELLIS/MUSIC_ADD');
        expect(action_1.createContainerActions('music', namespace).addMultiple(['Rosanna', 'Chelsea Dagger']).type).toEqual('FRATELLIS/MUSIC_ADD_MULTIPLE');
        expect(action_1.createContainerActions('music', namespace).clear().type).toEqual('FRATELLIS/MUSIC_CLEAR');
        expect(action_1.createContainerActions('music', namespace).remove("Moriarty's Last Stand").type).toEqual('FRATELLIS/MUSIC_REMOVE');
        expect(action_1.createContainerActions('music', namespace).set(['Laughing Gas', 'I guess... I suppose...']).type).toEqual('FRATELLIS/MUSIC_SET');
    });
});
//# sourceMappingURL=ContainerAction.test.js.map