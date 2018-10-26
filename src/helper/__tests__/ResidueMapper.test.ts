import { generateResidueMapping, IResidueMapping } from '~chell-viz~/helper';

describe('ResidueMapper', () => {
  const simpleFile = 'up_index\tup_residue\tpdb_index\tpdb_residue\n24\tH\t26\tH\n25\tP\t27\tP';

  it('Should map residues correctly when given properly formatted indextableplus text.', () => {
    const result = generateResidueMapping(simpleFile);
    const expected: IResidueMapping[] = [
      {
        couplingsResCode: 'H',
        couplingsResno: 24,
        pdbResCode: 'H',
        pdbResno: 26,
      },
      {
        couplingsResCode: 'P',
        couplingsResno: 25,
        pdbResCode: 'P',
        pdbResno: 27,
      },
    ];
    expect(result).toEqual(expected);
  });

  it('Should throw when given text that is missing the required headers.', () => {
    expect(() => generateResidueMapping('1\t2\t3\t4\t5')).toThrowError();
  });

  it('Should return an empty list if headers are correct but no other text is provided.', () => {
    const expected = new Array();
    const result = generateResidueMapping(simpleFile.split('\n')[0]);
    expect(result).toEqual(expected);
  });

  it('Should skip empty lines.', () => {
    const expected: IResidueMapping[] = [
      {
        couplingsResCode: 'H',
        couplingsResno: 24,
        pdbResCode: 'H',
        pdbResno: 26,
      },
      {
        couplingsResCode: 'P',
        couplingsResno: 25,
        pdbResCode: 'P',
        pdbResno: 27,
      },
    ] as IResidueMapping[];
    const splitLines = simpleFile.split('\n');
    const foo = splitLines[0]
      .concat('\n', splitLines[1])
      .concat('\n', '')
      .concat('\n', splitLines[2]);
    const result = generateResidueMapping(foo);
    expect(result).toEqual(expected);
  });
});
