import { generateResidueMapping, IResidueMapping } from '../ResidueMapper';

describe('ResidueMapper', () => {
  const simpleFile = 'up_index\tup_residue\tpdb_index\tpdb_residue\n24\tH\t26\tH\n25\tP\t27\tP';

  it('Should map residues correctly when given properly formatted indextableplus text.', () => {
    const result = generateResidueMapping(simpleFile);
    const expected = [
      {
        pdbResname: 'H',
        pdbResno: 26,
        uniProtResname: 'H',
        uniProtResno: 24,
      },
      {
        pdbResname: 'P',
        pdbResno: 27,
        uniProtResname: 'P',
        uniProtResno: 25,
      },
    ] as IResidueMapping[];
    expect(result).toEqual(expected);
  });

  it('Should map residues correctly when given properly formatted indextableplus text.', () => {
    const result = generateResidueMapping(simpleFile);
    const expected = [
      {
        pdbResname: 'H',
        pdbResno: 26,
        uniProtResname: 'H',
        uniProtResno: 24,
      },
      {
        pdbResname: 'P',
        pdbResno: 27,
        uniProtResname: 'P',
        uniProtResno: 25,
      },
    ] as IResidueMapping[];
    expect(result).toEqual(expected);
  });
});
