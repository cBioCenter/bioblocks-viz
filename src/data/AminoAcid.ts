import { flatten } from 'lodash';
import { BioblocksPDB, CouplingContainer } from '~bioblocks-viz~/data';

export const AminoAcids = [
  {
    codons: ['GCT', 'GCC', 'GCA', 'GCG'],
    fullName: 'Alanine',
    singleLetterCode: 'A',
    threeLetterCode: 'ALA',
  },
  {
    codons: ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'],
    fullName: 'Arginine',
    singleLetterCode: 'R',
    threeLetterCode: 'ARG',
  },
  {
    codons: ['AAT', 'AAC'],
    fullName: 'Asparagine',
    singleLetterCode: 'N',
    threeLetterCode: 'ASN',
  },
  {
    codons: ['GAT', 'GAC'],
    fullName: 'Aspartic Acid',
    singleLetterCode: 'D',
    threeLetterCode: 'ASP',
  },
  {
    codons: ['TGT', 'TGC'],
    fullName: 'Cysteine',
    singleLetterCode: 'C',
    threeLetterCode: 'CYS',
  },
  {
    codons: ['CAA', 'CAG'],
    fullName: 'Glutamine',
    singleLetterCode: 'Q',
    threeLetterCode: 'GLN',
  },
  {
    codons: ['GAA', 'GAG'],
    fullName: 'Glutamic Acid',
    singleLetterCode: 'E',
    threeLetterCode: 'GLU',
  },
  {
    codons: ['GGT', 'GGC', 'GGA', 'GGG'],
    fullName: 'Glycine',
    singleLetterCode: 'G',
    threeLetterCode: 'GLY',
  },
  {
    codons: ['CAT', 'CAC'],
    fullName: 'Histidine',
    singleLetterCode: 'H',
    threeLetterCode: 'HIS',
  },
  {
    codons: ['ATT', 'ATC', 'ATA'],
    fullName: 'Isoleucine',
    singleLetterCode: 'I',
    threeLetterCode: 'ILE',
  },
  {
    codons: ['TTA', 'TTG', 'CTT', 'CTC', 'CTA', 'CTG'],
    fullName: 'Leucine',
    singleLetterCode: 'L',
    threeLetterCode: 'LEU',
  },
  {
    codons: ['AAA', 'AAG'],
    fullName: 'Lysine',
    singleLetterCode: 'K',
    threeLetterCode: 'LYS',
  },
  {
    codons: ['ATG'],
    fullName: 'Methionine',
    singleLetterCode: 'M',
    threeLetterCode: 'MET',
  },
  {
    codons: ['TTT', 'TTC'],
    fullName: 'Phenylalanine',
    singleLetterCode: 'F',
    threeLetterCode: 'PHE',
  },
  {
    codons: ['CCT', 'CCC', 'CCA', 'CCG'],
    fullName: 'Proline',
    singleLetterCode: 'P',
    threeLetterCode: 'PRO',
  },
  {
    codons: ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC'],
    fullName: 'Serine',
    singleLetterCode: 'S',
    threeLetterCode: 'SER',
  },
  {
    codons: ['ACT', 'ACC', 'ACA', 'ACG'],
    fullName: 'Threonine',
    singleLetterCode: 'T',
    threeLetterCode: 'THR',
  },
  {
    codons: ['TGG'],
    fullName: 'Tryptophan',
    singleLetterCode: 'W',
    threeLetterCode: 'TRP',
  },
  {
    codons: ['TAT', 'TAC'],
    fullName: 'Tyrosine',
    singleLetterCode: 'Y',
    threeLetterCode: 'TYR',
  },
  {
    codons: ['GTT', 'GTC', 'GTA', 'GTG'],
    fullName: 'Valine',
    singleLetterCode: 'V',
    threeLetterCode: 'VAL',
  },
  {
    codons: ['TAA', 'TGA', 'TAG'],
    fullName: 'STOP',
    singleLetterCode: '*',
    threeLetterCode: '***',
  },
] as const;

const aminoAcidFullNames = () => AminoAcids.map(a => a.fullName);
const singleCodes = () => AminoAcids.map(a => a.singleLetterCode);
const threeCodes = () => AminoAcids.map(a => a.threeLetterCode);
const codons = () => flatten(AminoAcids.map(a => a.codons));

export type AMINO_ACID_FULL_NAME = keyof { [K in (ReturnType<typeof aminoAcidFullNames>)[number]]: string };
export type AMINO_ACID_SINGLE_LETTER_CODE = keyof { [K in (ReturnType<typeof singleCodes>)[number]]: string };
export type AMINO_ACID_THREE_LETTER_CODE = keyof { [K in (ReturnType<typeof threeCodes>)[number]]: string };
export type AMINO_ACID_CODONS = keyof { [K in (ReturnType<typeof codons>)[number]]: string };

export interface IAminoAcid {
  fullName: AMINO_ACID_FULL_NAME;
  threeLetterCode: AMINO_ACID_THREE_LETTER_CODE;
  singleLetterCode: AMINO_ACID_SINGLE_LETTER_CODE;
  codons: Readonly<AMINO_ACID_CODONS[]>;
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

export const AMINO_ACID_BY_FULL_NAME = AminoAcids.reduce<Record<AMINO_ACID_FULL_NAME, IAminoAcid>>(
  (acc, acid) => {
    acc[acid.fullName] = acid;

    return acc;
  },
  {} as any,
);

export const AMINO_ACID_BY_CODON = AminoAcids.reduce<Record<AMINO_ACID_CODONS, IAminoAcid>>(
  (acc, acid) => {
    for (const codon of acid.codons) {
      acc[codon] = acid;
    }

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
