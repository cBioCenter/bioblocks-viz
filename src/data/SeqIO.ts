import { ALPHABET, Seq, SeqRecord } from '~bioblocks-viz~/data/';

export const enum SEQUENCE_FILE_TYPES {
  'fasta',
  // 'fastq'
}

/**
 * General sequence Input and Output functions
 *
 * @export
 */
// tslint:disable-next-line: no-unnecessary-class
export class SeqIO {
  public static readonly DEFAULT_SEQ_PROPERTIES = {
    alphabet: undefined, // alphabet for all sequences (from Seq.ALPHABET)
    ignoredCharacters: [], // characters that should be ignored if validating sequences match alphabet
  };

  public static parseFile(
    fileText: string,
    fileType: SEQUENCE_FILE_TYPES,
    seqProperties?: Partial<typeof SeqIO.DEFAULT_SEQ_PROPERTIES>,
  ): SeqRecord[] {
    const seqAnnotations = {
      ...SeqIO.DEFAULT_SEQ_PROPERTIES,
      ...seqProperties,
    };

    const sequences = new Array<{
      annotations: Partial<typeof SeqRecord.DEFAULT_ANNOTATIONS>;
      sequence: string;
    }>();

    if (fileType === SEQUENCE_FILE_TYPES.fasta) {
      const seqObject = fileText.split(/\r|\n|\r\n/).reduce((accumulator, line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.length > 0) {
          if (trimmedLine[0] === '>') {
            accumulator.push({
              annotations: { name: trimmedLine.substr(1) },
              sequence: '',
            });
          } else if (accumulator.length > 0) {
            const sequnceOnLine = trimmedLine.replace(/\./g, '-');
            accumulator[accumulator.length - 1].sequence += sequnceOnLine;
          }
        }

        return accumulator;
      }, sequences);
    } else {
      throw Error(`File type "${fileType}" not recognized`);
    }

    return sequences.map(seqObj => {
      const alphabet = seqAnnotations.alphabet;
      const ignoredCharacters = seqAnnotations.ignoredCharacters;

      return new SeqRecord(new Seq(seqObj.sequence, seqAnnotations.alphabet, seqAnnotations.ignoredCharacters), {
        id: seqObj.annotations.id,
        name: seqObj.annotations.name,
      });
    });
  }

  public static getRandomSetOfSequences(sequences: SeqRecord[], n: number) {
    // todo move out of here.
    // randomly select "n" sequences and return a new array of SeqRecords.
    // If "n" is larger than the number of sequences, return all sequences.
    const sequenceBowl = [...sequences];
    if (n > sequences.length) {
      return sequenceBowl;
    }

    const randomSequences = new Array<SeqRecord>();
    while (randomSequences.length < n) {
      // tslint:disable-next-line: insecure-random
      const randomIdx = Math.floor(Math.random() * sequenceBowl.length); // btw 0 and length of in sequenceBowl
      randomSequences.push(sequenceBowl[randomIdx]);
      sequenceBowl.splice(randomIdx, 1);
    }

    return randomSequences;
  }
}

// console.log(SeqIO.parseFile('>my new name\ratgcatgc\n>seq2\natgcAAA', SEQUENCE_FILE_TYPES.fasta));
