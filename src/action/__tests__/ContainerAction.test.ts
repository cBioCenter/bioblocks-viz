import { createContainerActions } from '~chell-viz~/action';

describe('ContainerAction', () => {
  it('Should create add actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: 'Heart',
      type: 'CHELL/EXAMPLE_ADD',
    };
    expect(createContainerActions('example').add('Heart')).toEqual(expectedAction);
  });

  it('Should create add multiple actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: ['Earth', 'Wind', 'Fire'],
      type: 'CHELL/EXAMPLE_ADD_MULTIPLE',
    };
    expect(createContainerActions('example').addMultiple(['Earth', 'Wind', 'Fire'])).toEqual(expectedAction);
  });

  it('Should create clear actions.', () => {
    const expectedAction = {
      type: 'CHELL/EXAMPLE_CLEAR',
    };
    expect(createContainerActions('example').clear()).toEqual(expectedAction);
  });

  it('Should create remove actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: 'Heart',
      type: 'CHELL/EXAMPLE_REMOVE',
    };
    expect(createContainerActions('example').remove('Heart')).toEqual(expectedAction);
  });

  it('Should create set actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: ['Fire', 'Wind', 'Earth'],
      type: 'CHELL/EXAMPLE_SET',
    };
    expect(createContainerActions('example').set(['Fire', 'Wind', 'Earth'])).toEqual(expectedAction);
  });

  it('Should use a namespace if provided.', () => {
    const namespace = 'FRATELLIS';

    expect(createContainerActions('music', namespace).add('Nina').type).toEqual('FRATELLIS/MUSIC_ADD');
    expect(createContainerActions('music', namespace).addMultiple(['Rosanna', 'Chelsea Dagger']).type).toEqual(
      'FRATELLIS/MUSIC_ADD_MULTIPLE',
    );
    expect(createContainerActions('music', namespace).clear().type).toEqual('FRATELLIS/MUSIC_CLEAR');
    expect(createContainerActions('music', namespace).remove("Moriarty's Last Stand").type).toEqual(
      'FRATELLIS/MUSIC_REMOVE',
    );
    expect(createContainerActions('music', namespace).set(['Laughing Gas', 'I guess... I suppose...']).type).toEqual(
      'FRATELLIS/MUSIC_SET',
    );
  });
});
