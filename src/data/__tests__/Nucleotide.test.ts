import { Nucleotide } from '~bioblocks-viz~/data';

describe('Nucleotide', () => {
  it('Should allow getting known nucleotides from a single letter.', () => {
    expect(Nucleotide.fromSingleLetterCode('a')).toEqual(Nucleotide.A);
    expect(Nucleotide.fromSingleLetterCode('a')).toEqual(Nucleotide.Adenine);
    expect(Nucleotide.fromSingleLetterCode('A')).toEqual(Nucleotide.A);
    expect(Nucleotide.fromSingleLetterCode('A')).toEqual(Nucleotide.Adenine);

    expect(Nucleotide.fromSingleLetterCode('c')).toEqual(Nucleotide.C);
    expect(Nucleotide.fromSingleLetterCode('c')).toEqual(Nucleotide.Cytosine);
    expect(Nucleotide.fromSingleLetterCode('C')).toEqual(Nucleotide.C);
    expect(Nucleotide.fromSingleLetterCode('C')).toEqual(Nucleotide.Cytosine);

    expect(Nucleotide.fromSingleLetterCode('g')).toEqual(Nucleotide.G);
    expect(Nucleotide.fromSingleLetterCode('g')).toEqual(Nucleotide.Guanine);
    expect(Nucleotide.fromSingleLetterCode('G')).toEqual(Nucleotide.G);
    expect(Nucleotide.fromSingleLetterCode('G')).toEqual(Nucleotide.Guanine);

    expect(Nucleotide.fromSingleLetterCode('t')).toEqual(Nucleotide.T);
    expect(Nucleotide.fromSingleLetterCode('t')).toEqual(Nucleotide.Thymine);
    expect(Nucleotide.fromSingleLetterCode('T')).toEqual(Nucleotide.T);
    expect(Nucleotide.fromSingleLetterCode('T')).toEqual(Nucleotide.Thymine);

    expect(Nucleotide.fromSingleLetterCode('u')).toEqual(Nucleotide.U);
    expect(Nucleotide.fromSingleLetterCode('u')).toEqual(Nucleotide.Uracil);
    expect(Nucleotide.fromSingleLetterCode('U')).toEqual(Nucleotide.U);
    expect(Nucleotide.fromSingleLetterCode('U')).toEqual(Nucleotide.Uracil);
  });

  it('Should allow getting known nucleotides from the full name.', () => {
    expect(Nucleotide.fromFullName('Adenine')).toEqual(Nucleotide.A);
    expect(Nucleotide.fromFullName('Cytosine')).toEqual(Nucleotide.C);
    expect(Nucleotide.fromFullName('Guanine')).toEqual(Nucleotide.G);
    expect(Nucleotide.fromFullName('Thymine')).toEqual(Nucleotide.T);
    expect(Nucleotide.fromFullName('Uracil')).toEqual(Nucleotide.U);
  });

  it('Should allow getting DNA compliments.', () => {
    expect(Nucleotide.A.getComplementDNA()).toEqual(Nucleotide.T);
    expect(Nucleotide.C.getComplementDNA()).toEqual(Nucleotide.G);
    expect(Nucleotide.G.getComplementDNA()).toEqual(Nucleotide.C);
    expect(Nucleotide.T.getComplementDNA()).toEqual(Nucleotide.A);
  });

  it('Should allow getting RNA compliments.', () => {
    expect(Nucleotide.A.getComplementRNA()).toEqual(Nucleotide.T);
    expect(Nucleotide.C.getComplementRNA()).toEqual(Nucleotide.G);
    expect(Nucleotide.G.getComplementRNA()).toEqual(Nucleotide.C);
    expect(Nucleotide.T.getComplementRNA()).toEqual(Nucleotide.U);
    expect(Nucleotide.U.getComplementRNA()).toEqual(Nucleotide.T);
  });

  it('Should return an unknown nucleotide when appropriate.', () => {
    expect(Nucleotide.fromSingleLetterCode('z')).toEqual(Nucleotide.UKN);
    expect(Nucleotide.fromSingleLetterCode('Z')).toEqual(Nucleotide.Unknown);
    expect(Nucleotide.fromFullName('zzz')).toEqual(Nucleotide.UKN);
    expect(Nucleotide.fromFullName('ZZZZ')).toEqual(Nucleotide.Unknown);
    expect(Nucleotide.U.getComplementDNA()).toEqual(Nucleotide.UKN);
  });
});
