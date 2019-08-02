import { ALPHABET, Seq } from '~bioblocks-viz~/data';

describe('Seq', () => {
  it('Should allow getting a lowercase sequence.', () => {
    const seq = new Seq('aTaT');
    expect(seq.lower().sequence).toEqual('atat');
  });

  it('Should allow getting a uppercase sequence.', () => {
    const seq = new Seq('aTaT');
    expect(seq.upper().sequence).toEqual('ATAT');
  });

  it('Should allow getting a complement sequence.', () => {
    const seq = new Seq('aTaT');
    expect(seq.complement().sequence).toEqual('tAtA');
  });

  it('Should allow getting a binary representation.', () => {
    const seq = new Seq('acgt');
    expect(seq.binaryRepresentation()).toEqual([0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
  });

  it('Should allow getting the transcription.', () => {
    const seq = new Seq('acgt');
    expect(seq.transcribe().sequence).toEqual('acgu');
  });

  it('Should allow getting the back-transcription.', () => {
    const seq = new Seq('acgu');
    expect(seq.back_transcribe().sequence).toEqual('acgt');
  });

  it('Should allow translation.', () => {
    const seq = new Seq('TTCTTGTGTTTA');
    expect(seq.translate().sequence).toEqual('FLCL');
  });

  it('Should throw errors for methods called on sequences with invalid alphabets.', () => {
    expect(() => new Seq('atat', ALPHABET.generic_protein).complement()).toThrowError(
      'Proteins do not have complements!',
    );
    expect(() => new Seq('TATu').complement()).toThrowError('Mixed RNA/DNA found');
    expect(() => new Seq('tatU').complement()).toThrowError('Mixed RNA/DNA found');
    expect(() => new Seq('atat', ALPHABET.generic_protein).transcribe()).toThrowError(
      'Proteins sequences cannot be transcribed!',
    );
    expect(() => new Seq('atat', ALPHABET.generic_protein).back_transcribe()).toThrowError(
      'Proteins sequences cannot be back transcribed!',
    );
    expect(() => new Seq('atat', ALPHABET.generic_protein).translate()).toThrowError(
      'Proteins sequences cannot be translated!',
    );
  });

  it('Should throw errors for translation on a malformed sequence.', () => {
    expect(() => new Seq('T').translate('*', false, true).sequence).toThrowError(
      'Invalid coding sequence - sequence length must be a multiple of 3!',
    );
    expect(() => new Seq('TTCTTGTGTTTA').translate('*', false, true).sequence).toThrowError(
      'Invalid coding sequence - sequence must have a valid start and stop codon!',
    );
  });
});
