import { flatten } from 'lodash';
import { BioblocksPDB, CouplingContainer } from '~bioblocks-viz~/data';

export type AMINO_ACID_FULL_NAME = keyof { [K in (ReturnType<typeof AminoAcid.ALL_FULL_NAMES>)[number]]: string };
export type AMINO_ACID_1LETTER_CODE = keyof { [K in (ReturnType<typeof AminoAcid.ALL_1LETTER_CODES>)[number]]: string };
export type AMINO_ACID_3LETTER_CODE = keyof { [K in (ReturnType<typeof AminoAcid.ALL_3LETTER_CODES>)[number]]: string };
export type AMINO_ACID_CODON = keyof { [K in (ReturnType<typeof AminoAcid.ALL_CODONS>)[number]]: string[] };

export class AminoAcid {
  public static readonly Alanine = new AminoAcid('Alanine', 'A', 'ALA', ['GCT', 'GCC', 'GCA', 'GCG']);
  public static readonly Arginine = new AminoAcid('Arginine', 'R', 'ARG', ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG']);
  public static readonly Asparagine = new AminoAcid('Asparagine', 'N', 'ASN', ['AAT', 'AAC']);
  public static readonly AsparticAcid = new AminoAcid('Aspartic Acid', 'D', 'ASP', ['GAT', 'GAC']);
  public static readonly Cysteine = new AminoAcid('Cysteine', 'C', 'CYS', ['TGT', 'TGC']);
  public static readonly Glutamine = new AminoAcid('Glutamine', 'Q', 'GLN', ['CAA', 'CAG']);
  public static readonly GlutamicAcid = new AminoAcid('Glutamic Acid', 'E', 'GLU', ['GAA', 'GAG']);
  public static readonly Glycine = new AminoAcid('Glycine', 'G', 'GLY', ['GGT', 'GGC', 'GGA', 'GGG']);
  public static readonly Histidine = new AminoAcid('Histidine', 'H', 'HIS', ['CAT', 'CAC']);
  public static readonly Isoleucine = new AminoAcid('Isoleucine', 'I', 'ILE', ['ATT', 'ATC', 'ATA']);
  public static readonly Leucine = new AminoAcid('Leucine', 'L', 'LEU', ['TTA', 'TTG', 'CTT', 'CTC', 'CTA', 'CTG']);
  public static readonly Lysine = new AminoAcid('Lysine', 'K', 'LYS', ['AAA', 'AAG']);
  public static readonly Methionine = new AminoAcid('Methionine', 'M', 'MET', ['ATG']);
  public static readonly Phenylalanine = new AminoAcid('Phenylalanine', 'F', 'PHE', ['TTT', 'TTC']);
  public static readonly Proline = new AminoAcid('Proline', 'P', 'PRO', ['CCT', 'CCC', 'CCA', 'CCG']);
  public static readonly Serine = new AminoAcid('Serine', 'S', 'SER', ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC']);
  public static readonly Threonine = new AminoAcid('Threonine', 'T', 'THR', ['ACT', 'ACC', 'ACA', 'ACG']);
  public static readonly Tryptophan = new AminoAcid('Tryptophan', 'W', 'TRP', ['TGG']);
  public static readonly Tyrosine = new AminoAcid('Tyrosine', 'Y', 'TYR', ['TAT', 'TAC']);
  public static readonly Valine = new AminoAcid('Valine', 'V', 'VAL', ['GTT', 'GTC', 'GTA', 'GTG']);

  // public static readonly Unknown = new AminoAcid('Unknown', 'X', 'XXX', []);

  public static ALL_FULL_NAMES = () => AminoAcid.getAllCanonicalAminoAcids().map(aa => aa.fullName);
  public static ALL_1LETTER_CODES = () => AminoAcid.getAllCanonicalAminoAcids().map(a => a.singleLetterCode);
  public static ALL_3LETTER_CODES = () => AminoAcid.getAllCanonicalAminoAcids().map(a => a.threeLetterCode);
  public static ALL_CODONS = () => flatten(AminoAcid.getAllCanonicalAminoAcids().map(a => a.codons));

  // public static readonly Stop = new AminoAcid('Stop', '*', '***', ['TAA', 'TGA', 'TAG']);
  // public static readonly Gap = new AminoAcid('Gap', '-', '---', []);
  // public static readonly Unknown = new AminoAcid('Unknown', '?', '???', []);

  public static getAllCanonicalAminoAcids(): AminoAcid[] {
    return Object.keys(AminoAcid).reduce((acc, staticVarName) => {
      const staticValue = AminoAcid[staticVarName as keyof typeof AminoAcid];

      if (staticValue instanceof AminoAcid) {
        acc.push(staticValue);
      }

      return acc;
    }, new Array<AminoAcid>());
  }

  public static fromSingleLetterCode(code: string): AminoAcid | undefined {
    return AminoAcid.getAllCanonicalAminoAcids().find(aa => {
      if (aa.singleLetterCode.toUpperCase() === code.toUpperCase()) {
        return true;
      }

      return false;
    });
  }

  public static fromThreeLetterCode(code: string): AminoAcid | undefined {
    AminoAcid.getAllCanonicalAminoAcids().forEach(aa => {
      if (aa.threeLetterCode.toUpperCase() === code.toUpperCase()) {
        return aa;
      }
    });

    return undefined;
  }

  public static fromCodon(codon: string): AminoAcid | undefined {
    AminoAcid.getAllCanonicalAminoAcids().forEach(aa => {
      aa.codons.forEach((codonStr: string) => {
        if (codonStr.toUpperCase() === codon.toUpperCase()) {
          return aa;
        }
      });
    });

    return undefined;
  }

  private constructor(
    readonly fullName: string,
    readonly singleLetterCode: string,
    readonly threeLetterCode: string,
    readonly codons: readonly string[],
  ) {}
}

/*

  public static ALL_FULL_NAMES = () => AminoAcid.CANONICAL_AMINO_ACIDS.map(a => a.fullName);
  public static ALL_1LETTER_CODES = () => AminoAcid.CANONICAL_AMINO_ACIDS.map(a => a.singleLetterCode);
  public static ALL_3LETTER_CODES = () => AminoAcid.CANONICAL_AMINO_ACIDS.map(a => a.threeLetterCode);
  public static ALL_CODONS = () => flatten(AminoAcid.CANONICAL_AMINO_ACIDS.map(a => a.codons));

  public static CANONICAL_AMINO_ACIDS = [
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
    {
      codons: [''],
      fullName: 'GAP',
      singleLetterCode: '-',
      threeLetterCode: '---',
    },
    {
      codons: [''],
      fullName: 'UNKNOWN',
      singleLetterCode: '?',
      threeLetterCode: '???',
    },
  ] as const;

  public static BY_FULL_NAME = AminoAcid.CANONICAL_AMINO_ACIDS.reduce<Record<AMINO_ACID_FULL_NAME, AminoAcid>>(
    (acc, aa) => {
      acc[aa.fullName] = aa;

      return acc;
    },
    {} as any,
  );

  public static BY_SINGLE_CODE = AminoAcid.CANONICAL_AMINO_ACIDS.reduce<Record<AMINO_ACID_1LETTER_CODE, AminoAcid>>(
    (acc, aa) => {
      acc[aa.singleLetterCode] = aa;

      return acc;
    },
    {} as any,
  );

  public static BY_TRIPLET_CODE = AminoAcid.CANONICAL_AMINO_ACIDS.reduce<Record<AMINO_ACID_3LETTER_CODE, AminoAcid>>(
    (acc, aa) => {
      acc[aa.threeLetterCode] = aa;

      return acc;
    },
    {} as any,
  );

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

const fullNames = () => AminoAcids.map(a => a.fullName);
const singleLetterCodes = () => AminoAcids.map(a => a.singleLetterCode);
const threeLetterCodes = () => AminoAcids.map(a => a.threeLetterCode);
const codons = () => flatten(AminoAcids.map(a => a.codons));

export type AMINO_ACID_FULL_NAME = keyof { [K in (ReturnType<typeof fullNames>)[number]]: string };
export type AMINO_ACID_SINGLE_LETTER_CODE = keyof { [K in (ReturnType<typeof singleLetterCodes>)[number]]: string };
export type AMINO_ACID_THREE_LETTER_CODE = keyof { [K in (ReturnType<typeof threeLetterCodes>)[number]]: string };
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
*/

export interface IResidueMismatchResult {
  couplingAminoAcid: AminoAcid;
  resno: number;
  pdbAminoAcid: AminoAcid;
}

// Gets mismatches between a PDB file and coupling scores.
// @returns Array of mismatches - empty if none are found.
export const getPDBAndCouplingMismatch = (pdbData: BioblocksPDB, couplingScores: CouplingContainer) => {
  const pdbSequence = pdbData.sequence;
  const couplingSequence = couplingScores.sequence;
  const mismatches = getSequenceMismatch(pdbSequence, couplingSequence);

  if (mismatches.length === 0) {
    return pdbData.getResidueNumberingMismatches(couplingScores);
  }

  return mismatches;
};

// Given two **equal-length** Amino Acid sequences, returns all mismatches.
export const getSequenceMismatch = (firstSequence: string, secondSequence: string) => {
  const mismatches = new Array<IResidueMismatchResult>();
  if (firstSequence.length === secondSequence.length) {
    for (let i = 0; i < firstSequence.length; ++i) {
      const couplingAminoAcid = AminoAcid.fromSingleLetterCode(firstSequence[i]);
      const pdbAminoAcid = AminoAcid.fromSingleLetterCode(secondSequence[i]);
      if (firstSequence[i] !== secondSequence[i] && couplingAminoAcid && pdbAminoAcid) {
        mismatches.push({
          couplingAminoAcid,
          pdbAminoAcid,
          resno: i,
        });
      }
    }
  }

  return mismatches;
};
