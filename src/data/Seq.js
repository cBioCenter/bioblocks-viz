"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data/");
var ALPHABET;
(function (ALPHABET) {
    ALPHABET["generic_dna"] = "generic_dna";
    ALPHABET["generic_rna"] = "generic_rna";
    ALPHABET["generic_protein"] = "generic_protein";
})(ALPHABET = exports.ALPHABET || (exports.ALPHABET = {}));
/**
 * Seq
 * Provide objects to represent biological sequences with alphabets.
 */
var Seq = /** @class */ (function () {
    /**
     * Create a new Seq object.
     * @param sequence A representation of the sequence as a string.
     * @param alphabet The type of sequence.
     * @param ignoredCharacters Characters that should be ignored in the sequence such
     *                          as a gap "-".
     * @throws an error if the alphabet is declared, but it doesn't match the sequence.
     */
    function Seq(sequence, alphabet, ignoredCharacters) {
        if (ignoredCharacters === void 0) { ignoredCharacters = ['-']; }
        this.sequence = sequence;
        this.alphabet = alphabet;
        this.ignoredCharacters = ignoredCharacters ? ignoredCharacters : [];
        if (this.alphabet === ALPHABET.generic_dna && this.isValidDNA(this.ignoredCharacters) === false) {
            throw Error("Cannot create DNA Seq from sequence \"" + this.sequence + "\"");
        }
        if (this.alphabet === ALPHABET.generic_rna && this.isValidRNA(this.ignoredCharacters) === false) {
            throw Error("Cannot create RNA Seq from sequence \"" + this.sequence + "\"");
        }
        if (this.alphabet === ALPHABET.generic_protein && this.isValidProtein(this.ignoredCharacters) === false) {
            throw Error("Cannot create Protein Seq from sequence \"" + this.sequence + "\"");
        }
    }
    /**
     * checkSequenceValidity
     * This convenience method will check whether a sequence contains only the characters
     * in a particular string. Useful for asking whether a sequence contains only valid
     * amino acids or nucleotides. Case insensitive.
     *
     * @param sequence the sequence to evaluate.
     * @param validSequenceString a string that contains all the valid letters for this
     *                            sequence e.g., IUPACData protein_letters.
     * @param ignoredCharacters a list of characters to ignore in determining whether the
     *                          sequence is valid e.g., a dash that represents a gap.
     */
    Seq.checkSequenceValidity = function (sequence, validSequenceString, ignoredCharacters) {
        // note - the 'replace' function removes all duplicate characters - https://stackoverflow.com/questions/19301806
        var ignoredCharString = ("" + ignoredCharacters
            .join()
            .toLowerCase() + ignoredCharacters.join().toUpperCase()).replace(/(.)(?=.*\1)/g, '');
        return new RegExp("^[" + validSequenceString.toLowerCase() + validSequenceString.toUpperCase() + ignoredCharString + "]+$").test(sequence);
    };
    Seq.prototype.isValidProtein = function (ignoredCharacters) {
        if (ignoredCharacters === void 0) { ignoredCharacters = this.ignoredCharacters; }
        return Seq.checkSequenceValidity(this.sequence, data_1.proteinLetters, ignoredCharacters);
    };
    Seq.prototype.isValidDNA = function (ignoredCharacters) {
        if (ignoredCharacters === void 0) { ignoredCharacters = this.ignoredCharacters; }
        return Seq.checkSequenceValidity(this.sequence, data_1.unambiguousDnaLetters, ignoredCharacters);
    };
    Seq.prototype.isValidRNA = function (ignoredCharacters) {
        if (ignoredCharacters === void 0) { ignoredCharacters = this.ignoredCharacters; }
        return Seq.checkSequenceValidity(this.sequence, data_1.unambiguousRnaLetters, ignoredCharacters);
    };
    /**
     * Determine the alphabet of the sequence. If this.alphabet is already set, return
     * it directly, otherwise attempt to predict the alphabet. Not perfect - for example
     * if the sequence only has 'agc' then it returns DNA even though this would
     * be a valid protein or RNA. Preference order is DNA, RNA, then protein.
     * Only canonical nucleotides and protein sequences are evaluated (not ambiguous).
     * @param ignoredCharacters: an array of characters to ignore in the
     *                           assignment. Defaults to dash only (gaps).
     */
    Seq.prototype.determineAlphabet = function (ignoredCharacters) {
        if (ignoredCharacters === void 0) { ignoredCharacters = ['-']; }
        if (this.alphabet) {
            return this.alphabet;
        }
        if (this.isValidDNA(ignoredCharacters)) {
            return ALPHABET.generic_dna;
        }
        if (this.isValidRNA(ignoredCharacters)) {
            return ALPHABET.generic_rna;
        }
        if (this.isValidProtein(ignoredCharacters)) {
            return ALPHABET.generic_protein;
        }
        return undefined;
    };
    /**
     * Test for equality between two sequences - case insensitive. this.ignoredCharacters are
     * not evaluated in the equality comparison.
     * @param seqToCompare the sequence to compare this object to
     * @returns true if the sequences and their alphabets are equal, false otherwise.
     */
    Seq.prototype.equal = function (seqToCompare) {
        if (this.alphabet !== seqToCompare.alphabet || this.sequence.length !== seqToCompare.sequence.length) {
            return false;
        }
        return this.sequence.toUpperCase() === seqToCompare.sequence.toUpperCase(); // case ignored.
    };
    /**
     * Returns a binary representation of this sequence.
     *
     * Characters not in the alphabet (20 single letter amino acids and 4 nucleotide
     * characters) or that are not a dash are ignored by default. This means that the
     * array for these positions will be all zeros. Other characters will
     * be included if added to the "additionalAcceptedCharacters" array parameter.
     *
     * @param additionalAcceptedCharacters characters that should be considered valid and
     *                                     included in the return array.
     * @returns a binary array that is a concatenation of each position's individual
     *          binary array:
     *     for proteins - each position is represented by a binary array of length 20 plus
     *                    the number of additional characters (parameter). A single one of
     *                    the indices will be one and the rest zero.
     *     for oligos   - each position is represented by a binary array of length 4 plus
     *                    the number of additional characters (parameter).  A single one of
     *                    the indices will be one and the rest zero.
     *    NOTE: the index that is set to 1 is arbitrary but will be consistent with each
     *          function call - it is set from indexing the strings in IUPACData:
     *          protein_letters, unambiguous_dna_letters and unambiguous_rna_letters
     */
    Seq.prototype.binaryRepresentation = function (additionalAcceptedCharacters) {
        if (additionalAcceptedCharacters === void 0) { additionalAcceptedCharacters = ['-']; }
        var alphabet = this.determineAlphabet(additionalAcceptedCharacters);
        var idxString = data_1.proteinLetters;
        if (alphabet === ALPHABET.generic_dna) {
            idxString = data_1.unambiguousDnaLetters;
        }
        else if (alphabet === ALPHABET.generic_rna) {
            idxString = data_1.unambiguousRnaLetters;
        }
        idxString += additionalAcceptedCharacters.join();
        idxString = idxString.toUpperCase();
        var positionArrayLength = idxString.length;
        var sequenceTemplate = this.sequence.toUpperCase();
        return sequenceTemplate.split('').reduce(function (binAccumulator, ntOrAACode) {
            var arr = new Array(positionArrayLength).fill(0);
            if (idxString.includes(ntOrAACode)) {
                arr[idxString.indexOf(ntOrAACode)] = 1;
            }
            binAccumulator.push.apply(binAccumulator, tslib_1.__spread(arr));
            return binAccumulator;
        }, new Array());
    };
    /**
     * integerRepresentation
     * Returns an integer representation of this sequence. Each index in the array
     * represents a single position. ** The values have no meaning other than to check
     * for equality in a custom hamming distance function. **
     *
     * Characters not found will be represented as -1 in the returned array
     *
     * @param additionalAcceptedCharacters characters to consider valid and add to
     *                                     give  returned array.
     */
    Seq.prototype.integerRepresentation = function (additionalAcceptedCharacters) {
        if (additionalAcceptedCharacters === void 0) { additionalAcceptedCharacters = ['-']; }
        var alphabet = this.determineAlphabet(additionalAcceptedCharacters);
        var idxString = data_1.proteinLetters;
        if (alphabet === ALPHABET.generic_dna) {
            idxString = data_1.unambiguousDnaLetters;
        }
        else if (alphabet === ALPHABET.generic_rna) {
            idxString = data_1.unambiguousRnaLetters;
        }
        idxString += additionalAcceptedCharacters.join();
        idxString = idxString.toUpperCase();
        var sequenceTemplate = this.sequence.toUpperCase();
        return sequenceTemplate.split('').map(function (ntOrAACode) {
            return idxString.indexOf(ntOrAACode);
        }, new Array());
    };
    Seq.prototype.toString = function () {
        return this.sequence;
    };
    Seq.prototype.upper = function () {
        return new Seq(this.sequence.toUpperCase(), this.alphabet);
    };
    Seq.prototype.lower = function () {
        return new Seq(this.sequence.toLowerCase(), this.alphabet);
    };
    Seq.prototype.subSequence = function (startIdx, endIdx) {
        if (startIdx === void 0) { startIdx = 0; }
        return new Seq(this.sequence.slice(startIdx, endIdx), this.alphabet);
    };
    /**
     * complement()
     * Return the complement sequence by creating a new Seq object.
     * @param reverse if true, will return the sequence reversed
     * @returns a new sequence complemented from this sequence
     * @throws errors if this sequence is not valid DNA or RNA.
     */
    Seq.prototype.complement = function (reverse) {
        var _this = this;
        if (reverse === void 0) { reverse = false; }
        if (this.alphabet === ALPHABET.generic_protein) {
            throw Error("Proteins do not have complements!");
        }
        else if ((this.sequence.includes('U') || this.sequence.includes('u')) &&
            (this.sequence.includes('T') || this.sequence.includes('t'))) {
            throw Error("Mixed RNA/DNA found");
        }
        var table = data_1.ambiguousDnaComplement;
        var newAlphabet = ALPHABET.generic_dna;
        if (this.sequence.includes('U') || this.sequence.includes('u')) {
            // rna complement
            table = data_1.ambiguousRnaComplement;
            newAlphabet = ALPHABET.generic_rna;
        }
        var sequenceTemplate = reverse
            ? this.sequence
                .split('')
                .reverse()
                .join()
            : this.sequence;
        return new Seq(sequenceTemplate
            .split('')
            .map(function (nt) {
            if (_this.ignoredCharacters.includes(nt)) {
                return nt;
            }
            var upperNT = nt.toUpperCase();
            if (upperNT === nt) {
                return table[upperNT];
            }
            return table[upperNT].toLowerCase();
        })
            .join(''), newAlphabet, this.ignoredCharacters);
    };
    /**
     * reverse_complement()
     * Return the reverse complement sequence by creating a new Seq object.
     */
    Seq.prototype.reverse_complement = function () {
        return this.complement(true);
    };
    /**
     * transcribe()
     * Return the RNA sequence from a DNA sequence by creating a new Seq object
     */
    Seq.prototype.transcribe = function () {
        if (this.alphabet === ALPHABET.generic_protein) {
            throw Error("Proteins sequences cannot be transcribed!");
        }
        return new Seq(this.sequence.replace(/T/g, 'U').replace(/t/g, 'u'), ALPHABET.generic_rna);
    };
    /**
     * back_transcribe()
     * Return the DNA sequence from an RNA sequence by creating a new Seq object
     */
    Seq.prototype.back_transcribe = function () {
        if (this.alphabet === ALPHABET.generic_protein) {
            throw Error("Proteins sequences cannot be back transcribed!");
        }
        return new Seq(this.sequence.replace(/U/g, 'T').replace(/u/g, 't'), ALPHABET.generic_dna);
    };
    /**
     * translate(table, stop_symbol='*', to_stop=False, cds=False, gap=None)
     * Turn a nucleotide sequence into a protein sequence by creating a new Seq object
     *     TODO: implement "gap" parameter.
     */
    Seq.prototype.translate = function (stopSymbol, toStop, cds) {
        if (stopSymbol === void 0) { stopSymbol = '*'; }
        if (toStop === void 0) { toStop = false; }
        if (cds === void 0) { cds = false; }
        if (this.alphabet === ALPHABET.generic_protein) {
            throw Error("Proteins sequences cannot be translated!");
        }
        var codonTable = data_1.standardDnaCodonTable;
        if (this.sequence.includes('U') || this.sequence.includes('u')) {
            // rna complement
            codonTable = data_1.standardRnaCodonTable;
        }
        var codonArr = this.sequence.match(/.{1,3}/g);
        if (cds) {
            if (this.sequence.length % 3 !== 0) {
                throw Error("Invalid coding sequence - sequence length must be a multiple of 3!");
            }
            if (this.sequence.length < 6 ||
                codonArr[0] in codonTable.startCodons === false ||
                codonArr[codonArr.length - 1] in codonTable.stopCodons === false) {
                throw Error("Invalid coding sequence - sequence must have a valid start and stop codon!");
            }
        }
        if (!codonArr) {
            // sequence length is be less than 3. return an empty protein.
            return new Seq('', ALPHABET.generic_protein);
        }
        var proteinSequence = '';
        codonArr.forEach(function (codon) {
            if (codon.length === 3) {
                var upperCodon = codon.toUpperCase();
                if (upperCodon in codonTable.table) {
                    proteinSequence += codonTable.table[upperCodon];
                }
                else if (upperCodon in codonTable.stopCodons) {
                    proteinSequence += stopSymbol;
                    if (toStop) {
                        return;
                    }
                }
            }
        });
        return new Seq(proteinSequence, ALPHABET.generic_protein);
    };
    Seq.fromSeqOpts = function (opts) {
        return new Seq(opts.sequence, opts.alphabet, opts.ignoredCharacters);
    };
    return Seq;
}());
exports.Seq = Seq;
//# sourceMappingURL=Seq.js.map