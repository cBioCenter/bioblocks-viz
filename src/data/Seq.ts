import {
  ambiguousDnaComplement,
  ambiguousRnaComplement,
  CodonTable,
  proteinLetters,
  standardDnaCodonTable,
  standardRnaCodonTable,
  unambiguousDnaLetters,
  unambiguousRnaLetters,
} from '~bioblocks-viz~/data/';

export const enum ALPHABET {
  'generic_dna',
  'generic_rna',
  'generic_protein',
}

/**
 * Seq
 * Provide objects to represent biological sequences with alphabets.
 */
export class Seq {
  /**
   * checkSequenceValidity
   * This convenience method will check whether a sequence contains only the characters
   * in a particular string. Useful for asking whether a sequence contains only valid
   * amino acids or nucleotides. Case insensitive.
   *
   * @param sequence the sequence to evaluate.
   * @param validSequenceString a string that contains all the valid letters for this
   *                            sequence e.g., IUPACData protein_letters.
   * @param ignoredCharacters a list of characters to ignore in determining whether the
   *                          sequence is valid e.g., a dash that represents a gap.
   */
  private static checkSequenceValidity(sequence: string, validSequenceString: string, ignoredCharacters: string[]) {
    // note - the 'replace' function removes all duplicate characters - https://stackoverflow.com/questions/19301806
    const ignoredCharString = `${ignoredCharacters
      .join()
      .toLowerCase()}${ignoredCharacters.join().toUpperCase()}`.replace(/(.)(?=.*\1)/g, '');

    return new RegExp(
      `^[${validSequenceString.toLowerCase()}${validSequenceString.toUpperCase()}${ignoredCharString}]+$`,
    ).test(sequence);
  }
  public readonly alphabet: ALPHABET | undefined;
  public readonly sequence: string;
  public readonly ignoredCharacters: string[];

  /**
   * Create a new Seq object.
   * @param sequence A representation of the sequence as a string.
   * @param alphabet The type of sequence.
   * @param ignoredCharacters Characters that should be ignored in the sequence such
   *                          as a gap "-".
   * @throws an error if the alphabet is declared, but it doesn't match the sequence.
   */
  constructor(sequence: string, alphabet?: ALPHABET, ignoredCharacters: string[] = ['-']) {
    this.sequence = sequence;
    this.alphabet = alphabet;
    this.ignoredCharacters = ignoredCharacters ? ignoredCharacters : [];

    if (this.alphabet === ALPHABET.generic_dna && this.isValidDNA(this.ignoredCharacters) === false) {
      throw Error(`Cannot create DNA Seq from sequence "${this.sequence}"`);
    }
    if (this.alphabet === ALPHABET.generic_rna && this.isValidRNA(this.ignoredCharacters) === false) {
      throw Error(`Cannot create RNA Seq from sequence "${this.sequence}"`);
    }
    if (this.alphabet === ALPHABET.generic_protein && this.isValidProtein(this.ignoredCharacters) === false) {
      throw Error(`Cannot create Protein Seq from sequence "${this.sequence}"`);
    }
  }

  public isValidProtein(ignoredCharacters: string[] = this.ignoredCharacters) {
    return Seq.checkSequenceValidity(this.sequence, proteinLetters, ignoredCharacters);
  }

  public isValidDNA(ignoredCharacters: string[] = this.ignoredCharacters) {
    return Seq.checkSequenceValidity(this.sequence, unambiguousDnaLetters, ignoredCharacters);
  }

  public isValidRNA(ignoredCharacters: string[] = this.ignoredCharacters) {
    return Seq.checkSequenceValidity(this.sequence, unambiguousRnaLetters, ignoredCharacters);
  }

  /**
   * Determine the alphabet of the sequence. If this.alphabet is already set, return
   * it directly, otherwise attempt to predict the alphabet. Not perfect - for example
   * if the sequence only has 'agc' then it returns DNA even though this would
   * be a valid protein or RNA. Preference order is DNA, RNA, then protein.
   * Only canonical nucleotides and protein sequences are evaluated (not ambiguous).
   * @param ignoredCharacters: an array of characters to ignore in the
   *                           assignment. Defaults to dash only (gaps).
   */
  public determineAlphabet(ignoredCharacters: string[] = ['-']): ALPHABET | undefined {
    if (this.alphabet) {
      return this.alphabet;
    }

    if (this.isValidDNA(ignoredCharacters)) {
      return ALPHABET.generic_dna;
    }
    if (this.isValidRNA(ignoredCharacters)) {
      return ALPHABET.generic_rna;
    }
    if (this.isValidProtein(ignoredCharacters)) {
      return ALPHABET.generic_protein;
    }

    return undefined;
  }

  /**
   * Test for equality between two sequences - case insensitive. this.ignoredCharacters are
   * not evaluated in the equality comparison.
   * @param seqToCompare the sequence to compare this object to
   * @returns true if the sequences and their alphabets are equal, false otherwise.
   */
  public equal(seqToCompare: Seq): boolean {
    if (this.alphabet !== seqToCompare.alphabet || this.sequence.length !== seqToCompare.sequence.length) {
      return false;
    }

    return this.sequence.toUpperCase() === seqToCompare.sequence.toUpperCase(); // case ignored.
  }

  /**
   * Returns a binary representation of this sequence.
   *
   * Characters not in the alphabet (20 single letter amino acids and 4 nucleotide
   * characters) or that are not a dash are ignored by default. This means that the
   * array for these positions will be all zeros. Other characters will
   * be included if added to the "additionalAcceptedCharacters" array parameter.
   *
   * @param additionalAcceptedCharacters characters that should be considered valid and
   *                                     included in the return array.
   * @returns a binary array that is a concatenation of each position's individual
   *          binary array:
   *     for proteins - each position is represented by a binary array of length 20 plus
   *                    the number of additional characters (parameter). A single one of
   *                    the indices will be one and the rest zero.
   *     for oligos   - each position is represented by a binary array of length 4 plus
   *                    the number of additional characters (parameter).  A single one of
   *                    the indices will be one and the rest zero.
   *    NOTE: the index that is set to 1 is arbitrary but will be consistent with each
   *          function call - it is set from indexing the strings in IUPACData:
   *          protein_letters, unambiguous_dna_letters and unambiguous_rna_letters
   */
  public binaryRepresntation(additionalAcceptedCharacters: string[] = ['-']): number[] {
    const alphabet = this.determineAlphabet(additionalAcceptedCharacters);
    let idxString = proteinLetters;
    if (alphabet === ALPHABET.generic_dna) {
      idxString = unambiguousDnaLetters;
    } else if (alphabet === ALPHABET.generic_rna) {
      idxString = unambiguousRnaLetters;
    }

    idxString += additionalAcceptedCharacters.join();
    idxString = idxString.toUpperCase();
    const positionArrayLength = idxString.length;

    const sequenceTemplate = this.sequence.toUpperCase();

    return sequenceTemplate.split('').reduce((binAccumulator, ntOrAACode) => {
      const arr = new Array(positionArrayLength).fill(0);
      if (idxString.includes(ntOrAACode)) {
        arr[idxString.indexOf(ntOrAACode)] = 1;
      }
      binAccumulator.push(...arr);

      return binAccumulator;
    }, new Array<number>());
  }

  /**
   * integerRepresntation
   * Returns an integer representation of this sequence. Each index in the array
   * represents a single position. ** The values have no meaning other than to check
   * for equality in a custom hamming distance function. **
   *
   * Characters not found will be represented as -1 in the returned array
   *
   * @param additionalAcceptedCharacters characters to consider valid and add to
   *                                     give  returned array.
   */
  public integerRepresntation(additionalAcceptedCharacters: string[] = ['-']): number[] {
    const alphabet = this.determineAlphabet(additionalAcceptedCharacters);
    let idxString = proteinLetters;
    if (alphabet === ALPHABET.generic_dna) {
      idxString = unambiguousDnaLetters;
    } else if (alphabet === ALPHABET.generic_rna) {
      idxString = unambiguousRnaLetters;
    }

    idxString += additionalAcceptedCharacters.join();
    idxString = idxString.toUpperCase();

    const sequenceTemplate = this.sequence.toUpperCase();

    return sequenceTemplate.split('').map(ntOrAACode => {
      return idxString.indexOf(ntOrAACode);
    }, new Array<number>());
  }

  public toString(): string {
    return this.sequence;
  }

  public upper(): Seq {
    return new Seq(this.sequence.toUpperCase(), this.alphabet);
  }
  public lower(): Seq {
    return new Seq(this.sequence.toLowerCase(), this.alphabet);
  }
  public subSequence(startIdx: number = 0, endIdx?: number) {
    return new Seq(this.sequence.slice(startIdx, endIdx), this.alphabet);
  }

  /**
   * complement()
   * Return the complement sequence by creating a new Seq object.
   * @param reverse if true, will return the sequence reversed
   * @returns a new sequence complemented from this sequence
   * @throws errors if this sequence is not valid DNA or RNA.
   */
  public complement(reverse = false): Seq {
    if (this.alphabet === ALPHABET.generic_protein) {
      throw Error(`Proteins do not have complements!`);
    } else if (
      (this.sequence.includes('U') || this.sequence.includes('u')) &&
      (this.sequence.includes('T') || this.sequence.includes('t'))
    ) {
      throw Error(`Mixed RNA/DNA found`);
    }

    let table: { [key: string]: string } = ambiguousDnaComplement;
    let newAlphabet = ALPHABET.generic_dna;
    if (this.sequence.includes('U') || this.sequence.includes('u')) {
      // rna complement
      table = ambiguousRnaComplement;
      newAlphabet = ALPHABET.generic_rna;
    }
    const sequenceTemplate = reverse
      ? this.sequence
          .split('')
          .reverse()
          .join()
      : this.sequence;

    return new Seq(
      sequenceTemplate
        .split('')
        .map(nt => {
          if (this.ignoredCharacters.includes(nt)) {
            return nt;
          }

          const upperNT = nt.toUpperCase();
          if (upperNT === nt) {
            return table[upperNT];
          }

          return table[upperNT].toLowerCase();
        })
        .join(''),
      newAlphabet,
      this.ignoredCharacters,
    );
  }

  /**
   * reverse_complement()
   * Return the reverse complement sequence by creating a new Seq object.
   */
  public reverse_complement(): Seq {
    return this.complement(true);
  }
  /**
   * transcribe()
   * Return the RNA sequence from a DNA sequence by creating a new Seq object
   */
  public transcribe(): Seq {
    if (this.alphabet === ALPHABET.generic_protein) {
      throw Error(`Proteins sequences cannot be transcribed!`);
    }

    return new Seq(this.sequence.replace(/T/g, 'U').replace(/t/g, 'u'), ALPHABET.generic_rna);
  }

  /**
   * back_transcribe()
   * Return the DNA sequence from an RNA sequence by creating a new Seq object
   */
  public back_transcribe(): Seq {
    if (this.alphabet === ALPHABET.generic_protein) {
      throw Error(`Proteins sequences cannot be back transcribed!`);
    }

    return new Seq(this.sequence.replace(/U/g, 'T').replace(/u/g, 't'), ALPHABET.generic_dna);
  }

  /**
   * translate(table, stop_symbol='*', to_stop=False, cds=False, gap=None)
   * Turn a nucleotide sequence into a protein sequence by creating a new Seq object
   *     TODO: implement "gap" parameter.
   */
  public translate(stopSymbol: string = '*', toStop: boolean = false, cds: boolean = false): Seq {
    if (this.alphabet === ALPHABET.generic_protein) {
      throw Error(`Proteins sequences cannot be translated!`);
    }

    let codonTable: CodonTable = standardDnaCodonTable;
    if (this.sequence.includes('U') || this.sequence.includes('u')) {
      // rna complement
      codonTable = standardRnaCodonTable;
    }

    const codonArr = this.sequence.match(/.{1,3}/g) as string[];
    if (cds) {
      if (this.sequence.length % 3 !== 0) {
        throw Error(`Invalid coding sequence - sequence length must be a multiple of 3!`);
      }
      if (
        this.sequence.length < 6 ||
        codonArr[0] in codonTable.startCodons === false ||
        codonArr[codonArr.length - 1] in codonTable.stopCodons === false
      ) {
        throw Error(`Invalid coding sequence - sequence must have a valid start and stop codon!`);
      }
    }

    if (!codonArr) {
      // sequence length is be less than 3. return an empty protein.
      return new Seq('', ALPHABET.generic_protein);
    }

    let proteinSequence = '';
    codonArr.forEach(codon => {
      if (codon.length === 3) {
        const upperCodon = codon.toUpperCase();
        if (upperCodon in codonTable.table) {
          proteinSequence += codonTable.table[upperCodon];
        } else if (upperCodon in codonTable.stopCodons) {
          proteinSequence += stopSymbol;
          if (toStop) {
            return;
          }
        }
      }
    });

    return new Seq(proteinSequence, ALPHABET.generic_protein);
  }
}

// console.log(new Seq('auGC').complement());
// console.log(new Seq('atgcW').binaryRepresntation());
// console.log(new Seq('atgcW').integerRepresntation());
