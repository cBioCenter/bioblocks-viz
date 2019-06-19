const nucleotideData = [
  { lower: 'a', upper: 'A', fullName: 'Adenine' },
  { lower: 't', upper: 'T', fullName: 'Thymine' },
  { lower: 'g', upper: 'G', fullName: 'Guanine' },
  { lower: 'c', upper: 'C', fullName: 'Cytosine' },
  { lower: 'u', upper: 'U', fullName: 'Uracil' },
  { lower: '-', upper: '-', fullName: 'UNKNOWN' },
] as const;

const fullNames = () => nucleotideData.map(nuc => nuc.fullName);
const lowerCodes = () => nucleotideData.map(nuc => nuc.lower);
const upperCodes = () => nucleotideData.map(nuc => nuc.upper);

type LOWER_CODES = keyof { [K in (ReturnType<typeof lowerCodes>)[number]]: string };
export type NUCLEOTIDE_SINGLE_LETTER_CODES = keyof { [K in (ReturnType<typeof upperCodes>)[number]]: string };
export type NUCLEOTIDE_FULL_NAME = keyof { [K in (ReturnType<typeof fullNames>)[number]]: string };

export interface INucleotide {
  fullName: NUCLEOTIDE_FULL_NAME;
  singleLetterCode: NUCLEOTIDE_SINGLE_LETTER_CODES;
}

export const Nucleotides: INucleotide[] = nucleotideData.map(nuc => ({
  fullName: nuc.fullName,
  singleLetterCode: nuc.upper,
}));

export const NUCLEOTIDE_BY_CODE = nucleotideData.reduce<
  Record<NUCLEOTIDE_SINGLE_LETTER_CODES | LOWER_CODES, INucleotide>
>(
  (acc, nuc) => {
    const nucleotide = {
      fullName: nuc.fullName,
      singleLetterCode: nuc.upper,
    };
    acc[nuc.lower] = nucleotide;
    acc[nuc.upper] = nucleotide;

    return acc;
  },
  {} as any,
);
