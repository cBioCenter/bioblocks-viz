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
});
