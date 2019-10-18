"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Nucleotide = /** @class */ (function () {
    function Nucleotide(fullName, singleLetterCode) {
        this.fullName = fullName;
        this.singleLetterCode = singleLetterCode;
    }
    Nucleotide.fromSingleLetterCode = function (code) {
        var nt = Nucleotide.allNucleotides.find(function (ntFocus) {
            return ntFocus.singleLetterCode.toUpperCase() === code.toUpperCase();
        });
        return nt ? nt : Nucleotide.Unknown;
    };
    Nucleotide.fromFullName = function (fullName) {
        var nt = Nucleotide.allNucleotides.find(function (ntFocus) {
            return ntFocus.fullName.toUpperCase() === fullName.toUpperCase();
        });
        return nt ? nt : Nucleotide.Unknown;
    };
    Nucleotide.prototype.getComplementDNA = function () {
        if (this === Nucleotide.A) {
            return Nucleotide.T;
        }
        else if (this === Nucleotide.T) {
            return Nucleotide.A;
        }
        else if (this === Nucleotide.G) {
            return Nucleotide.C;
        }
        else if (this === Nucleotide.C) {
            return Nucleotide.G;
        }
        return Nucleotide.Unknown;
    };
    Nucleotide.prototype.getComplementRNA = function () {
        if (this === Nucleotide.T) {
            return Nucleotide.U;
        }
        else if (this === Nucleotide.U) {
            return Nucleotide.T;
        }
        return this.getComplementDNA();
    };
    Nucleotide.A = new Nucleotide('Adenine', 'A');
    Nucleotide.C = new Nucleotide('Cytosine', 'C');
    Nucleotide.G = new Nucleotide('Guanine', 'G');
    Nucleotide.T = new Nucleotide('Thymine', 'T');
    Nucleotide.U = new Nucleotide('Uracil', 'U');
    Nucleotide.UKN = new Nucleotide('Unknown', '-');
    Nucleotide.Adenine = Nucleotide.A;
    Nucleotide.Cytosine = Nucleotide.C;
    Nucleotide.Guanine = Nucleotide.G;
    Nucleotide.Thymine = Nucleotide.T;
    Nucleotide.Uracil = Nucleotide.U;
    Nucleotide.Unknown = Nucleotide.UKN;
    Nucleotide.allNucleotides = [
        Nucleotide.A,
        Nucleotide.C,
        Nucleotide.G,
        Nucleotide.T,
        Nucleotide.U,
        Nucleotide.UKN,
    ];
    return Nucleotide;
}());
exports.Nucleotide = Nucleotide;
//# sourceMappingURL=Nucleotide.js.map