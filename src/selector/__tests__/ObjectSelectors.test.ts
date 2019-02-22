import { Map } from 'immutable';
import { selectObject } from '~bioblocks-viz~/selector';

describe('ObjectSelector', () => {
  it('Should return an empty Map if the state does not exist.', () => {
    const expectedState = Map();
    expect(selectObject(undefined as any, 'back')).toMatchObject(expectedState);
  });

  it('Should select the state correctly if it exists.', () => {
    const expectedState = Map({ need: 'medicine' });
    expect(selectObject({ ['bioblocks/what']: Map({ need: 'medicine' }) }, 'what')).toMatchObject(expectedState);
  });
});
