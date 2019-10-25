import { Seq, SeqIO, SeqRecord, SEQUENCE_FILE_TYPES } from '~bioblocks-viz~/data';

describe('SeqIO', () => {
  it('Should parse fasta files.', () => {
    const parsedSequence = SeqIO.parseFile('>NERV\nATAT', SEQUENCE_FILE_TYPES.fasta);
    expect(parsedSequence).toHaveLength(1);
    expect(parsedSequence[0].annotations.name).toEqual('NERV');
  });

  it('Should report errors on non-fasta files.', () => {
    expect(() => SeqIO.parseFile('>NERV\nATAT', 'txt' as any)).toThrowError('File type "txt" not recognized');
  });

  it('Should get a random sequences if getRandomSetOfSequences is called with n < length of provided records.', () => {
    const seqRecords = [new SeqRecord(new Seq('ctgg')), new SeqRecord(new Seq('gatc'))];
    const randomSequences = SeqIO.getRandomSetOfSequences(seqRecords, 1);
    expect(randomSequences).toHaveLength(1);
    const randomSeqIsFirstSeq = randomSequences[0] !== seqRecords[0];
    const randomSeqIsSecondSeq = randomSequences[0] === seqRecords[1];
    expect(randomSeqIsFirstSeq === randomSeqIsSecondSeq);
  });

  it('Should get all sequences if getRandomSetOfSequences is called with n> = length of provided records.', () => {
    const seqRecords = [new SeqRecord(new Seq('ctag')), new SeqRecord(new Seq('gatc'))];
    expect(SeqIO.getRandomSetOfSequences(seqRecords, 2).sort()).toEqual(seqRecords);
    expect(SeqIO.getRandomSetOfSequences(seqRecords, 3)).toEqual(seqRecords);
  });
});
