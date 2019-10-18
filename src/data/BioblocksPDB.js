"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var NGL = require("ngl");
var data_1 = require("~bioblocks-viz~/data");
/**
 * A BioblocksPDB instance provides an API to interact with a loaded PDB file while hiding the implementation details of how it is loaded.
 *
 * @export
 */
var BioblocksPDB = /** @class */ (function () {
    function BioblocksPDB() {
        this.fileName = '';
        this.nglData = new NGL.Structure();
        this.getSecStructFromNGLResidue = function (residue, result) {
            var chainIndex = residue.chainIndex;
            while (!result[chainIndex]) {
                result.push(new Array());
            }
            var structId = 'C';
            if (residue.isSheet()) {
                structId = 'E';
            }
            else if (residue.isHelix()) {
                structId = 'H';
            }
            if (result[chainIndex].length >= 1 && result[chainIndex][result[chainIndex].length - 1].label === structId) {
                result[chainIndex][result[chainIndex].length - 1].updateEnd(residue.resno);
            }
            else {
                result[chainIndex].push(new data_1.Bioblocks1DSection(structId, residue.resno));
            }
        };
    }
    Object.defineProperty(BioblocksPDB.prototype, "contactInformation", {
        get: function () {
            var _this = this;
            if (!this.contactInfo) {
                var result_1 = new data_1.CouplingContainer();
                this.nglData.eachResidue(function (outerResidue) {
                    if (outerResidue.isProtein()) {
                        var i_1 = outerResidue.resno;
                        _this.nglData.eachResidue(function (innerResidue) {
                            var j = innerResidue.resno;
                            if (innerResidue.isProtein() && i_1 !== j) {
                                result_1.addCouplingScore({
                                    dist: _this.getMinDistBetweenResidues(i_1, j).dist,
                                    i: i_1,
                                    j: j,
                                });
                            }
                        });
                    }
                });
                this.contactInfo = result_1;
            }
            return this.contactInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BioblocksPDB.prototype, "name", {
        get: function () {
            var splitName = this.fileName.split('/');
            var lastPart = splitName[splitName.length - 1];
            var lastIndex = lastPart.lastIndexOf('.');
            return lastPart.slice(0, lastIndex === -1 ? undefined : lastIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BioblocksPDB.prototype, "nglStructure", {
        get: function () {
            return this.nglData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BioblocksPDB.prototype, "rank", {
        get: function () {
            return 'UNK';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BioblocksPDB.prototype, "secondaryStructure", {
        get: function () {
            var result = new Array();
            this.nglData.eachResidue(function (residue) {
                if (residue.isProtein()) {
                    var structId = 'C';
                    if (residue.isSheet()) {
                        structId = 'E';
                    }
                    else if (residue.isHelix()) {
                        structId = 'H';
                    }
                    else if (residue.isTurn()) {
                        return;
                    }
                    result.push({ resno: residue.resno, structId: structId });
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BioblocksPDB.prototype, "secondaryStructureSections", {
        get: function () {
            var _this = this;
            var result = new Array();
            this.nglData.eachResidue(function (residue) {
                if (residue.isProtein()) {
                    _this.getSecStructFromNGLResidue(residue, result);
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BioblocksPDB.prototype, "sequence", {
        get: function () {
            return this.nglData ? this.nglData.getSequence().join('') : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BioblocksPDB.prototype, "source", {
        get: function () {
            return 'UKN';
        },
        enumerable: true,
        configurable: true
    });
    BioblocksPDB.createEmptyPDB = function () {
        return new BioblocksPDB();
    };
    /**
     * Creates an instance of BioblocksPDB with PDB data.
     *
     * !IMPORTANT! Since fetching the data is an asynchronous action, this must be used to create a new instance!
     */
    BioblocksPDB.createPDB = function (file) {
        if (file === void 0) { file = ''; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = new BioblocksPDB();
                        _a = result;
                        return [4 /*yield*/, NGL.autoLoad(file)];
                    case 1:
                        _a.nglData = (_b.sent());
                        result.fileName = typeof file === 'string' ? file : file.name;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BioblocksPDB.createPDBFromNGLData = function (nglData) {
        var result = new BioblocksPDB();
        result.nglData = nglData;
        result.fileName = nglData.path ? nglData.path : nglData.name;
        return result;
    };
    BioblocksPDB.prototype.eachResidue = function (callback) {
        this.nglData.eachResidue(callback);
    };
    /**
     * Given some existing coupling scores, a new CouplingContainer will be created with data augmented with info derived from this PDB.
     *
     * @param couplingScores A collection of coupling scores to be augmented.
     * @param measuredProximity How to calculate the distance between two residues.
     * @returns A CouplingContainer with contact information from both the original array and this PDB file.
     */
    BioblocksPDB.prototype.amendPDBWithCouplingScores = function (couplingScores, measuredProximity) {
        var _this = this;
        var result = new data_1.CouplingContainer(couplingScores);
        var alphaId = this.nglData.atomMap.dict[BioblocksPDB.NGL_C_ALPHA_INDEX];
        var minDist = {};
        this.nglData.eachResidue(function (outerResidue) {
            _this.nglData.eachResidue(function (innerResidue) {
                if (outerResidue.isProtein() && innerResidue.isProtein()) {
                    if (measuredProximity === data_1.CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
                        var firstResidueCAlphaIndex = _this.getCAlphaAtomIndexFromResidue(outerResidue.index, alphaId);
                        var secondResidueCAlphaIndex = _this.getCAlphaAtomIndexFromResidue(innerResidue.index, alphaId);
                        var dist = _this.nglData
                            .getAtomProxy(firstResidueCAlphaIndex)
                            .distanceTo(_this.nglData.getAtomProxy(secondResidueCAlphaIndex));
                        if (dist !== 0) {
                            result.addCouplingScore({
                                dist: dist,
                                i: outerResidue.resno,
                                j: innerResidue.resno,
                            });
                        }
                    }
                    else {
                        var key = Math.min(outerResidue.resno, innerResidue.resno) + "," + Math.max(outerResidue.resno, innerResidue.resno);
                        if (!minDist[key]) {
                            minDist[key] = _this.getMinDistBetweenResidueIndices(outerResidue.index, innerResidue.index).dist;
                        }
                        if (minDist[key] !== 0) {
                            result.addCouplingScore({
                                dist: minDist[key],
                                i: outerResidue.resno,
                                j: innerResidue.resno,
                            });
                        }
                    }
                }
            });
        });
        this.contactInfo = result;
        return this.contactInfo;
    };
    /**
     * Find the index of the c-alpha atom for a given residue.
     *
     * @param residueIndex Index of the residue to find the c-alpha atom for.
     * @param alphaId Index that determines if an atom is a c-alpha.
     * @returns Index of the c-alpha atom with respect to the array of all of the atoms.
     */
    BioblocksPDB.prototype.getCAlphaAtomIndexFromResidue = function (residueIndex, alphaId) {
        var residueStore = this.nglData.residueStore;
        var atomOffset = residueStore.atomOffset[residueIndex];
        var atomCount = residueStore.atomCount[residueIndex];
        var result = atomOffset;
        while (residueStore.residueTypeId[result] !== alphaId && result < atomOffset + atomCount) {
            result++;
        }
        return result;
    };
    /**
     * Helper function to find the smallest possible distance between two residues via their atoms.
     *
     * @param resnoI The first residue.
     * @param resnoJ The second residue.
     * @returns Shortest distance between the two residues in ångströms.
     */
    BioblocksPDB.prototype.getMinDistBetweenResidues = function (resnoI, resnoJ) {
        return this.getMinDistBetweenResidueIndices(this.nglData.residueStore.resno.indexOf(resnoI), this.nglData.residueStore.resno.indexOf(resnoJ));
    };
    BioblocksPDB.prototype.getResidueNumberingMismatches = function (contacts) {
        var result = new Array();
        this.eachResidue(function (residue) {
            var pdbResCode = residue.resname.toUpperCase();
            var couplingAminoAcid = contacts.getAminoAcidOfContact(residue.resno);
            if (couplingAminoAcid &&
                data_1.AminoAcid.fromSingleLetterCode(pdbResCode) !==
                    data_1.AminoAcid.fromSingleLetterCode(couplingAminoAcid.singleLetterCode)) {
                var caa = data_1.AminoAcid.fromSingleLetterCode(couplingAminoAcid.singleLetterCode);
                var paa = data_1.AminoAcid.fromSingleLetterCode(pdbResCode);
                if (caa && paa) {
                    result.push({
                        couplingAminoAcid: caa,
                        pdbAminoAcid: paa,
                        resno: residue.resno,
                    });
                }
            }
        });
        return result;
    };
    BioblocksPDB.prototype.getTrimmedName = function (separator, wordsToTrim, direction) {
        if (separator === void 0) { separator = '_'; }
        if (wordsToTrim === void 0) { wordsToTrim = 3; }
        if (direction === void 0) { direction = 'back'; }
        var splitName = this.name.split(separator);
        if (splitName.length > wordsToTrim) {
            return (direction === 'back'
                ? splitName.slice(0, splitName.length - wordsToTrim)
                : splitName.slice(wordsToTrim)).join(separator);
        }
        else {
            return this.name;
        }
    };
    /**
     * Helper function to find the smallest possible distance between two residues via their atoms.
     *
     * @param indexI Index of the first residue with respect to the array of all residues.
     * @param indexJ Index of the second residue with respect to the array of all residues.
     * @returns Shortest distance between the two residues in ångströms.
     */
    BioblocksPDB.prototype.getMinDistBetweenResidueIndices = function (indexI, indexJ) {
        var residueStore = this.nglData.residueStore;
        var firstResCount = residueStore.atomCount[indexI];
        var secondResCount = residueStore.atomCount[indexJ];
        var firstAtomIndex = residueStore.atomOffset[indexI];
        var secondAtomIndex = residueStore.atomOffset[indexJ];
        var result = {
            atomIndexI: -1,
            atomIndexJ: -1,
            dist: Number.MAX_SAFE_INTEGER,
        };
        for (var firstCounter = 0; firstCounter < firstResCount; ++firstCounter) {
            for (var secondCounter = 0; secondCounter < secondResCount; ++secondCounter) {
                var atomIndexI = firstAtomIndex + firstCounter;
                var atomIndexJ = secondAtomIndex + secondCounter;
                var dist = this.nglData.getAtomProxy(atomIndexI).distanceTo(this.nglData.getAtomProxy(atomIndexJ));
                if (dist < result.dist) {
                    result = {
                        atomIndexI: atomIndexI,
                        atomIndexJ: atomIndexJ,
                        dist: dist,
                    };
                }
            }
        }
        return result;
    };
    BioblocksPDB.NGL_C_ALPHA_INDEX = 'CA|C';
    return BioblocksPDB;
}());
exports.BioblocksPDB = BioblocksPDB;
//# sourceMappingURL=BioblocksPDB.js.map