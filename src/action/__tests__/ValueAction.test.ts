import { createValueActions } from '~bioblocks-viz~/action';

describe('ValueAction', () => {
  it('Should create clear actions.', () => {
    const expectedAction = {
      type: 'BIOBLOCKS/EXAMPLE_CLEAR',
    };
    expect(createValueActions('example').clear()).toEqual(expectedAction);
  });

  it('Should create set actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: ['Earth', 'Wind', 'Fire'],
      type: 'BIOBLOCKS/EXAMPLE_SET',
    };
    expect(createValueActions('example').set(['Earth', 'Wind', 'Fire'])).toEqual(expectedAction);
  });

  it('Should use a namespace if provided.', () => {
    const namespace = 'FRATELLIS';

    expect(createValueActions('music', namespace).clear().type).toEqual('FRATELLIS/MUSIC_CLEAR');
    expect(createValueActions('music', namespace).set(['Rosanna', 'Chelsea Dagger']).type).toEqual(
      'FRATELLIS/MUSIC_SET',
    );
  });
});
