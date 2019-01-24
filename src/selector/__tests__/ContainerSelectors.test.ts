import { Set } from 'immutable';
import { selectCurrentItems } from '~chell-viz~/selector';

describe('ContainerSelector', () => {
  it('Should return an empty set if the state does not exist.', () => {
    const expectedState = Set();
    expect(selectCurrentItems(undefined as any, 'back')).toMatchObject(expectedState);
  });

  it('Should select the state correctly if it exists.', () => {
    const expectedState = Set([1, 2, 3]);
    expect(selectCurrentItems({ ['chell/forward']: Set([1, 2, 3]) }, 'forward')).toMatchObject(expectedState);
  });
});
