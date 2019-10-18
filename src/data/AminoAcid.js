"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var AminoAcid = /** @class */ (function () {
    function AminoAcid(fullName, singleLetterCode, threeLetterCode, codons) {
        this.fullName = fullName;
        this.singleLetterCode = singleLetterCode;
        this.threeLetterCode = threeLetterCode;
        this.codons = codons;
    }
    // public static readonly Stop = new AminoAcid('Stop', '*', '***', ['TAA', 'TGA', 'TAG']);
    // public static readonly Gap = new AminoAcid('Gap', '-', '---', []);
    // public static readonly Unknown = new AminoAcid('Unknown', '?', '???', []);
    AminoAcid.getAllCanonicalAminoAcids = function () {
        return Object.keys(AminoAcid).reduce(function (acc, staticVarName) {
            var staticValue = AminoAcid[staticVarName];
            if (staticValue instanceof AminoAcid) {
                acc.push(staticValue);
            }
            return acc;
        }, new Array());
    };
    AminoAcid.fromSingleLetterCode = function (code) {
        return AminoAcid.getAllCanonicalAminoAcids().find(function (aa) {
            if (aa.singleLetterCode.toUpperCase() === code.toUpperCase()) {
                return true;
            }
            return false;
        });
    };
    AminoAcid.fromThreeLetterCode = function (code) {
        AminoAcid.getAllCanonicalAminoAcids().forEach(function (aa) {
            if (aa.threeLetterCode.toUpperCase() === code.toUpperCase()) {
                return aa;
            }
        });
        return undefined;
    };
    AminoAcid.fromCodon = function (codon) {
        AminoAcid.getAllCanonicalAminoAcids().forEach(function (aa) {
            aa.codons.forEach(function (codonStr) {
                if (codonStr.toUpperCase() === codon.toUpperCase()) {
                    return aa;
                }
            });
        });
        return undefined;
    };
    AminoAcid.Alanine = new AminoAcid('Alanine', 'A', 'ALA', ['GCT', 'GCC', 'GCA', 'GCG']);
    AminoAcid.Arginine = new AminoAcid('Arginine', 'R', 'ARG', ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG']);
    AminoAcid.Asparagine = new AminoAcid('Asparagine', 'N', 'ASN', ['AAT', 'AAC']);
    AminoAcid.AsparticAcid = new AminoAcid('Aspartic Acid', 'D', 'ASP', ['GAT', 'GAC']);
    AminoAcid.Cysteine = new AminoAcid('Cysteine', 'C', 'CYS', ['TGT', 'TGC']);
    AminoAcid.Glutamine = new AminoAcid('Glutamine', 'Q', 'GLN', ['CAA', 'CAG']);
    AminoAcid.GlutamicAcid = new AminoAcid('Glutamic Acid', 'E', 'GLU', ['GAA', 'GAG']);
    AminoAcid.Glycine = new AminoAcid('Glycine', 'G', 'GLY', ['GGT', 'GGC', 'GGA', 'GGG']);
    AminoAcid.Histidine = new AminoAcid('Histidine', 'H', 'HIS', ['CAT', 'CAC']);
    AminoAcid.Isoleucine = new AminoAcid('Isoleucine', 'I', 'ILE', ['ATT', 'ATC', 'ATA']);
    AminoAcid.Leucine = new AminoAcid('Leucine', 'L', 'LEU', ['TTA', 'TTG', 'CTT', 'CTC', 'CTA', 'CTG']);
    AminoAcid.Lysine = new AminoAcid('Lysine', 'K', 'LYS', ['AAA', 'AAG']);
    AminoAcid.Methionine = new AminoAcid('Methionine', 'M', 'MET', ['ATG']);
    AminoAcid.Phenylalanine = new AminoAcid('Phenylalanine', 'F', 'PHE', ['TTT', 'TTC']);
    AminoAcid.Proline = new AminoAcid('Proline', 'P', 'PRO', ['CCT', 'CCC', 'CCA', 'CCG']);
    AminoAcid.Serine = new AminoAcid('Serine', 'S', 'SER', ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC']);
    AminoAcid.Threonine = new AminoAcid('Threonine', 'T', 'THR', ['ACT', 'ACC', 'ACA', 'ACG']);
    AminoAcid.Tryptophan = new AminoAcid('Tryptophan', 'W', 'TRP', ['TGG']);
    AminoAcid.Tyrosine = new AminoAcid('Tyrosine', 'Y', 'TYR', ['TAT', 'TAC']);
    AminoAcid.Valine = new AminoAcid('Valine', 'V', 'VAL', ['GTT', 'GTC', 'GTA', 'GTG']);
    // public static readonly Unknown = new AminoAcid('Unknown', 'X', 'XXX', []);
    AminoAcid.ALL_FULL_NAMES = function () { return AminoAcid.getAllCanonicalAminoAcids().map(function (aa) { return aa.fullName; }); };
    AminoAcid.ALL_1LETTER_CODES = function () { return AminoAcid.getAllCanonicalAminoAcids().map(function (a) { return a.singleLetterCode; }); };
    AminoAcid.ALL_3LETTER_CODES = function () { return AminoAcid.getAllCanonicalAminoAcids().map(function (a) { return a.threeLetterCode; }); };
    AminoAcid.ALL_CODONS = function () { return lodash_1.flatten(AminoAcid.getAllCanonicalAminoAcids().map(function (a) { return a.codons; })); };
    return AminoAcid;
}());
exports.AminoAcid = AminoAcid;
// Gets mismatches between a PDB file and coupling scores.
// @returns Array of mismatches - empty if none are found.
exports.getPDBAndCouplingMismatch = function (pdbData, couplingScores) {
    var pdbSequence = pdbData.sequence;
    var couplingSequence = couplingScores.sequence;
    var mismatches = exports.getSequenceMismatch(pdbSequence, couplingSequence);
    if (mismatches.length === 0) {
        return pdbData.getResidueNumberingMismatches(couplingScores);
    }
    return mismatches;
};
// Given two **equal-length** Amino Acid sequences, returns all mismatches.
exports.getSequenceMismatch = function (firstSequence, secondSequence) {
    var mismatches = new Array();
    if (firstSequence.length === secondSequence.length) {
        for (var i = 0; i < firstSequence.length; ++i) {
            var couplingAminoAcid = AminoAcid.fromSingleLetterCode(firstSequence[i]);
            var pdbAminoAcid = AminoAcid.fromSingleLetterCode(secondSequence[i]);
            if (firstSequence[i] !== secondSequence[i] && couplingAminoAcid && pdbAminoAcid) {
                mismatches.push({
                    couplingAminoAcid: couplingAminoAcid,
                    pdbAminoAcid: pdbAminoAcid,
                    resno: i,
                });
            }
        }
    }
    return mismatches;
};
//# sourceMappingURL=AminoAcid.js.map