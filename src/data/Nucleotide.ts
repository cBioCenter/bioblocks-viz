export class Nucleotide {
  public static A = new Nucleotide('Adenine', 'A');
  public static C = new Nucleotide('Cytosine', 'C');
  public static G = new Nucleotide('Guanine', 'G');
  public static T = new Nucleotide('Thymine', 'T');
  public static U = new Nucleotide('Uracil', 'U');
  public static UKN = new Nucleotide('Unknown', '-');

  public static Adenine = Nucleotide.A;
  public static Cytosine = Nucleotide.C;
  public static Guanine = Nucleotide.G;
  public static Thymine = Nucleotide.T;
  public static Uracil = Nucleotide.U;
  public static Unknown = Nucleotide.UKN;

  public static readonly allNucleotides = [
    Nucleotide.A,
    Nucleotide.C,
    Nucleotide.G,
    Nucleotide.T,
    Nucleotide.U,
    Nucleotide.UKN,
  ];

  public static fromSingleLetterCode(code: string) {
    const nt = Nucleotide.allNucleotides.find(ntFocus => {
      return ntFocus.singleLetterCode.toUpperCase() === code.toUpperCase();
    });

    return nt ? nt : Nucleotide.Unknown;
  }

  public static fromFullName(fullName: string) {
    const nt = Nucleotide.allNucleotides.find(ntFocus => {
      return ntFocus.fullName.toUpperCase() === fullName.toUpperCase();
    });

    return nt ? nt : Nucleotide.Unknown;
  }

  private constructor(readonly fullName: string, readonly singleLetterCode: string) {}

  public getComplementDNA() {
    if (this === Nucleotide.A) {
      return Nucleotide.T;
    } else if (this === Nucleotide.T) {
      return Nucleotide.A;
    } else if (this === Nucleotide.G) {
      return Nucleotide.C;
    } else if (this === Nucleotide.C) {
      return Nucleotide.G;
    }

    return Nucleotide.Unknown;
  }
  public getComplementRNA() {
    if (this === Nucleotide.T) {
      return Nucleotide.U;
    } else if (this === Nucleotide.U) {
      return Nucleotide.T;
    }

    return this.getComplementDNA();
  }
}
