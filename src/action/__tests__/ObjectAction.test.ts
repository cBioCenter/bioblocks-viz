import { createObjectActions } from '~bioblocks-viz~/action';

describe('ObjectAction', () => {
  it('Should create add actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: { element: 'earth' },
      type: 'BIOBLOCKS/EXAMPLE_ADD',
    };
    expect(createObjectActions('example').add({ element: 'earth' })).toEqual(expectedAction);
  });

  it('Should create clear actions.', () => {
    const expectedAction = {
      type: 'BIOBLOCKS/EXAMPLE_CLEAR',
    };
    expect(createObjectActions('example').clear()).toEqual(expectedAction);
  });

  it('Should create remove actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: 'element',
      type: 'BIOBLOCKS/EXAMPLE_REMOVE',
    };
    expect(createObjectActions('example').remove('element')).toEqual(expectedAction);
  });

  it('Should create remove multiple actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: ['earth', 'wind'],
      type: 'BIOBLOCKS/EXAMPLE_REMOVE_MULTIPLE',
    };
    expect(createObjectActions('example').removeMultiple(['earth', 'wind'])).toEqual(expectedAction);
  });

  it('Should create set actions.', () => {
    const expectedAction = {
      meta: 'example',
      payload: { element: 'fire' },
      type: 'BIOBLOCKS/EXAMPLE_SET',
    };
    expect(createObjectActions('example').set({ element: 'fire' })).toEqual(expectedAction);
  });

  it('Should use a namespace if provided.', () => {
    const namespace = 'FRATELLIS';

    expect(createObjectActions('music', namespace).clear().type).toEqual('FRATELLIS/MUSIC_CLEAR');
    expect(createObjectActions('music', namespace).set({ best: 'Z Movie Saga' }).type).toEqual('FRATELLIS/MUSIC_SET');
  });
});
