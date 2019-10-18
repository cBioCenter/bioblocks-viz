"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("~bioblocks-viz~/data");
describe('Nucleotide', function () {
    it('Should allow getting known nucleotides from a single letter.', function () {
        expect(data_1.Nucleotide.fromSingleLetterCode('a')).toEqual(data_1.Nucleotide.A);
        expect(data_1.Nucleotide.fromSingleLetterCode('a')).toEqual(data_1.Nucleotide.Adenine);
        expect(data_1.Nucleotide.fromSingleLetterCode('A')).toEqual(data_1.Nucleotide.A);
        expect(data_1.Nucleotide.fromSingleLetterCode('A')).toEqual(data_1.Nucleotide.Adenine);
        expect(data_1.Nucleotide.fromSingleLetterCode('c')).toEqual(data_1.Nucleotide.C);
        expect(data_1.Nucleotide.fromSingleLetterCode('c')).toEqual(data_1.Nucleotide.Cytosine);
        expect(data_1.Nucleotide.fromSingleLetterCode('C')).toEqual(data_1.Nucleotide.C);
        expect(data_1.Nucleotide.fromSingleLetterCode('C')).toEqual(data_1.Nucleotide.Cytosine);
        expect(data_1.Nucleotide.fromSingleLetterCode('g')).toEqual(data_1.Nucleotide.G);
        expect(data_1.Nucleotide.fromSingleLetterCode('g')).toEqual(data_1.Nucleotide.Guanine);
        expect(data_1.Nucleotide.fromSingleLetterCode('G')).toEqual(data_1.Nucleotide.G);
        expect(data_1.Nucleotide.fromSingleLetterCode('G')).toEqual(data_1.Nucleotide.Guanine);
        expect(data_1.Nucleotide.fromSingleLetterCode('t')).toEqual(data_1.Nucleotide.T);
        expect(data_1.Nucleotide.fromSingleLetterCode('t')).toEqual(data_1.Nucleotide.Thymine);
        expect(data_1.Nucleotide.fromSingleLetterCode('T')).toEqual(data_1.Nucleotide.T);
        expect(data_1.Nucleotide.fromSingleLetterCode('T')).toEqual(data_1.Nucleotide.Thymine);
        expect(data_1.Nucleotide.fromSingleLetterCode('u')).toEqual(data_1.Nucleotide.U);
        expect(data_1.Nucleotide.fromSingleLetterCode('u')).toEqual(data_1.Nucleotide.Uracil);
        expect(data_1.Nucleotide.fromSingleLetterCode('U')).toEqual(data_1.Nucleotide.U);
        expect(data_1.Nucleotide.fromSingleLetterCode('U')).toEqual(data_1.Nucleotide.Uracil);
    });
    it('Should allow getting known nucleotides from the full name.', function () {
        expect(data_1.Nucleotide.fromFullName('Adenine')).toEqual(data_1.Nucleotide.A);
        expect(data_1.Nucleotide.fromFullName('Cytosine')).toEqual(data_1.Nucleotide.C);
        expect(data_1.Nucleotide.fromFullName('Guanine')).toEqual(data_1.Nucleotide.G);
        expect(data_1.Nucleotide.fromFullName('Thymine')).toEqual(data_1.Nucleotide.T);
        expect(data_1.Nucleotide.fromFullName('Uracil')).toEqual(data_1.Nucleotide.U);
    });
    it('Should allow getting DNA compliments.', function () {
        expect(data_1.Nucleotide.A.getComplementDNA()).toEqual(data_1.Nucleotide.T);
        expect(data_1.Nucleotide.C.getComplementDNA()).toEqual(data_1.Nucleotide.G);
        expect(data_1.Nucleotide.G.getComplementDNA()).toEqual(data_1.Nucleotide.C);
        expect(data_1.Nucleotide.T.getComplementDNA()).toEqual(data_1.Nucleotide.A);
    });
    it('Should allow getting RNA compliments.', function () {
        expect(data_1.Nucleotide.A.getComplementRNA()).toEqual(data_1.Nucleotide.T);
        expect(data_1.Nucleotide.C.getComplementRNA()).toEqual(data_1.Nucleotide.G);
        expect(data_1.Nucleotide.G.getComplementRNA()).toEqual(data_1.Nucleotide.C);
        expect(data_1.Nucleotide.T.getComplementRNA()).toEqual(data_1.Nucleotide.U);
        expect(data_1.Nucleotide.U.getComplementRNA()).toEqual(data_1.Nucleotide.T);
    });
    it('Should return an unknown nucleotide when appropriate.', function () {
        expect(data_1.Nucleotide.fromSingleLetterCode('z')).toEqual(data_1.Nucleotide.UKN);
        expect(data_1.Nucleotide.fromSingleLetterCode('Z')).toEqual(data_1.Nucleotide.Unknown);
        expect(data_1.Nucleotide.fromFullName('zzz')).toEqual(data_1.Nucleotide.UKN);
        expect(data_1.Nucleotide.fromFullName('ZZZZ')).toEqual(data_1.Nucleotide.Unknown);
        expect(data_1.Nucleotide.U.getComplementDNA()).toEqual(data_1.Nucleotide.UKN);
    });
});
//# sourceMappingURL=Nucleotide.test.js.map