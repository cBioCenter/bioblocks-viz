import { selectCurrentValue } from '~chell-viz~/selector';

describe('ValueSelector', () => {
  it('Should return an empty value if the state does not exist.', () => {
    expect(selectCurrentValue<boolean>(undefined as any, 'back')).toBeNull();
  });

  it('Should select the state correctly if it exists.', () => {
    const spyFn = jest.fn();
    const state = {
      ['chell/bool']: true,
      ['chell/function']: spyFn,
      ['chell/number']: 42,
      ['chell/object']: { key: 'value' },
      ['chell/string']: 'true',
    };

    expect(selectCurrentValue(state, 'bool')).toEqual(true);
    expect(selectCurrentValue(state, 'function')).toEqual(spyFn);
    expect(selectCurrentValue(state, 'number')).toEqual(42);
    expect(selectCurrentValue(state, 'object')).toEqual({ key: 'value' });
    expect(selectCurrentValue(state, 'string')).toEqual('true');
  });
});
