import { AMINO_ACID_BY_CODON, AMINO_ACID_BY_FULL_NAME, AMINO_ACID_CODONS, AminoAcids } from './AminoAcid';

type singleLetterCode = 'a' | 't' | 'g' | 'c' | 'u' | 'a' | 'T' | 'G' | 'C' | 'U' | '-';
type fullNucleotideName = 'adenine' | 'cytosine' | 'guanine' | 'thymine' | 'uracil' | 'UNKNOWN';

interface INucleotide {
  singleLetterCode: singleLetterCode;
  fullName: fullNucleotideName;
}

export class NucleotideHelper {
  public static getInstance() {
    this.instance = new NucleotideHelper();

    return this.instance;
  }
  private static instance: NucleotideHelper;
  private NT_BY_NAME: { [key: string]: INucleotide };
  private NT_BY_CODE: Record<singleLetterCode, INucleotide>;

  private constructor() {
    const ALL_NUCLEOTIDES: INucleotide[] = [
      { singleLetterCode: 'a', fullName: 'adenine' },
      { singleLetterCode: 't', fullName: 'cytosine' },
      { singleLetterCode: 'g', fullName: 'guanine' },
      { singleLetterCode: 'c', fullName: 'thymine' },
      { singleLetterCode: 'u', fullName: 'uracil' },
      { singleLetterCode: '-', fullName: 'UNKNOWN' },
    ];
    this.NT_BY_NAME = {};
    this.NT_BY_CODE = ALL_NUCLEOTIDES.reduce<Record<singleLetterCode, INucleotide>>((acc, nuc) => {
      acc[nuc.singleLetterCode] = nuc;

      return acc;
    }, {});

    for (const nt of ALL_NUCLEOTIDES) {
      this.NT_BY_NAME[nt.fullName] = nt;
      this.NT_BY_CODE[nt.singleLetterCode] = nt;
      this.NT_BY_CODE[nt.singleLetterCode.toUpperCase() as singleLetterCode] = nt;
    }
  }
}

export const enum SEQ_TYPES {
  'DNA',
  'RNA',
  'PROTEIN',
}

// tslint:disable-next-line: max-classes-per-file
export class ISeq {
  public seqType: SEQ_TYPES | undefined;
  constructor(readonly sequence: string, seqType?: SEQ_TYPES) {
    this.sequence = sequence;
    this.seqType = seqType;
  }

  public upper(): ISeq {
    return new ISeq(this.sequence.toUpperCase());
  }
  public lower(): ISeq {
    return new ISeq(this.sequence.toLowerCase());
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ISeqDNA extends ISeq {
  private complimentDict: {
    [key: string]: string;
  } = {
    a: 't',
    t: 'a',
    g: 'c',
    c: 'g',
    A: 'T',
    T: 'A',
    G: 'G',
    C: 'C',
    '-': '-',
  };
  constructor(readonly sequence: string) {
    super(sequence, SEQ_TYPES.DNA);
    this.complimentDict.z;
  }

  public subsequence(start = 0, end?: number): ISeqDNA {
    return new ISeqDNA(this.sequence.substring(start, end));
  }

  public compliment(): ISeqDNA {
    return new ISeqDNA(
      this.sequence
        .split('')
        .map(nucleotide => {
          return this.complimentDict[nucleotide];
        })
        .join(),
    );
  }

  public reverseCompliment(): ISeqDNA {
    return new ISeqDNA(
      this.sequence
        .split('')
        .reverse()
        .map(nucleotide => {
          return this.complimentDict[nucleotide];
        })
        .join(),
    );
  }

  public translate(to_stop = false): ISeqProtein {
    const codonArr = this.sequence.match(/.{1,3}/g);
    if (!codonArr) {
      // sequence length must be less than 3. return an empty protein.
      return new ISeqProtein('');
    }

    return new ISeqProtein(
      codonArr
        .reduce((accumulator, codon) => {
          if (codon.length === 3) {
            accumulator.push(AMINO_ACID_BY_CODON[codon.toUpperCase() as AMINO_ACID_CODONS].singleLetterCode);
          }

          return accumulator;
        }, new Array<string>())
        .join(),
    );
  }
  // transcribe(): ISeqNucleotides;
  // translate(startingOffset: number): ISeqAminoacids;
}

// tslint:disable-next-line: max-classes-per-file
export class ISeqProtein extends ISeq {
  private aaList: string[] = AminoAcids.map(aa => aa.singleLetterCode);

  constructor(readonly sequence: string) {
    super(sequence.toUpperCase(), SEQ_TYPES.PROTEIN);

    this.sequence.split('').forEach(aa => {
      if (aa in this.aaList === false) {
        throw new Error(`Invalid amino acid provided for protein sequence: "${aa}"`);
      }
    });
  }

  public toBinary(): number[] {
    /*
     * Returns a copy of this sequence in binary. The length of the
     * array is 21 times the number of amino acids. Each chunck of 21
     * positions are all zero except a single bin that is 1.
     */
    return this.sequence.split('').reduce((binAccumulator, aaCode) => {
      const arr = new Array(21).fill(0);
      arr[this.aaList.indexOf(aaCode)] = 1;
      binAccumulator.push(...arr);

      return binAccumulator;
    }, new Array<number>());
  }

  public toInteger(): number[] {
    /*
     * Returns a copy of this sequence in integer form. The length of the
     * array is the same as the number of amino acids. The values have no
     * meaning other than to check for equality in the binary hamming
     * distance function
     */
    return this.sequence.split('').reduce((binAccumulator, aaCode) => {
      const arr = new Array(21).fill(0);
      arr[this.aaList.indexOf(aaCode)] = 1;
      binAccumulator.push(...arr);

      return binAccumulator;
    }, new Array<number>());
  }
}

export class BioblocksSeqRecord {
  constructor(
    seq,
    id = '<unknown id>',
    name = '<unknown name>',
    description = '<unknown description>',
    dbxrefs = None,
    features = None,
    annotations = None,
    letter_annotations = None,
  );
}

export interface IFastaSequenceEntry<T> {
  title: string;
  aaSequence: string;
  getFoo(): T extends 'foo' ? { foo: number } : T extends string ? boolean : number;
}

export interface IFoo extends IFastaSequenceEntry<string> {
  word: string;
}

const fooFasta: IFastaSequenceEntry<'foo'>;
fooFasta.getFoo();

export class FastaFile {
  public static getBinarySequenceFromAASequence(aaSequence: string) {
    return aaSequence.split('').reduce((binAccumulator, aaCode) => {
      const arr = new Array(21).fill(0);
      arr[FastaFile.aaList.indexOf(aaCode)] = 1;
      binAccumulator.push(...arr);

      return binAccumulator;
    }, new Array<number>());
  }
  public static fromFileText(fileText: string) {
    // parse fasta file line by line
    const sequences = fileText.split(/\r|\n/).reduce((accumulator, line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 0) {
        if (trimmedLine[0] === '>') {
          accumulator.push({
            aaSequence: '',
            binaryAASequence: [],
            title: trimmedLine.substr(1),
          });
        } else if (accumulator.length > 0) {
          const aaSequnceOnLine = trimmedLine.replace(/\./g, '-').toUpperCase();
          accumulator[accumulator.length - 1].aaSequence += aaSequnceOnLine;
          accumulator[accumulator.length - 1].binaryAASequence.push(
            ...FastaFile.getBinarySequenceFromAASequence(aaSequnceOnLine),
          );
        }
      }

      return accumulator;
    }, new Array<IFastaSequenceEntry>());

    return new FastaFile(sequences);
  }

  private static aaList = 'ACDEFGHIKLMNPQRSTVWY-';
  private sequences: IFastaSequenceEntry[];

  constructor(sequences: IFastaSequenceEntry[]) {
    this.sequences = sequences;
  }

  public getSequenceObjects() {
    return this.sequences;
  }

  public getBinarySequencesFlat() {
    return this.sequences.map(seqEntry => {
      return seqEntry.binaryAASequence;
    });
  }

  public getIntegerAASequences() {
    // Returns an array of integer arrays. Each integer array represents
    // a single sequence. The values  have no meaning other than to check
    // for equality in a hamming distance function.
    return this.sequences.map(seqEntry => {
      return seqEntry.aaSequence.split('').map(aaCode => {
        return FastaFile.aaList.indexOf(aaCode);
      });
    });
  }

  public getRandomSetOfSequences(n: number) {
    // randomly select "n" sequences from this FastaFile's sequences and
    // return a new FastaFile object with the new random set. If "n" is
    // larger than the number of sequences, return all sequences.
    if (n > this.sequences.length) {
      return new FastaFile([...this.sequences]);
    }
    let sequenceBowl = [...this.sequences];
    const randomSequences = new Array<IFastaSequenceEntry>();
    while (randomSequences.length < n) {
      // tslint:disable-next-line: insecure-random
      const randomIdx = Math.floor(Math.random() * sequenceBowl.length); // btw 0 and length of in sequenceBowl
      randomSequences.push(sequenceBowl[randomIdx]);
      sequenceBowl = sequenceBowl.reduce((accumulator, currentValue, currentIdx) => {
        if (currentIdx !== randomIdx) {
          accumulator.push(currentValue);
        }

        return accumulator;
      }, new Array<IFastaSequenceEntry>());
    }

    return new FastaFile(randomSequences);
  }
}
