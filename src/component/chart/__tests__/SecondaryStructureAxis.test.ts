import { IAxisMapping, SecondaryStructureAxis } from '~bioblocks-viz~/component';
import {
  Bioblocks1DSection,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_CODES,
  SECONDARY_STRUCTURE_KEYS,
} from '~bioblocks-viz~/data';
import { ColorMapper } from '~bioblocks-viz~/helper';

describe('SecondaryStructureAxis', () => {
  const genSeqEntry = (
    structId: keyof typeof SECONDARY_STRUCTURE_CODES,
    resno: number,
    length: number = 1,
  ): SECONDARY_STRUCTURE => [new Bioblocks1DSection<SECONDARY_STRUCTURE_KEYS>(structId, resno, resno + length - 1)];

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
    const newColorMap = new ColorMapper<SECONDARY_STRUCTURE_KEYS>(
      new Map([['C', 'purple'], ['E', 'orange'], ['H', 'black']]),
      'black',
    );
    const result = new SecondaryStructureAxis(
      [...genSeqEntry('C', 1), ...genSeqEntry('E', 2), ...genSeqEntry('H', 0)],
      0,
      2,
      newColorMap,
    );

    const cAxis = result.getAxisById('C');
    const eAxis = result.getAxisById('E');
    const hAxis = result.getAxisById('H');

    if (!cAxis || !eAxis || !hAxis) {
      expect(cAxis).not.toBeUndefined();
      expect(eAxis).not.toBeUndefined();
      expect(hAxis).not.toBeUndefined();
    } else {
      expect(cAxis.x.line && cAxis.x.line.color).toBe(newColorMap.getColorFor('C'));
      expect(cAxis.y.line && cAxis.y.line.color).toBe(newColorMap.getColorFor('C'));

      expect(eAxis.x.line && eAxis.x.line.color).toBe(newColorMap.getColorFor('E'));
      expect(eAxis.y.line && eAxis.y.line.color).toBe(newColorMap.getColorFor('E'));

      expect(hAxis.x.line && hAxis.x.line.color).toBe(newColorMap.getColorFor('H'));
      expect(hAxis.y.line && hAxis.y.line.color).toBe(newColorMap.getColorFor('H'));
    }
  });

  describe('Alpha Helix', () => {
    it('Should use points for a sine wave for alpha helix secondary structures.', () => {
      const result = new SecondaryStructureAxis(genSeqEntry('H', 1, 5));
      const expectedMainAxis = [1, 1, 2, 3, 4, 5, 5];
      const axis = result.getAxisById('H') as IAxisMapping;

      expect(axis.x.x).toEqual(expectedMainAxis);
      expect(axis.y.y).toEqual(expectedMainAxis);

      expect(axis.x.y.length).toEqual(axis.y.x.length);
      expect(axis.x.y[0]).toBeNull();
      expect(axis.y.x[0]).toBeNull();

      for (let i = 1; i < axis.x.y.length - 1; ++i) {
        expect(axis.x.y[i]).toEqual(Math.sin(i));
        expect(axis.y.x[i]).toEqual(Math.sin(i));
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

      const axis = result.getAxisById('E') as IAxisMapping;

      if (!axis.x.marker.symbol || !axis.y.marker.symbol) {
        fail(`Axis symbols must be undefined. X: ${axis.x.marker.symbol} , y: ${axis.y.marker.symbol}`);
      } else {
        expect(axis.x.marker.symbol).toHaveLength(7);
        expect(axis.x.marker.symbol.length).toEqual(axis.y.marker.symbol.length);

        for (let i = 1; i < axis.x.marker.symbol.length - 2; ++i) {
          expect(axis.x.marker.symbol[i]).toEqual(lineSymbol);
          expect(axis.x.marker.symbol[i]).toEqual(lineSymbol);
        }

        expect(axis.x.marker.symbol[5]).toEqual(rightArrow);
        expect(axis.y.marker.symbol[5]).toEqual(downArrow);
      }
    });
  });
});
