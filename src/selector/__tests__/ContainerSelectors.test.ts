import { Set } from 'immutable';
import { selectCurrentItems } from '~bioblocks-viz~/selector';

describe('ContainerSelector', () => {
  it('Should return an empty Set if the state does not exist.', () => {
    const expectedState = Set();
    expect(selectCurrentItems(undefined as any, 'back')).toMatchObject(expectedState);
  });

  it('Should select the state correctly if it exists.', () => {
    const expectedState = Set([1, 2, 3]);
    expect(selectCurrentItems({ ['bioblocks/forward']: Set([1, 2, 3]) }, 'forward')).toMatchObject(expectedState);
  });
});
