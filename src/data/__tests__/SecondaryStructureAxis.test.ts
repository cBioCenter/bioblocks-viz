import { SECONDARY_STRUCTURE_CODES } from '../chell-data';
import { SecondaryStructureAxis } from '../SecondaryStructureAxis';

describe('SecondaryStructureAxis', () => {
  const genSeqEntry = (resno: number, structId: keyof typeof SECONDARY_STRUCTURE_CODES) => ({ resno, structId });

  it('Should create an empty axis when no secondary structure is provided.', () => {
    const result = new SecondaryStructureAxis([]);
    expect(result.axis).toEqual([]);
  });

  it('Should handle an axis made up of a single secondary structure entry.', () => {
    const result = new SecondaryStructureAxis([genSeqEntry(0, 'E')]);
    expect(result.axis.length).toBe(2);
  });

  it('Should handle an axis made up of different secondary structure types.', () => {
    const result = new SecondaryStructureAxis([genSeqEntry(0, 'B'), genSeqEntry(1, 'C'), genSeqEntry(2, 'E')]);
    expect(result.axis.length).toBe(6);
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
    expect(result.axis[0].line!.color).toEqual(newColorMap.B);
    expect(result.axis[1].line!.color).toEqual(newColorMap.B);
    expect(result.axis[2].line!.color).toEqual(newColorMap.C);
    expect(result.axis[3].line!.color).toEqual(newColorMap.C);
    expect(result.axis[4].line!.color).toEqual(newColorMap.E);
    expect(result.axis[5].line!.color).toEqual(newColorMap.E);
  });
});
