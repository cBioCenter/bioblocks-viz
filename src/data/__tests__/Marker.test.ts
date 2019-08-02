import { Marker } from '~bioblocks-viz~/data';

describe('Marker', () => {
  it('Should return an empty color array from an empty state.', () => {
    expect(Marker.colors.autoColorFromStates([])).toEqual([]);
  });

  it('Should return color-brewer colors for a small set of data.', () => {
    const state = ['ala', 'arg', 'glu'];
    expect(Marker.colors.autoColorFromStates(state)).toEqual([
      { color: '#66c2a5', name: 'ala' },
      { color: '#fc8d62', name: 'arg' },
      { color: '#8da0cb', name: 'glu' },
    ]);
  });

  it('Should sort color-brewer colors when different counts are detected.', () => {
    const state = ['ala', 'ala', 'arg', 'glu'];
    expect(Marker.colors.autoColorFromStates(state)).toEqual([
      { color: '#8da0cb', name: 'ala' },
      { color: '#8da0cb', name: 'ala' },
      { color: '#66c2a5', name: 'arg' },
      { color: '#fc8d62', name: 'glu' },
    ]);
  });
});
