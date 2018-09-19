export type AMINO_ACID_SINGLE_LETTER_CODES =
  | 'A'
  | 'R'
  | 'N'
  | 'D'
  | 'C'
  | 'Q'
  | 'E'
  | 'G'
  | 'H'
  | 'I'
  | 'L'
  | 'K'
  | 'M'
  | 'F'
  | 'P'
  | 'S'
  | 'T'
  | 'W'
  | 'Y'
  | 'V';

export type AMINO_ACID_THREE_LETTER_CODES =
  | 'ALA'
  | 'ARG'
  | 'ASN'
  | 'ASP'
  | 'CYS'
  | 'GLN'
  | 'GLU'
  | 'GLY'
  | 'HIS'
  | 'ILE'
  | 'LEU'
  | 'LYS'
  | 'MET'
  | 'PHE'
  | 'PRO'
  | 'SER'
  | 'THR'
  | 'TRP'
  | 'TYR'
  | 'VAL';

export interface IAminoAcid {
  fullName: string;
  threeLetterCode: AMINO_ACID_THREE_LETTER_CODES;
  singleLetterCode: AMINO_ACID_SINGLE_LETTER_CODES;
}

const Ala: IAminoAcid = { fullName: 'Alanine', singleLetterCode: 'A', threeLetterCode: 'ALA' };
const Arg: IAminoAcid = { fullName: 'Arginine', singleLetterCode: 'R', threeLetterCode: 'ARG' };
const Asn: IAminoAcid = { fullName: 'Asparagine', singleLetterCode: 'N', threeLetterCode: 'ASN' };
const Asp: IAminoAcid = { fullName: 'Aspartic Acid', singleLetterCode: 'D', threeLetterCode: 'ASP' };
const Cys: IAminoAcid = { fullName: 'Cysteine', singleLetterCode: 'C', threeLetterCode: 'CYS' };
const Gln: IAminoAcid = { fullName: 'Glutamine', singleLetterCode: 'Q', threeLetterCode: 'GLN' };
const Glu: IAminoAcid = { fullName: 'Glutamic Acid', singleLetterCode: 'E', threeLetterCode: 'GLU' };
const Gly: IAminoAcid = { fullName: 'Glycine', singleLetterCode: 'G', threeLetterCode: 'GLY' };
const His: IAminoAcid = { fullName: 'Histidine', singleLetterCode: 'H', threeLetterCode: 'HIS' };
const Ile: IAminoAcid = { fullName: 'Isoleucine', singleLetterCode: 'I', threeLetterCode: 'ILE' };
const Leu: IAminoAcid = { fullName: 'Leucine', singleLetterCode: 'L', threeLetterCode: 'LEU' };
const Lys: IAminoAcid = { fullName: 'Lysine', singleLetterCode: 'K', threeLetterCode: 'LYS' };
const Met: IAminoAcid = { fullName: 'Methionine', singleLetterCode: 'M', threeLetterCode: 'MET' };
const Phe: IAminoAcid = { fullName: 'Phenylalanine', singleLetterCode: 'F', threeLetterCode: 'PHE' };
const Pro: IAminoAcid = { fullName: 'Proline', singleLetterCode: 'P', threeLetterCode: 'PRO' };
const Ser: IAminoAcid = { fullName: 'Serine', singleLetterCode: 'S', threeLetterCode: 'SER' };
const Thr: IAminoAcid = { fullName: 'Threonine', singleLetterCode: 'T', threeLetterCode: 'THR' };
const Trp: IAminoAcid = { fullName: 'Tryptophan', singleLetterCode: 'W', threeLetterCode: 'TRP' };
const Tyr: IAminoAcid = { fullName: 'Tyrosine', singleLetterCode: 'Y', threeLetterCode: 'TYR' };
const Val: IAminoAcid = { fullName: 'Valine', singleLetterCode: 'V', threeLetterCode: 'VAL' };

// tslint:disable:object-literal-sort-keys
export const AMINO_ACIDS_BY_SINGLE_LETTER_CODE: { [key in AMINO_ACID_SINGLE_LETTER_CODES]: IAminoAcid } = {
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

export const AMINO_ACIDS_BY_THREE_LETTER_CODE: { [key in AMINO_ACID_THREE_LETTER_CODES]: IAminoAcid } = {
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
};

export const AMINO_ACIDS: IAminoAcid[] = [
  Ala,
  Arg,
  Asn,
  Asp,
  Cys,
  Gln,
  Glu,
  Gly,
  His,
  Ile,
  Leu,
  Lys,
  Met,
  Phe,
  Pro,
  Ser,
  Thr,
  Trp,
  Tyr,
  Val,
];
