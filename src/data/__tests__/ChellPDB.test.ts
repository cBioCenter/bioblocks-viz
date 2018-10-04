import { ChellPDB } from '~chell-viz~/data';

describe('ChellPDB', () => {
  it('Should handle loading an existing PDB file.', () => {
    const result = ChellPDB.createPDB('protein.pdb');
    expect(result).toBeDefined();
  });

  it('Should handle loading a non-existent PDB file.', async () => {
    expect.assertions(1);
    await expect(ChellPDB.createPDB('error/protein.pdb')).rejects.toEqual('Invalid NGL path.');
  });

  describe('Amend coupling scores with PDB', () => {
    /*
    it('Should handle loading a non-existent PDB file.', async () => {
      const pdb = await ChellPDB.createPDB('protein.pdb');
      const result = pdb.generateCouplingsAmendedWithPDB([]);
    });
    */
  });
});
