import {
  AMINO_ACIDS_BY_SINGLE_LETTER_CODE,
  ChellPDB,
  CouplingContainer,
  getPDBAndCouplingMismatch,
  getSequenceMismatch,
  IResidueMismatchResult,
} from '~chell-viz~/data';

describe('Sequence Mismatch', () => {
  // Taken from 1g68 dataset.
  const firstSequence = 'LAQTQASMERNDAIVKIGHSIFDVYTS';
  const secondSequence = 'LAQTQASMARNDAIVKIGHSIFDVYTS';

  it('Should correctly report sequence mismatches.', () => {
    const expected: IResidueMismatchResult[] = [
      {
        firstAminoAcid: AMINO_ACIDS_BY_SINGLE_LETTER_CODE.E,
        resno: 8,
        secondAminoAcid: AMINO_ACIDS_BY_SINGLE_LETTER_CODE.A,
      },
    ];
    expect(getSequenceMismatch(firstSequence, secondSequence)).toEqual(expected);
  });

  it('Should correctly report no sequence mismatch from empty PDB and CouplingContainer.', async () => {
    const pdb = await ChellPDB.createPDB();
    const couplings = new CouplingContainer();

    const expected: IResidueMismatchResult[] = [];
    expect(getPDBAndCouplingMismatch(pdb, couplings)).toEqual(expected);
  });
});
