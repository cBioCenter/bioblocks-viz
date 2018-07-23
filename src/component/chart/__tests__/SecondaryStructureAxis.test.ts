import { SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_CODES, SECONDARY_STRUCTURE_KEYS } from '../../../data/chell-data';
import Chell1DSection from '../../../data/Chell1DSection';
import { IAxisMapping } from '../AuxiliaryAxis';
import { SecondaryStructureAxis } from '../SecondaryStructureAxis';

describe('SecondaryStructureAxis', () => {
  const genSeqEntry = (
    structId: keyof typeof SECONDARY_STRUCTURE_CODES,
    resno: number,
    length: number = 1,
  ): SECONDARY_STRUCTURE => [new Chell1DSection<SECONDARY_STRUCTURE_KEYS>(structId, resno, resno + length - 1)];

  it('Should create an empty axis when no secondary structure is provided.', () => {
    const result = new SecondaryStructureAxis([]);
    expect(result.axis).toEqual(new Map());
  });

  it('Should handle an axis made up of a single secondary structure entry.', () => {
    const result = new SecondaryStructureAxis(genSeqEntry('E', 0), 0, 0);
    expect(result.axis.size).toBe(1);
  });

  it('Should handle an axis made up of different secondary structure types.', () => {
    const result = new SecondaryStructureAxis(
      [...genSeqEntry('B', 0), ...genSeqEntry('C', 1), ...genSeqEntry('E', 2)],
      0,
      0,
    );
    expect(result.axis.size).toBe(3);
  });

  it('Should allow custom color mappings.', () => {
    const newColorMap = {
      C: 'purple',
      E: 'orange',
      H: 'black',
    };
    const result = new SecondaryStructureAxis(
      [...genSeqEntry('C', 1), ...genSeqEntry('E', 2), ...genSeqEntry('H', 0)],
      0,
      2,
      'black',
      newColorMap,
    );

    expect(result.axis.get('C')).not.toBeUndefined();
    expect(result.axis.get('C')!.x.line!.color).toBe('purple');
    expect(result.axis.get('C')!.y.line!.color).toBe('purple');

    expect(result.axis.get('E')).not.toBeUndefined();
    expect(result.axis.get('E')!.x.line!.color).toBe('orange');
    expect(result.axis.get('E')!.y.line!.color).toBe('orange');

    expect(result.axis.get('H')).not.toBeUndefined();
    expect(result.axis.get('H')!.x.line!.color).toBe('black');
    expect(result.axis.get('H')!.y.line!.color).toBe('black');
  });

  describe('Alpha Helix', () => {
    it('Should use points for a sine wave for alpha helix secondary structures.', () => {
      const result = new SecondaryStructureAxis(genSeqEntry('H', 1, 5));
      const expectedMainAxis = [1, 1, 2, 3, 4, 5, 5];
      const axis = result.axis.get('H') as RecursiveRequired<IAxisMapping>;

      expect(axis.x.x).toEqual(expectedMainAxis);
      expect(axis.y.y).toEqual(expectedMainAxis);

      expect(axis.x.y.length).toEqual(axis.y.x.length);
      expect(axis.x.y[0]).toBeNull();
      expect(axis.y.x[0]).toBeNull();

      for (let i = 1; i < axis.x.y.length - 1; ++i) {
        expect(axis.x.y[i]).toEqual(Math.sin(i - 1));
        expect(axis.y.x[i]).toEqual(Math.sin(i - 1));
      }

      expect(axis.x.y[axis.x.y.length - 1]).toBeNull();
      expect(axis.y.x[axis.y.x.length - 1]).toBeNull();
    });
  });

  describe('Beta Sheet', () => {
    it('Should use arrow symbols for drawing beta sheets.', () => {
      const result = new SecondaryStructureAxis(genSeqEntry('E', 1, 5));

      const lineSymbol = 'line-ne';
      const rightArrow = 'triangle-right';
      const downArrow = 'triangle-down';

      const axis = result.axis.get('E') as RecursiveRequired<IAxisMapping>;

      expect(axis.x.marker.symbol).toHaveLength(7);
      expect(axis.x.marker.symbol.length).toEqual(axis.y.marker.symbol.length);

      for (let i = 1; i < axis.x.marker.symbol.length - 2; ++i) {
        expect(axis.x.marker.symbol[i]).toEqual(lineSymbol);
        expect(axis.x.marker.symbol[i]).toEqual(lineSymbol);
      }

      expect(axis.x.marker.symbol[5]).toEqual(rightArrow);
      expect(axis.y.marker.symbol[5]).toEqual(downArrow);
    });
  });
});
