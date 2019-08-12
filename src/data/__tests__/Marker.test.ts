import { Marker } from '~bioblocks-viz~/data';

describe('Marker', () => {
  it('Should return an empty color array from an empty state.', () => {
    expect(Marker.colors.autoColorFromStates([])).toEqual([]);
  });

  it('Should return color-brewer colors for a small set of data.', () => {
    const state = ['ala', 'val'];
    expect(Marker.colors.autoColorFromStates(state)).toEqual([
      { color: '#66c2a5', name: 'ala' },
      { color: '#fc8d62', name: 'val' },
    ]);
  });

  it('Should sort color-brewer colors when different counts are detected.', () => {
    const state = ['ala', 'ala', 'val'];
    expect(Marker.colors.autoColorFromStates(state)).toEqual([
      { color: '#66c2a5', name: 'ala' },
      { color: '#66c2a5', name: 'ala' },
      { color: '#fc8d62', name: 'val' },
    ]);
  });
});
