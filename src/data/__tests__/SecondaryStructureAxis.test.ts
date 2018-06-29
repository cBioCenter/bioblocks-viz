import { SECONDARY_STRUCTURE_CODES, SECONDARY_STRUCTURE_KEYS } from '../chell-data';
import Chell1DSection from '../Chell1DSection';
import { SecondaryStructureAxis } from '../SecondaryStructureAxis';

describe('SecondaryStructureAxis', () => {
  const genSeqEntry = (resno: number, structId: keyof typeof SECONDARY_STRUCTURE_CODES) =>
    new Chell1DSection<SECONDARY_STRUCTURE_KEYS>(structId, resno);

  it('Should create an empty axis when no secondary structure is provided.', () => {
    const result = new SecondaryStructureAxis([]);
    expect(result.axis).toEqual(new Map());
  });

  it('Should handle an axis made up of a single secondary structure entry.', () => {
    const result = new SecondaryStructureAxis([genSeqEntry(0, 'E')]);
    expect(result.axis.size).toBe(1);
  });

  it('Should handle an axis made up of different secondary structure types.', () => {
    const result = new SecondaryStructureAxis([genSeqEntry(0, 'B'), genSeqEntry(1, 'C'), genSeqEntry(2, 'E')]);
    expect(result.axis.size).toBe(3);
  });

  it('Should allow custom color mappings.', () => {
    const newColorMap = {
      B: 'black',
      C: 'purple',
      E: 'orange',
    };
    const result = new SecondaryStructureAxis(
      [genSeqEntry(0, 'B'), genSeqEntry(1, 'C'), genSeqEntry(2, 'E')],
      newColorMap,
    );
    expect(result.axis.get('B')).not.toBeUndefined();
    expect(result.axis.get('B')!.x.line!.color).toBe('black');
    expect(result.axis.get('B')!.y.line!.color).toBe('black');

    expect(result.axis.get('C')).not.toBeUndefined();
    expect(result.axis.get('C')!.x.line!.color).toBe('purple');
    expect(result.axis.get('C')!.y.line!.color).toBe('purple');

    expect(result.axis.get('E')).not.toBeUndefined();
    expect(result.axis.get('E')!.x.line!.color).toBe('orange');
    expect(result.axis.get('E')!.y.line!.color).toBe('orange');
  });
});
