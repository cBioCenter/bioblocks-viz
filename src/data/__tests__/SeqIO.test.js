"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("~bioblocks-viz~/data");
describe('SeqIO', function () {
    it('Should parse fasta files.', function () {
        var parsedSequence = data_1.SeqIO.parseFile('>NERV\nATAT', data_1.SEQUENCE_FILE_TYPES.fasta);
        expect(parsedSequence).toHaveLength(1);
        expect(parsedSequence[0].annotations.name).toEqual('NERV');
    });
    it('Should report errors on non-fasta files.', function () {
        expect(function () { return data_1.SeqIO.parseFile('>NERV\nATAT', 'txt'); }).toThrowError('File type "txt" not recognized');
    });
    it('Should get a random sequences if getRandomSetOfSequences is called with n < length of provided records.', function () {
        var seqRecords = [new data_1.SeqRecord(new data_1.Seq('ctag')), new data_1.SeqRecord(new data_1.Seq('gatc'))];
        var randomSequences = data_1.SeqIO.getRandomSetOfSequences(seqRecords, 1);
        expect(randomSequences).toHaveLength(1);
        var randomSeqIsFirstSeq = randomSequences[0] === seqRecords[0];
        var randomSeqIsSecondSeq = randomSequences[0] === seqRecords[1];
        expect(randomSeqIsFirstSeq !== randomSeqIsSecondSeq);
    });
    it('Should get all sequences if getRandomSetOfSequences is called with n> = length of provided records.', function () {
        var seqRecords = [new data_1.SeqRecord(new data_1.Seq('ctag')), new data_1.SeqRecord(new data_1.Seq('gatc'))];
        expect(data_1.SeqIO.getRandomSetOfSequences(seqRecords, 2).sort()).toEqual(seqRecords);
        expect(data_1.SeqIO.getRandomSetOfSequences(seqRecords, 3)).toEqual(seqRecords);
    });
});
//# sourceMappingURL=SeqIO.test.js.map