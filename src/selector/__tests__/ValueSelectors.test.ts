import { selectCurrentValue } from '~bioblocks-viz~/selector';

describe('ValueSelector', () => {
  it('Should return an empty value if the state does not exist.', () => {
    expect(selectCurrentValue<boolean>(undefined as any, 'back')).toBeNull();
  });

  it('Should select the state correctly if it exists.', () => {
    const spyFn = jest.fn();
    const state = {
      ['bioblocks/bool']: true,
      ['bioblocks/function']: spyFn,
      ['bioblocks/number']: 42,
      ['bioblocks/object']: { key: 'value' },
      ['bioblocks/string']: 'true',
    };

    expect(selectCurrentValue(state, 'bool')).toEqual(true);
    expect(selectCurrentValue(state, 'function')).toEqual(spyFn);
    expect(selectCurrentValue(state, 'number')).toEqual(42);
    expect(selectCurrentValue(state, 'object')).toEqual({ key: 'value' });
    expect(selectCurrentValue(state, 'string')).toEqual('true');
  });
});
