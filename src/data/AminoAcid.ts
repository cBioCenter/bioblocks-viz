import { BioblocksPDB, CouplingContainer } from '~bioblocks-viz~/data';

export const enum AMINO_ACID_CODES {
  'A' = 'ALA',
  'R' = 'ARG',
  'N' = 'ASN',
  'D' = 'ASP',
  'C' = 'CYS',
  'Q' = 'GLN',
  'E' = 'GLU',
  'G' = 'GLY',
  'H' = 'HIS',
  'I' = 'ILE',
  'L' = 'LEU',
  'K' = 'LYS',
  'M' = 'MET',
  'F' = 'PHE',
  'P' = 'PRO',
  'S' = 'SER',
  'T' = 'THR',
  'W' = 'TRP',
  'Y' = 'TYR',
  'V' = 'VAL',
}

export type AMINO_ACID_SINGLE_LETTER_CODE = keyof typeof AMINO_ACID_CODES;
export type AMINO_ACID_THREE_LETTER_CODE = AMINO_ACID_CODES;

export interface IAminoAcid {
  fullName: string;
  threeLetterCode: AMINO_ACID_THREE_LETTER_CODE;
  singleLetterCode: AMINO_ACID_SINGLE_LETTER_CODE;
}

const Ala: IAminoAcid = { fullName: 'Alanine', singleLetterCode: 'A', threeLetterCode: AMINO_ACID_CODES.A };
const Arg: IAminoAcid = { fullName: 'Arginine', singleLetterCode: 'R', threeLetterCode: AMINO_ACID_CODES.R };
const Asn: IAminoAcid = { fullName: 'Asparagine', singleLetterCode: 'N', threeLetterCode: AMINO_ACID_CODES.N };
const Asp: IAminoAcid = { fullName: 'Aspartic Acid', singleLetterCode: 'D', threeLetterCode: AMINO_ACID_CODES.D };
const Cys: IAminoAcid = { fullName: 'Cysteine', singleLetterCode: 'C', threeLetterCode: AMINO_ACID_CODES.C };
const Gln: IAminoAcid = { fullName: 'Glutamine', singleLetterCode: 'Q', threeLetterCode: AMINO_ACID_CODES.Q };
const Glu: IAminoAcid = { fullName: 'Glutamic Acid', singleLetterCode: 'E', threeLetterCode: AMINO_ACID_CODES.E };
const Gly: IAminoAcid = { fullName: 'Glycine', singleLetterCode: 'G', threeLetterCode: AMINO_ACID_CODES.G };
const His: IAminoAcid = { fullName: 'Histidine', singleLetterCode: 'H', threeLetterCode: AMINO_ACID_CODES.H };
const Ile: IAminoAcid = { fullName: 'Isoleucine', singleLetterCode: 'I', threeLetterCode: AMINO_ACID_CODES.I };
const Leu: IAminoAcid = { fullName: 'Leucine', singleLetterCode: 'L', threeLetterCode: AMINO_ACID_CODES.L };
const Lys: IAminoAcid = { fullName: 'Lysine', singleLetterCode: 'K', threeLetterCode: AMINO_ACID_CODES.K };
const Met: IAminoAcid = { fullName: 'Methionine', singleLetterCode: 'M', threeLetterCode: AMINO_ACID_CODES.M };
const Phe: IAminoAcid = { fullName: 'Phenylalanine', singleLetterCode: 'F', threeLetterCode: AMINO_ACID_CODES.F };
const Pro: IAminoAcid = { fullName: 'Proline', singleLetterCode: 'P', threeLetterCode: AMINO_ACID_CODES.P };
const Ser: IAminoAcid = { fullName: 'Serine', singleLetterCode: 'S', threeLetterCode: AMINO_ACID_CODES.S };
const Thr: IAminoAcid = { fullName: 'Threonine', singleLetterCode: 'T', threeLetterCode: AMINO_ACID_CODES.T };
const Trp: IAminoAcid = { fullName: 'Tryptophan', singleLetterCode: 'W', threeLetterCode: AMINO_ACID_CODES.W };
const Tyr: IAminoAcid = { fullName: 'Tyrosine', singleLetterCode: 'Y', threeLetterCode: AMINO_ACID_CODES.Y };
const Val: IAminoAcid = { fullName: 'Valine', singleLetterCode: 'V', threeLetterCode: AMINO_ACID_CODES.V };

// tslint:disable:object-literal-sort-keys
/**
 * Conviencence map to get an Amino Acid via either the single or three letter code.
 * @example AMINO_ACID_BY_CODE['A'] === AMINO_ACID_BY_CODE.A === AMINO_ACID_BY_CODE['ALA'] === AMINO_ACID_BY_CODE.ALA
 */
export const AMINO_ACID_BY_CODE: {
  [key in AMINO_ACID_THREE_LETTER_CODE | AMINO_ACID_SINGLE_LETTER_CODE]: IAminoAcid
} = {
  ALA: Ala,
  ARG: Arg,
  ASN: Asn,
  ASP: Asp,
  CYS: Cys,
  GLN: Gln,
  GLU: Glu,
  GLY: Gly,
  HIS: His,
  ILE: Ile,
  LEU: Leu,
  LYS: Lys,
  MET: Met,
  PHE: Phe,
  PRO: Pro,
  SER: Ser,
  THR: Thr,
  TRP: Trp,
  TYR: Tyr,
  VAL: Val,
  A: Ala,
  R: Arg,
  N: Asn,
  D: Asp,
  C: Cys,
  Q: Gln,
  E: Glu,
  G: Gly,
  H: His,
  I: Ile,
  L: Leu,
  K: Lys,
  M: Met,
  F: Phe,
  P: Pro,
  S: Ser,
  T: Thr,
  W: Trp,
  Y: Tyr,
  V: Val,
};
// tslint:enable:object-literal-sort-keys

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
