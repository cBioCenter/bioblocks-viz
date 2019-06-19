import { BioblocksPDB, CouplingContainer } from '~bioblocks-viz~/data';

export const AminoAcids = [
  { fullName: 'Alanine', singleLetterCode: 'A', threeLetterCode: 'ALA' },
  { fullName: 'Arginine', singleLetterCode: 'R', threeLetterCode: 'ARG' },
  { fullName: 'Asparagine', singleLetterCode: 'N', threeLetterCode: 'ASN' },
  { fullName: 'Aspartic Acid', singleLetterCode: 'D', threeLetterCode: 'ASP' },
  { fullName: 'Cysteine', singleLetterCode: 'C', threeLetterCode: 'CYS' },
  { fullName: 'Glutamine', singleLetterCode: 'Q', threeLetterCode: 'GLN' },
  { fullName: 'Glutamic Acid', singleLetterCode: 'E', threeLetterCode: 'GLU' },
  { fullName: 'Glycine', singleLetterCode: 'G', threeLetterCode: 'GLY' },
  { fullName: 'Histidine', singleLetterCode: 'H', threeLetterCode: 'HIS' },
  { fullName: 'Isoleucine', singleLetterCode: 'I', threeLetterCode: 'ILE' },
  { fullName: 'Leucine', singleLetterCode: 'L', threeLetterCode: 'LEU' },
  { fullName: 'Lysine', singleLetterCode: 'K', threeLetterCode: 'LYS' },
  { fullName: 'Methionine', singleLetterCode: 'M', threeLetterCode: 'MET' },
  { fullName: 'Phenylalanine', singleLetterCode: 'F', threeLetterCode: 'PHE' },
  { fullName: 'Proline', singleLetterCode: 'P', threeLetterCode: 'PRO' },
  { fullName: 'Serine', singleLetterCode: 'S', threeLetterCode: 'SER' },
  { fullName: 'Threonine', singleLetterCode: 'T', threeLetterCode: 'THR' },
  { fullName: 'Tryptophan', singleLetterCode: 'W', threeLetterCode: 'TRP' },
  { fullName: 'Tyrosine', singleLetterCode: 'Y', threeLetterCode: 'TYR' },
  { fullName: 'Valine', singleLetterCode: 'V', threeLetterCode: 'VAL' },
] as const;

const singleCodes = () => AminoAcids.map(a => a.singleLetterCode);
const threeCodes = () => AminoAcids.map(a => a.threeLetterCode);

export type AMINO_ACID_SINGLE_LETTER_CODE = keyof { [K in (ReturnType<typeof singleCodes>)[number]]: string };
export type AMINO_ACID_THREE_LETTER_CODE = keyof { [K in (ReturnType<typeof threeCodes>)[number]]: string };

export interface IAminoAcid {
  fullName: string;
  threeLetterCode: AMINO_ACID_THREE_LETTER_CODE;
  singleLetterCode: AMINO_ACID_SINGLE_LETTER_CODE;
}

export const AMINO_ACID_BY_CODE = AminoAcids.reduce<
  Record<AMINO_ACID_SINGLE_LETTER_CODE | AMINO_ACID_THREE_LETTER_CODE, IAminoAcid>
>(
  (acc, acid) => {
    acc[acid.singleLetterCode] = acid;
    acc[acid.threeLetterCode] = acid;

    return acc;
  },
  {} as any,
);

export interface IResidueMismatchResult {
  couplingAminoAcid: IAminoAcid;
  resno: number;
  pdbAminoAcid: IAminoAcid;
}

/**
 * Gets mismatches between a PDB file and coupling scores.
 * @returns Array of mismatches - empty if none are found.
 */
export const getPDBAndCouplingMismatch = (pdbData: BioblocksPDB, couplingScores: CouplingContainer) => {
  const pdbSequence = pdbData.sequence;
  const couplingSequence = couplingScores.sequence;
  const mismatches = getSequenceMismatch(pdbSequence, couplingSequence);

  if (mismatches.length === 0) {
    return pdbData.getResidueNumberingMismatches(couplingScores);
  }

  return mismatches;
};

/**
 * Given two **equal-length** Amino Acid sequences, returns all mismatches.
 */
export const getSequenceMismatch = (firstSequence: string, secondSequence: string) => {
  const mismatches = new Array<IResidueMismatchResult>();
  if (firstSequence.length === secondSequence.length) {
    for (let i = 0; i < firstSequence.length; ++i) {
      const couplingAminoAcid = firstSequence[i] as AMINO_ACID_SINGLE_LETTER_CODE;
      const pdbAminoAcid = secondSequence[i] as AMINO_ACID_SINGLE_LETTER_CODE;
      if (couplingAminoAcid !== pdbAminoAcid) {
        mismatches.push({
          couplingAminoAcid: AMINO_ACID_BY_CODE[couplingAminoAcid],
          pdbAminoAcid: AMINO_ACID_BY_CODE[pdbAminoAcid],
          resno: i,
        });
      }
    }
  }

  return mismatches;
};
