import { Seq } from '~bioblocks-viz~/data/';

/**
 * SeqRecord
 * This is a super class that provides additional annotation on top
 * of the standard Seq class.
 *
 * Inspired from BioPython SeqRecord.py:
 *     https://github.com/biopython/biopython/blob/master/Bio/SeqRecord.py
 *     which is under the BSD 3-Clause License
 */
export class SeqRecord extends Seq {
  public static readonly DEFAULT_ANNOTATIONS = {
    dbxrefs: [], // Database cross references
    description: '<unknown description>', // Sequence description
    id: '<unknown id>', // Sequence identifier
    letterAnnotations: {}, // Dictionary of per-letter-annotations, values
    // should be strings, list or tuples of the same
    // length as the full sequence
    metadata: {} = {}, // Dictionary of arbitrary metadata for the whole sequence
    name: '<unknown name>', // Sequence name
  };

  constructor(sequence: Seq, readonly annotations: Partial<typeof SeqRecord.DEFAULT_ANNOTATIONS> = {}) {
    super(sequence.sequence, sequence.alphabet, sequence.ignoredCharacters);
    this.annotations = {
      ...SeqRecord.DEFAULT_ANNOTATIONS,
      ...annotations,
    };

    // Many of the Seq methods return copies of the Seq instance. In order to do so for
    // the SeqRecord class, we override each function to call the parent method and
    // then return a SeqRecord copy. Slightly convoluted but it allows us to (1) return
    // copies of the objects rather than mutate the objects and (2) keeps us from
    // having to manually override each individual method in the SeqRecord.
    Object.keys(Seq.prototype).forEach(func => {
      const functionKey = func as keyof typeof Seq.prototype;
      const property = Reflect.getOwnPropertyDescriptor(Seq.prototype, func);
      if (typeof this[functionKey] === 'function' && property && property.writable) {
        Reflect.set(this, functionKey, (...args: any[]) => {
          // @ts-ignore
          const parentReturned = super[functionKey](args);
          if (parentReturned instanceof Seq) {
            return new SeqRecord(parentReturned, annotations);
          }

          return parentReturned;
        });
      }
    });
  }
}
