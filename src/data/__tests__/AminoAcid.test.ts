import * as NGL from 'ngl';

import {
  ALL_AMINO_ACID_SINGLE_LETTER_CODES,
  ALL_AMINO_ACID_THREE_LETTER_CODES,
  AMINO_ACID_BY_CODE,
  AMINO_ACID_SINGLE_LETTER_CODE,
  BioblocksPDB,
  CouplingContainer,
  getPDBAndCouplingMismatch,
  getSequenceMismatch,
  IResidueMismatchResult,
} from '~bioblocks-viz~/data';

describe('Amino Acids', () => {
  it('Should correctly have all single letter codes.', () => {
    const expected = [
      'A',
      'R',
      'N',
      'D',
      'C',
      'Q',
      'E',
      'G',
      'H',
      'I',
      'L',
      'K',
      'M',
      'F',
      'P',
      'S',
      'T',
      'W',
      'Y',
      'V',
    ];
    expect(ALL_AMINO_ACID_SINGLE_LETTER_CODES()).toEqual(expected);
  });

  it('Should correctly have all single letter codes.', () => {
    const expected = [
      'ALA',
      'ARG',
      'ASN',
      'ASP',
      'CYS',
      'GLN',
      'GLU',
      'GLY',
      'HIS',
      'ILE',
      'LEU',
      'LYS',
      'MET',
      'PHE',
      'PRO',
      'SER',
      'THR',
      'TRP',
      'TYR',
      'VAL',
    ];
    expect(ALL_AMINO_ACID_THREE_LETTER_CODES()).toEqual(expected);
  });
});

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

  it('Should correctly report a sequence mismatch from PDB and CouplingContainer.', async () => {
    BioblocksPDB.createPDB = jest.fn(async () => {
      const nglData = new NGL.Structure('test', '');
      nglData.getSequence = jest.fn(() => secondSequence.split(''));

      return BioblocksPDB.createPDBFromNGLData(nglData);
    });
    const pdb = await BioblocksPDB.createPDB();
    const couplings = new CouplingContainer(
      firstSequence.split('').map((char, index) => ({
        A_i: char as AMINO_ACID_SINGLE_LETTER_CODE,
        A_j: char as AMINO_ACID_SINGLE_LETTER_CODE,
        i: index + 1,
        j: index + 1,
      })),
    );

    const expected: IResidueMismatchResult[] = [
      {
        couplingAminoAcid: AMINO_ACID_BY_CODE.A,
        pdbAminoAcid: AMINO_ACID_BY_CODE.E,
        resno: 8,
      },
    ];
    expect(getPDBAndCouplingMismatch(pdb, couplings)).toEqual(expected);
  });

  it('Should correctly report empty mismatches for PDB and CouplingContainer with different length sequence.', async () => {
    const pdb = await BioblocksPDB.createPDB('sample.pdb');
    const couplings = new CouplingContainer(
      firstSequence
        .substr(1)
        .split('')
        .map((char, index) => ({
          A_i: char as AMINO_ACID_SINGLE_LETTER_CODE,
          A_j: char as AMINO_ACID_SINGLE_LETTER_CODE,
          i: index + 1,
          j: index + 1,
        })),
    );

    expect(getPDBAndCouplingMismatch(pdb, couplings)).toEqual([]);
  });
});
