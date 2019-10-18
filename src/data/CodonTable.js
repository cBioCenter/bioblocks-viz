"use strict";
/**
 * Codon tables based on those from the NCBI.
 * Inspired from BioPython IUPACData.py:
 *     https://github.com/biopython/biopython/blob/master/Bio/Data/CodonTable.py
 *     which is under the BSD 3-Clause License with Copyright 2000 Andrew Dalke
 *
 * Note: only implemented a very small subset of BioPython functionality.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CodonTable = /** @class */ (function () {
    function CodonTable(id, name, altName, table, // { [key: string]: string }, //{ [key: string]: string },
    startCodons, stopCodons) {
        this.id = id;
        this.name = name;
        this.altName = altName;
        this.table = table;
        this.startCodons = startCodons;
        this.stopCodons = stopCodons;
    }
    CodonTable.rnaTableFromDNACodonTable = function (id, name, altName, dnaCodonTable) {
        return new CodonTable(id, name, altName, Object.entries(dnaCodonTable.table).reduce(function (acc, _a) {
            var _b = tslib_1.__read(_a, 2), codon = _b[0], aa = _b[1];
            acc[codon.replace(/T/g, 'U').replace(/t/g, 'u')] = aa;
            return acc;
        }, {}), dnaCodonTable.startCodons.map(function (codon) {
            return codon.replace(/T/g, 'U').replace(/t/g, 'u');
        }), dnaCodonTable.stopCodons.map(function (codon) {
            return codon.replace(/T/g, 'U').replace(/t/g, 'u');
        }));
    };
    return CodonTable;
}());
exports.CodonTable = CodonTable;
exports.standardDnaCodonTable = new CodonTable(1, 'standard', 'SGC0', {
    AAA: 'K',
    AAC: 'N',
    AAG: 'K',
    AAT: 'N',
    ACA: 'T',
    ACC: 'T',
    ACG: 'T',
    ACT: 'T',
    AGA: 'R',
    AGC: 'S',
    AGG: 'R',
    AGT: 'S',
    ATA: 'I',
    ATC: 'I',
    ATG: 'M',
    ATT: 'I',
    CAA: 'Q',
    CAC: 'H',
    CAG: 'Q',
    CAT: 'H',
    CCA: 'P',
    CCC: 'P',
    CCG: 'P',
    CCT: 'P',
    CGA: 'R',
    CGC: 'R',
    CGG: 'R',
    CGT: 'R',
    CTA: 'L',
    CTC: 'L',
    CTG: 'L',
    CTT: 'L',
    GAA: 'E',
    GAC: 'D',
    GAG: 'E',
    GAT: 'D',
    GCA: 'A',
    GCC: 'A',
    GCG: 'A',
    GCT: 'A',
    GGA: 'G',
    GGC: 'G',
    GGG: 'G',
    GGT: 'G',
    GTA: 'V',
    GTC: 'V',
    GTG: 'V',
    GTT: 'V',
    TAC: 'Y',
    TAT: 'Y',
    TCA: 'S',
    TCC: 'S',
    TCG: 'S',
    TCT: 'S',
    TGC: 'C',
    TGG: 'W',
    TGT: 'C',
    TTA: 'L',
    TTC: 'F',
    TTG: 'L',
    TTT: 'F',
}, ['TAA', 'TAG', 'TGA'], ['TTG', 'CTG', 'ATG']);
exports.standardRnaCodonTable = CodonTable.rnaTableFromDNACodonTable(2, 'standard', 'SGC0', exports.standardDnaCodonTable);
//# sourceMappingURL=CodonTable.js.map