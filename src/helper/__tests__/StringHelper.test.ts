import { capitalizeFirstLetter } from '~chell-viz~/helper';

describe('String Helper', () => {
  it('Should transform a string such that only the first letter is capitalized.', () => {
    const expected = 'Abc';
    expect(capitalizeFirstLetter('abc')).toEqual(expected);
    expect(capitalizeFirstLetter('abC')).toEqual(expected);
    expect(capitalizeFirstLetter('aBc')).toEqual(expected);
    expect(capitalizeFirstLetter('aBC')).toEqual(expected);
    expect(capitalizeFirstLetter('Abc')).toEqual(expected);
    expect(capitalizeFirstLetter('AbC')).toEqual(expected);
    expect(capitalizeFirstLetter('ABc')).toEqual(expected);
    expect(capitalizeFirstLetter('ABC')).toEqual(expected);
  });
});
