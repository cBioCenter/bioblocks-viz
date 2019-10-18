"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("~bioblocks-viz~/data");
describe('Seq', function () {
    it('Should allow getting a lowercase sequence.', function () {
        var seq = new data_1.Seq('aTaT');
        expect(seq.lower().sequence).toEqual('atat');
    });
    it('Should allow getting a uppercase sequence.', function () {
        var seq = new data_1.Seq('aTaT');
        expect(seq.upper().sequence).toEqual('ATAT');
    });
    it('Should allow getting a complement sequence.', function () {
        var seq = new data_1.Seq('aTaT');
        expect(seq.complement().sequence).toEqual('tAtA');
    });
    it('Should allow getting a binary representation.', function () {
        var seq = new data_1.Seq('acgt');
        expect(seq.binaryRepresentation()).toEqual([0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    });
    it('Should allow getting the transcription.', function () {
        var seq = new data_1.Seq('acgt');
        expect(seq.transcribe().sequence).toEqual('acgu');
    });
    it('Should allow getting the back-transcription.', function () {
        var seq = new data_1.Seq('acgu');
        expect(seq.back_transcribe().sequence).toEqual('acgt');
    });
    it('Should allow translation.', function () {
        var seq = new data_1.Seq('TTCTTGTGTTTA');
        expect(seq.translate().sequence).toEqual('FLCL');
    });
    it('Should throw errors for methods called on sequences with invalid alphabets.', function () {
        expect(function () { return new data_1.Seq('atat', data_1.ALPHABET.generic_protein).complement(); }).toThrowError('Proteins do not have complements!');
        expect(function () { return new data_1.Seq('TATu').complement(); }).toThrowError('Mixed RNA/DNA found');
        expect(function () { return new data_1.Seq('tatU').complement(); }).toThrowError('Mixed RNA/DNA found');
        expect(function () { return new data_1.Seq('atat', data_1.ALPHABET.generic_protein).transcribe(); }).toThrowError('Proteins sequences cannot be transcribed!');
        expect(function () { return new data_1.Seq('atat', data_1.ALPHABET.generic_protein).back_transcribe(); }).toThrowError('Proteins sequences cannot be back transcribed!');
        expect(function () { return new data_1.Seq('atat', data_1.ALPHABET.generic_protein).translate(); }).toThrowError('Proteins sequences cannot be translated!');
    });
    it('Should throw errors for translation on a malformed sequence.', function () {
        expect(function () { return new data_1.Seq('T').translate('*', false, true).sequence; }).toThrowError('Invalid coding sequence - sequence length must be a multiple of 3!');
        expect(function () { return new data_1.Seq('TTCTTGTGTTTA').translate('*', false, true).sequence; }).toThrowError('Invalid coding sequence - sequence must have a valid start and stop codon!');
    });
});
//# sourceMappingURL=Seq.test.js.map