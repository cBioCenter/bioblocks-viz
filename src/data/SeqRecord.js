"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data");
/**
 * SeqRecord
 * This is a super class that provides additional annotation on top
 * of the standard Seq class.
 *
 * Inspired from BioPython SeqRecord.py:
 *     https://github.com/biopython/biopython/blob/master/Bio/SeqRecord.py
 *     which is under the BSD 3-Clause License
 */
var SeqRecord = /** @class */ (function (_super) {
    tslib_1.__extends(SeqRecord, _super);
    function SeqRecord(sequence, annotations) {
        if (annotations === void 0) { annotations = {}; }
        var _this = _super.call(this, sequence.sequence, sequence.alphabet, sequence.ignoredCharacters) || this;
        _this.annotations = annotations;
        _this.annotations = tslib_1.__assign(tslib_1.__assign({}, SeqRecord.DEFAULT_ANNOTATIONS), annotations);
        // Many of the Seq methods return copies of the Seq instance. In order to do so for
        // the SeqRecord class, we override each function to call the parent method and
        // then return a SeqRecord copy. Slightly convoluted but it allows us to (1) return
        // copies of the objects rather than mutate the objects and (2) keeps us from
        // having to manually override each individual method in the SeqRecord.
        Object.keys(data_1.Seq.prototype).forEach(function (func) {
            var functionKey = func;
            var property = Reflect.getOwnPropertyDescriptor(data_1.Seq.prototype, func);
            if (typeof _this[functionKey] === 'function' && property && property.writable) {
                Reflect.set(_this, functionKey, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    // @ts-ignore
                    var parentReturned = _super.prototype[functionKey].call(_this, args);
                    if (parentReturned instanceof data_1.Seq) {
                        return new SeqRecord(parentReturned, annotations);
                    }
                    return parentReturned;
                });
            }
        });
        return _this;
    }
    SeqRecord.DEFAULT_ANNOTATIONS = {
        dbxrefs: [],
        description: '<unknown description>',
        id: '<unknown id>',
        letterAnnotations: {},
        // should be strings, list or tuples of the same
        // length as the full sequence
        // tslint:disable-next-line: no-object-literal-type-assertion
        metadata: {},
        name: '<unknown name>',
    };
    SeqRecord.fromSeqRecordOpts = function (opts) {
        return new SeqRecord(new data_1.Seq(opts.sequence.sequence, opts.sequence.alphabet, opts.sequence.ignoredCharacters), opts.annotations);
    };
    return SeqRecord;
}(data_1.Seq));
exports.SeqRecord = SeqRecord;
//# sourceMappingURL=SeqRecord.js.map