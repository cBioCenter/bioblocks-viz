"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data/");
var SEQUENCE_FILE_TYPES;
(function (SEQUENCE_FILE_TYPES) {
    SEQUENCE_FILE_TYPES["fasta"] = "fasta";
    // 'fastq'
})(SEQUENCE_FILE_TYPES = exports.SEQUENCE_FILE_TYPES || (exports.SEQUENCE_FILE_TYPES = {}));
/**
 * General sequence Input and Output functions
 *
 * @export
 */
// tslint:disable-next-line: no-unnecessary-class
var SeqIO = /** @class */ (function () {
    function SeqIO() {
    }
    SeqIO.parseFile = function (fileText, fileType, seqProperties) {
        var seqAnnotations = tslib_1.__assign(tslib_1.__assign({}, SeqIO.DEFAULT_SEQ_PROPERTIES), seqProperties);
        var sequences = new Array();
        if (fileType === SEQUENCE_FILE_TYPES.fasta) {
            var seqObject = fileText.split(/\r|\n|\r\n/).reduce(function (accumulator, line) {
                var trimmedLine = line.trim();
                if (trimmedLine.length > 0) {
                    if (trimmedLine[0] === '>') {
                        accumulator.push({
                            annotations: { name: trimmedLine.substr(1) },
                            sequence: '',
                        });
                    }
                    else if (accumulator.length > 0) {
                        var sequenceOnLine = trimmedLine.replace(/\./g, '-');
                        accumulator[accumulator.length - 1].sequence += sequenceOnLine;
                    }
                }
                return accumulator;
            }, sequences);
        }
        else {
            throw Error("File type \"" + fileType + "\" not recognized");
        }
        return sequences.map(function (seqObj) {
            var alphabet = seqAnnotations.alphabet;
            var ignoredCharacters = seqAnnotations.ignoredCharacters;
            return new data_1.SeqRecord(new data_1.Seq(seqObj.sequence, seqAnnotations.alphabet, seqAnnotations.ignoredCharacters), {
                id: seqObj.annotations.id,
                name: seqObj.annotations.name,
            });
        });
    };
    SeqIO.getRandomSetOfSequences = function (sequences, n) {
        // todo move out of here.
        // randomly select "n" sequences and return a new array of SeqRecords.
        // If "n" is larger than the number of sequences, return all sequences.
        var sequenceBowl = tslib_1.__spread(sequences);
        if (n > sequences.length) {
            return sequenceBowl;
        }
        var randomSequences = new Array();
        while (randomSequences.length < n) {
            // tslint:disable-next-line: insecure-random
            var randomIdx = Math.floor(Math.random() * sequenceBowl.length); // btw 0 and length of in sequenceBowl
            randomSequences.push(sequenceBowl[randomIdx]);
            sequenceBowl.splice(randomIdx, 1);
        }
        return randomSequences;
    };
    SeqIO.DEFAULT_SEQ_PROPERTIES = {
        alphabet: undefined,
        ignoredCharacters: [],
    };
    return SeqIO;
}());
exports.SeqIO = SeqIO;
// console.log(SeqIO.parseFile('>my new name\ratgcatgc\n>seq2\natgcAAA', SEQUENCE_FILE_TYPES.fasta));
//# sourceMappingURL=SeqIO.js.map