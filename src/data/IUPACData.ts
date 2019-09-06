/**
 * Useful biological nomenclature.
 * Derived from BioPython IUPACData.py:
 *     https://github.com/biopython/biopython/blob/master/Bio/Data/IUPACData.py
 *     which is under the BSD 3-Clause License with Copyright 2000 Andrew Dalke
 *
 * Note: Currently unimplemented are a few functions and variables:
 *     function '_make_ranges()', which is needed to generate:
 *         - variable 'unambiguous_dna_weight_ranges'
 *         - variable 'unambiguous_rna_weight_ranges'
 *         - variable 'protein_weight_ranges'
 *     function '_make_ambiguous_ranges', which is needed to generate:
 *         - variable 'ambiguous_dna_weight_ranges'
 *         - variable 'ambiguous_rna_weight_ranges'
 *         - variable 'extended_protein_weight_ranges'
 */
export const proteinLetters = 'ACDEFGHIKLMNPQRSTVWY';
export const extendedProteinLetters = 'ACDEFGHIKLMNPQRSTVWYBXZJUO';
//   B = "Asx";  aspartic acid or asparagine (D or N)
//   X = "Xxx";  unknown or 'other' amino acid
//   Z = "Glx";  glutamic acid or glutamine (E or Q)
//   http://www.chem.qmul.ac.uk/iupac/AminoAcid/A2021.html#AA212
//
//   J = "Xle";  leucine or isoleucine (L or I, used in NMR)
//   Mentioned in http://www.chem.qmul.ac.uk/iubmb/newsletter/1999/item3.html
//   Also the International Nucleotide Sequence Database Collaboration (INSDC)
//   (i.e. GenBank, EMBL, DDBJ) adopted this in 2006
//   http://www.ddbj.nig.ac.jp/insdc/icm2006-e.html
//
//   Xle (J); Leucine or Isoleucine
//   The residue abbreviations, Xle (the three-letter abbreviation) and J
//   (the one-letter abbreviation) are reserved for the case that cannot
//   experimentally distinguish leucine from isoleucine.
//
//   U = "Sec";  selenocysteine
//   http://www.chem.qmul.ac.uk/iubmb/newsletter/1999/item3.html
//
//   O = "Pyl";  pyrrolysine
//   http://www.chem.qmul.ac.uk/iubmb/newsletter/2009.html#item35

export const proteinLetters1to3 = {
  A: 'Ala',
  C: 'Cys',
  D: 'Asp',
  E: 'Glu',
  F: 'Phe',
  G: 'Gly',
  H: 'His',
  I: 'Ile',
  K: 'Lys',
  L: 'Leu',
  M: 'Met',
  N: 'Asn',
  P: 'Pro',
  Q: 'Gln',
  R: 'Arg',
  S: 'Ser',
  T: 'Thr',
  V: 'Val',
  W: 'Trp',
  Y: 'Tyr',
};
export const proteinLetters1to3Extended = {
  ...proteinLetters1to3,
  ...{
    B: 'Asx',
    J: 'Xle',
    O: 'Pyl',
    U: 'Sec',
    X: 'Xaa',
    Z: 'Glx',
  },
};

export const proteinLetters3to1 = Object.assign(
  {},
  ...Object.entries(proteinLetters1to3).map(([a, b]) => ({ [b]: a })),
);

export const proteinLetters3to1Extended = Object.assign(
  {},
  ...Object.entries(proteinLetters1to3Extended).map(([a, b]) => ({ [b]: a })),
);

export const ambiguousDnaLetters = 'GATCRYWSMKHBVDN';
export const unambiguousDnaLetters = 'GATC';
export const ambiguousRnaLetters = 'GAUCRYWSMKHBVDN';
export const unambiguousRnaLetters = 'GAUC';

//   B == 5-bromouridine
//   D == 5,6-dihydrouridine
//   S == thiouridine
//   W == wyosine
export const extendedDnaLetters = 'GATCBDSW';

// "X" is included in the following _values and _complement dictionaries,
// for historical reasons although it is not an IUPAC nucleotide,
// and so is not in the corresponding _letters strings above
export const ambiguousDnaValues = {
  A: 'A',
  B: 'CGT',
  C: 'C',
  D: 'AGT',
  G: 'G',
  H: 'ACT',
  K: 'GT',
  M: 'AC',
  N: 'GATC',
  R: 'AG',
  S: 'CG',
  T: 'T',
  V: 'ACG',
  W: 'AT',
  X: 'GATC',
  Y: 'CT',
} as const;

export const ambiguousRnaValues = {
  A: 'A',
  B: 'CGU',
  C: 'C',
  D: 'AGU',
  G: 'G',
  H: 'ACU',
  K: 'GU',
  M: 'AC',
  N: 'GAUC',
  R: 'AG',
  S: 'CG',
  U: 'U',
  V: 'ACG',
  W: 'AU',
  X: 'GAUC',
  Y: 'CU',
} as const;

export const ambiguousDnaComplement = {
  A: 'T',
  B: 'V',
  C: 'G',
  D: 'H',
  G: 'C',
  H: 'D',
  K: 'M',
  M: 'K',
  N: 'N',
  R: 'Y',
  S: 'S',
  T: 'A',
  V: 'B',
  W: 'W',
  X: 'X',
  Y: 'R',
} as const;

export const ambiguousRnaComplement = {
  A: 'U',
  B: 'V',
  C: 'G',
  D: 'H',
  G: 'C',
  H: 'D',
  K: 'M',
  M: 'K',
  N: 'N',
  R: 'Y',
  S: 'S',
  U: 'A',
  V: 'B',
  W: 'W',
  X: 'X',
  Y: 'R',
} as const;

// Mass data taken from PubChem

// Average masses of monophosphate deoxy nucleotides
export const unambiguousDnaWeights = {
  A: 331.2218,
  C: 307.1971,
  G: 347.2212,
  T: 322.2085,
} as const;

// Monoisotopic masses of monophospate deoxy nucleotides
export const monoisotopicUnambiguousDnaWeights = {
  A: 331.06817,
  C: 307.056936,
  G: 347.063084,
  T: 322.056602,
} as const;

export const unambiguousRnaWeights = {
  A: 347.2212,
  C: 323.1965,
  G: 363.2206,
  U: 324.1813,
} as const;

export const monoisotopicUnambiguousRnaWeights = {
  A: 347.063084,
  C: 323.051851,
  G: 363.057999,
  U: 324.035867,
} as const;

export const proteinWeights = {
  A: 89.0932,
  C: 121.1582,
  D: 133.1027,
  E: 147.1293,
  F: 165.1891,
  G: 75.0666,
  H: 155.1546,
  I: 131.1729,
  K: 146.1876,
  L: 131.1729,
  M: 149.2113,
  N: 132.1179,
  O: 255.3134,
  P: 115.1305,
  Q: 146.1445,
  R: 174.201,
  S: 105.0926,
  T: 119.1192,
  U: 168.0532,
  V: 117.1463,
  W: 204.2252,
  Y: 181.1885,
};

export const monoisotopicProteinWeights = {
  A: 89.047678,
  C: 121.019749,
  D: 133.037508,
  E: 147.053158,
  F: 165.078979,
  G: 75.032028,
  H: 155.069477,
  I: 131.094629,
  K: 146.105528,
  L: 131.094629,
  M: 149.051049,
  N: 132.053492,
  O: 255.158292,
  P: 115.063329,
  Q: 146.069142,
  R: 174.111676,
  S: 105.042593,
  T: 119.058243,
  U: 168.964203,
  V: 117.078979,
  W: 204.089878,
  Y: 181.073893,
};

export const extendedProteinValues = {
  A: 'A',
  B: 'ND',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'IL',
  K: 'K',
  L: 'L',
  M: 'M',
  N: 'N',
  O: 'O',
  P: 'P',
  Q: 'Q',
  R: 'R',
  S: 'S',
  T: 'T',
  U: 'U',
  V: 'V',
  W: 'W',
  X: 'ACDEFGHIKLMNPQRSTVWY',
  Y: 'Y',
  Z: 'QE',
};

// For Center of Mass Calculation.
// Taken from http://www.chem.qmul.ac.uk/iupac/AtWt/ & PyMol
// tslint:disable: object-literal-sort-keys
export const atomWeights = {
  H: 1.00794,
  D: 2.0141,
  He: 4.002602,
  Li: 6.941,
  Be: 9.012182,
  B: 10.811,
  C: 12.0107,
  N: 14.0067,
  O: 15.9994,
  F: 18.9984032,
  Ne: 20.1797,
  Na: 22.98977,
  Mg: 24.305,
  Al: 26.981538,
  Si: 28.0855,
  P: 30.973761,
  S: 32.065,
  Cl: 35.453,
  Ar: 39.948,
  K: 39.0983,
  Ca: 40.078,
  Sc: 44.95591,
  Ti: 47.867,
  V: 50.9415,
  Cr: 51.9961,
  Mn: 54.938049,
  Fe: 55.845,
  Co: 58.9332,
  Ni: 58.6934,
  Cu: 63.546,
  Zn: 65.39,
  Ga: 69.723,
  Ge: 72.64,
  As: 74.9216,
  Se: 78.96,
  Br: 79.904,
  Kr: 83.8,
  Rb: 85.4678,
  Sr: 87.62,
  Y: 88.90585,
  Zr: 91.224,
  Nb: 92.90638,
  Mo: 95.94,
  Tc: 98.0,
  Ru: 101.07,
  Rh: 102.9055,
  Pd: 106.42,
  Ag: 107.8682,
  Cd: 112.411,
  In: 114.818,
  Sn: 118.71,
  Sb: 121.76,
  Te: 127.6,
  I: 126.90447,
  Xe: 131.293,
  Cs: 132.90545,
  Ba: 137.327,
  La: 138.9055,
  Ce: 140.116,
  Pr: 140.90765,
  Nd: 144.24,
  Pm: 145.0,
  Sm: 150.36,
  Eu: 151.964,
  Gd: 157.25,
  Tb: 158.92534,
  Dy: 162.5,
  Ho: 164.93032,
  Er: 167.259,
  Tm: 168.93421,
  Yb: 173.04,
  Lu: 174.967,
  Hf: 178.49,
  Ta: 180.9479,
  W: 183.84,
  Re: 186.207,
  Os: 190.23,
  Ir: 192.217,
  Pt: 195.078,
  Au: 196.96655,
  Hg: 200.59,
  Tl: 204.3833,
  Pb: 207.2,
  Bi: 208.98038,
  Po: 208.98,
  At: 209.99,
  Rn: 222.02,
  Fr: 223.02,
  Ra: 226.03,
  Ac: 227.03,
  Th: 232.0381,
  Pa: 231.03588,
  U: 238.02891,
  Np: 237.05,
  Pu: 244.06,
  Am: 243.06,
  Cm: 247.07,
  Bk: 247.07,
  Cf: 251.08,
  Es: 252.08,
  Fm: 257.1,
  Md: 258.1,
  No: 259.1,
  Lr: 262.11,
  Rf: 261.11,
  Db: 262.11,
  Sg: 266.12,
  Bh: 264.12,
  Hs: 269.13,
  Mt: 268.14,
};
// tslint:enable: object-literal-sort-keys
