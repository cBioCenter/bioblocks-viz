"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data");
/**
 * A CouplingContainer provides access to the coupling information of residue pairs.
 *
 * Behind the scenes, it is backed by a sparse 2D array to avoid data duplication and provide O(1) access.
 *
 * @export
 */
var CouplingContainer = /** @class */ (function () {
    function CouplingContainer(scores, scoreSource) {
        var e_1, _a;
        var _this = this;
        if (scores === void 0) { scores = []; }
        if (scoreSource === void 0) { scoreSource = data_1.COUPLING_SCORE_SOURCE.cn; }
        this.scoreSource = scoreSource;
        this.contacts = new Array();
        this.indexRange = {
            max: 1,
            min: 1,
        };
        /** How many distinct contacts are currently stored. */
        this.totalStoredContacts = 0;
        this.derivedFromCouplingScoresFlag = true;
        /** Used for iterator access. */
        this.rowCounter = 0;
        /** Used for iterator access. */
        this.colCounter = 0;
        /**
         * Primary interface for getting a coupling score, provides access to the same data object regardless of order of (firstRes, secondRes).
         */
        this.getCouplingScore = function (firstRes, secondRes) {
            var row = _this.contacts[Math.min(firstRes, secondRes) - 1];
            return row ? row[Math.max(firstRes, secondRes) - 1] : undefined;
        };
        this.includes = function (firstRes, secondRes) {
            return _this.contacts[Math.min(firstRes, secondRes) - 1] &&
                _this.contacts[Math.min(firstRes, secondRes) - 1][Math.max(firstRes, secondRes) - 1] !== undefined;
        };
        try {
            for (var scores_1 = tslib_1.__values(scores), scores_1_1 = scores_1.next(); !scores_1_1.done; scores_1_1 = scores_1.next()) {
                var score = scores_1_1.value;
                this.addCouplingScore(score);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (scores_1_1 && !scores_1_1.done && (_a = scores_1.return)) _a.call(scores_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    CouplingContainer.fromJSON = function (other) {
        return Object.assign(new CouplingContainer(), other);
    };
    CouplingContainer.getScore = function (couplingScore, scoreSource) {
        switch (scoreSource) {
            case 'cn':
                return couplingScore.cn;
            case 'dist':
                return couplingScore.dist;
            case 'dist_intra':
                return couplingScore.dist_intra;
            case 'dist_multimer':
                return couplingScore.dist_multimer;
            case 'fn':
                return couplingScore.fn;
            case 'probability':
                return couplingScore.probability;
            case 'precision':
                return couplingScore.precision;
            case 'score':
                return couplingScore.score;
            default:
                console.log("Unknown score source " + scoreSource);
        }
        return undefined;
    };
    Object.defineProperty(CouplingContainer.prototype, "isDerivedFromCouplingScores", {
        get: function () {
            return this.derivedFromCouplingScoresFlag;
        },
        set: function (value) {
            this.derivedFromCouplingScoresFlag = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CouplingContainer.prototype, "allContacts", {
        get: function () {
            return this.contacts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CouplingContainer.prototype, "chainLength", {
        get: function () {
            return this.indexRange.max - this.indexRange.min + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CouplingContainer.prototype, "rankedContacts", {
        get: function () {
            var _this = this;
            return Array.from(this).sort(function (a, b) {
                var aScore = CouplingContainer.getScore(a, _this.scoreSource);
                var bScore = CouplingContainer.getScore(b, _this.scoreSource);
                if (aScore && bScore) {
                    return bScore - aScore;
                }
                else if (aScore && !bScore) {
                    return -1;
                }
                else if (!aScore && bScore) {
                    return 1;
                }
                return 0;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CouplingContainer.prototype, "residueIndexRange", {
        get: function () {
            return this.indexRange;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CouplingContainer.prototype, "sequence", {
        get: function () {
            var result = '';
            for (var i = this.indexRange.min; i <= this.indexRange.max; ++i) {
                var aminoAcid = this.getAminoAcidOfContact(i);
                if (aminoAcid) {
                    result += aminoAcid.singleLetterCode;
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CouplingContainer.prototype, "totalContacts", {
        get: function () {
            return this.totalStoredContacts;
        },
        enumerable: true,
        configurable: true
    });
    CouplingContainer.prototype[Symbol.iterator] = function () {
        return this;
    };
    /**
     * Add a coupling score to this collection. If there is already an entry for this (i,j) contact, it will be overridden!
     *
     * @param score A Coupling Score to add to the collection.
     */
    CouplingContainer.prototype.addCouplingScore = function (score) {
        var A_i = score.A_i, A_j = score.A_j, i = score.i, j = score.j;
        var minResidueIndex = Math.min(i, j) - 1;
        var maxResidueIndex = Math.max(i, j) - 1;
        var isFlipped = minResidueIndex + 1 === j;
        if (!this.contacts[minResidueIndex]) {
            this.contacts[minResidueIndex] = new Array();
        }
        if (!this.contacts[minResidueIndex][maxResidueIndex]) {
            this.totalStoredContacts++;
        }
        this.contacts[minResidueIndex][maxResidueIndex] = tslib_1.__assign(tslib_1.__assign({}, this.contacts[minResidueIndex][maxResidueIndex]), score);
        if (isFlipped) {
            this.contacts[minResidueIndex][maxResidueIndex].i = j;
            this.contacts[minResidueIndex][maxResidueIndex].j = i;
            if (A_i && A_j) {
                this.contacts[minResidueIndex][maxResidueIndex].A_i = A_j;
                this.contacts[minResidueIndex][maxResidueIndex].A_j = A_i;
            }
        }
        this.indexRange = {
            max: Math.max(this.indexRange.max, maxResidueIndex + 1),
            min: Math.min(this.indexRange.min, minResidueIndex + 1),
        };
    };
    CouplingContainer.prototype.getAminoAcidOfContact = function (resno) {
        var e_2, _a, e_3, _b;
        if (resno > this.chainLength + 1) {
            return undefined;
        }
        try {
            for (var _c = tslib_1.__values(this.allContacts), _d = _c.next(); !_d.done; _d = _c.next()) {
                var outerContact = _d.value;
                if (outerContact) {
                    try {
                        for (var outerContact_1 = (e_3 = void 0, tslib_1.__values(outerContact)), outerContact_1_1 = outerContact_1.next(); !outerContact_1_1.done; outerContact_1_1 = outerContact_1.next()) {
                            var innerContact = outerContact_1_1.value;
                            if (innerContact && innerContact.i === resno && innerContact.A_i) {
                                return data_1.AminoAcid.fromSingleLetterCode(innerContact.A_i);
                            }
                            else if (innerContact && innerContact.j === resno && innerContact.A_j) {
                                return data_1.AminoAcid.fromSingleLetterCode(innerContact.A_j);
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (outerContact_1_1 && !outerContact_1_1.done && (_b = outerContact_1.return)) _b.call(outerContact_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return undefined;
    };
    /**
     * Determine which contacts in this coupling container are observed.
     *
     * @param [distFilter=10] - For each score, if dist <= distFilter, it is considered observed.
     * @returns Contacts that should be considered observed in the current data set.
     */
    CouplingContainer.prototype.getObservedContacts = function (distFilter) {
        var e_4, _a;
        if (distFilter === void 0) { distFilter = 10; }
        var result = new Array();
        try {
            for (var _b = tslib_1.__values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var score = _c.value;
                if (score.dist && score.dist <= distFilter) {
                    result.push(score);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    /**
     * Determine which contacts in this coupling container are both predicted and correct.
     *
     * @param totalPredictionsToShow How many predictions, max, to return.
     * @param [linearDistFilter=5] For each score, if |i - j| >= linearDistFilter, it will be a candidate for being correct/incorrect.
     * @param [measuredContactDistFilter=5]  If the dist for the contact is less than predictionCutoffDist, it is considered correct.
     * @returns An object containing 2 array fields: correct and predicted.
     */
    CouplingContainer.prototype.getPredictedContacts = function (totalPredictionsToShow, measuredContactDistFilter, filters) {
        var e_5, _a;
        if (measuredContactDistFilter === void 0) { measuredContactDistFilter = 5; }
        if (filters === void 0) { filters = []; }
        var result = {
            correct: new Array(),
            predicted: new Array(),
        };
        try {
            for (var _b = tslib_1.__values(this.rankedContacts
                .filter(function (score) { return filters.reduce(function (prev, filter) { return prev && filter.filterFn(score); }, true); })
                .slice(0, totalPredictionsToShow)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var contact = _c.value;
                if (contact.dist && contact.dist < measuredContactDistFilter) {
                    result.correct.push(contact);
                }
                result.predicted.push(contact);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    };
    CouplingContainer.prototype.next = function () {
        for (var i = this.rowCounter; i < this.contacts.length; ++i) {
            if (this.contacts[i]) {
                for (var j = this.colCounter; j < this.contacts[i].length; ++j) {
                    var score = this.contacts[i][j];
                    if (score) {
                        this.rowCounter = i;
                        this.colCounter = j + 1;
                        return {
                            done: false,
                            value: score,
                        };
                    }
                }
                this.colCounter = 0;
            }
        }
        this.rowCounter = 0;
        this.colCounter = 0;
        return {
            done: true,
            value: null,
        };
    };
    CouplingContainer.prototype.updateContact = function (i, j, couplingScore) {
        this.addCouplingScore(tslib_1.__assign({ i: i, j: j }, couplingScore));
    };
    return CouplingContainer;
}());
exports.CouplingContainer = CouplingContainer;
//# sourceMappingURL=CouplingContainer.js.map