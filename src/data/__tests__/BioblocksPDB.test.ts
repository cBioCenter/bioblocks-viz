import { BioblocksPDB } from '~bioblocks-viz~/data';

describe('BioblocksPDB', () => {
  it('Should handle loading an existing PDB file.', async () => {
    const result = BioblocksPDB.createPDB('protein.pdb');
    await expect(result).toBeDefined();
  });

  it('Should handle loading a non-existent PDB file.', async () => {
    expect.assertions(1);
    await expect(BioblocksPDB.createPDB('error/protein.pdb')).rejects.toEqual('Invalid NGL path.');
  });

  it('Should correctly handle naming the pdb.', async () => {
    let result = await BioblocksPDB.createPDB('protein.pdb');
    expect(result.name).toEqual('protein');

    result = await BioblocksPDB.createPDB('folder/protein.pdb');
    expect(result.name).toEqual('protein');

    result = await BioblocksPDB.createPDB('protein');
    expect(result.name).toEqual('protein');
  });

  it('Should correctly handle getting the secondary structure.', async () => {
    const expected = [{ resno: 1, structId: 'H' }, { resno: 2, structId: 'E' }];
    const result = await BioblocksPDB.createPDB('sample.pdb');
    expect(result.secondaryStructure).toEqual(expected);
  });

  it('Should correctly handle getting the secondary structure sections.', async () => {
    const expected = [
      [
        { label: 'H', sectionEnd: 1, sectionStart: 1 },
        { label: 'E', sectionEnd: 2, sectionStart: 2 },
        { label: 'C', sectionEnd: 3, sectionStart: 3 },
      ],
    ];
    const result = await BioblocksPDB.createPDB('sample.pdb');
    expect(result.secondaryStructureSections).toEqual(expected);
  });

  describe('Getting a trimmed name', () => {
    it('should trim the last 3 underscores by default.', async () => {
      const result = await BioblocksPDB.createPDB('protein_0_1_2.pdb');
      expect(result.getTrimmedName()).toEqual('protein');
    });

    it('should not trim by default if there are 2 or fewer underscored words.', async () => {
      const result = await BioblocksPDB.createPDB('protein_2_3.pdb');
      expect(result.getTrimmedName()).toEqual('protein_2_3');
    });

    it('should allow trimming the first 3 underscores.', async () => {
      const result = await BioblocksPDB.createPDB('0_1_2_3_protein.pdb');
      expect(result.getTrimmedName('_', 3, 'front')).toEqual('3_protein');
    });

    it('should allow trimming a different character.', async () => {
      const result = await BioblocksPDB.createPDB('protein-0-1-2-3.pdb');
      expect(result.getTrimmedName('-')).toEqual('protein-0');
    });

    it('should allow trimming a different number of words.', async () => {
      const result = await BioblocksPDB.createPDB('protein_0_1_2_3.pdb');
      expect(result.getTrimmedName('_', 2)).toEqual('protein_0_1');
    });

    it('should handle invalid word counts by not trimming.', async () => {
      const result = await BioblocksPDB.createPDB('protein_0_1_2_3.pdb');
      expect(result.getTrimmedName('_', -1)).toEqual('protein_0_1_2_3');
      expect(result.getTrimmedName('_', 10)).toEqual('protein_0_1_2_3');
    });
  });
});
