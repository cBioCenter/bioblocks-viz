import {
  AMINO_ACID_BY_CODE,
  BioblocksPDB,
  CouplingContainer,
  getPDBAndCouplingMismatch,
  getSequenceMismatch,
  IResidueMismatchResult,
} from '~bioblocks-viz~/data';

describe('Sequence Mismatch', () => {
  // Taken from 1g68 dataset.
  const firstSequence = 'LAQTQASMERNDAIVKIGHSIFDVYTS';
  const secondSequence = 'LAQTQASMARNDAIVKIGHSIFDVYTS';

  it('Should correctly report sequence mismatches.', () => {
    const expected: IResidueMismatchResult[] = [
      {
        couplingAminoAcid: AMINO_ACID_BY_CODE.E,
        pdbAminoAcid: AMINO_ACID_BY_CODE.A,
        resno: 8,
      },
    ];
    expect(getSequenceMismatch(firstSequence, secondSequence)).toEqual(expected);
  });

  it('Should correctly report no sequence mismatch from empty PDB and CouplingContainer.', async () => {
    const pdb = await BioblocksPDB.createPDB();
    const couplings = new CouplingContainer();

    const expected: IResidueMismatchResult[] = [];
    expect(getPDBAndCouplingMismatch(pdb, couplings)).toEqual(expected);
  });
});
