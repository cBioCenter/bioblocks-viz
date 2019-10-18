"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data");
describe('BioblocksPDB', function () {
    it('Should handle loading an existing PDB file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = data_1.BioblocksPDB.createPDB('protein.pdb');
                    return [4 /*yield*/, expect(result).toBeDefined()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle loading a non-existent PDB file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(1);
                    return [4 /*yield*/, expect(data_1.BioblocksPDB.createPDB('error/protein.pdb')).rejects.toEqual('Invalid NGL path.')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should correctly handle naming the pdb.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('protein.pdb')];
                case 1:
                    result = _a.sent();
                    expect(result.name).toEqual('protein');
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('folder/protein.pdb')];
                case 2:
                    result = _a.sent();
                    expect(result.name).toEqual('protein');
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('protein')];
                case 3:
                    result = _a.sent();
                    expect(result.name).toEqual('protein');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should correctly handle getting the secondary structure.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var expected, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = [{ resno: 1, structId: 'H' }, { resno: 2, structId: 'E' }];
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('sample.pdb')];
                case 1:
                    result = _a.sent();
                    expect(result.secondaryStructure).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should correctly handle getting the secondary structure sections.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var expected, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = [
                        [
                            { label: 'H', sectionEnd: 1, sectionStart: 1 },
                            { label: 'E', sectionEnd: 2, sectionStart: 2 },
                            { label: 'C', sectionEnd: 3, sectionStart: 3 },
                        ],
                    ];
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('sample.pdb')];
                case 1:
                    result = _a.sent();
                    expect(result.secondaryStructureSections).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should correctly handle getting the secondary structure sections for multiple chains.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var expected, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = [
                        [
                            { label: 'H', sectionEnd: 1, sectionStart: 1 },
                            { label: 'E', sectionEnd: 2, sectionStart: 2 },
                            { label: 'C', sectionEnd: 3, sectionStart: 3 },
                        ],
                        [{ label: 'H', sectionEnd: 3, sectionStart: 1 }],
                    ];
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('chain.pdb')];
                case 1:
                    result = _a.sent();
                    expect(result.secondaryStructureSections).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Residue distances', function () {
        it('Should report the minimum distance between the same residue as 0.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var nglData;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('sample.pdb')];
                    case 1:
                        nglData = _a.sent();
                        expect(nglData.getMinDistBetweenResidues(1, 1).dist).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should report the minimum distance between two discrete residues.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var nglData;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('sample.pdb')];
                    case 1:
                        nglData = _a.sent();
                        expect(nglData.getMinDistBetweenResidues(1, 2).dist).toEqual(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Getting a trimmed name', function () {
        it('should trim the last 3 underscores by default.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('protein_0_1_2.pdb')];
                    case 1:
                        result = _a.sent();
                        expect(result.getTrimmedName()).toEqual('protein');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not trim by default if there are 2 or fewer underscored words.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('protein_2_3.pdb')];
                    case 1:
                        result = _a.sent();
                        expect(result.getTrimmedName()).toEqual('protein_2_3');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow trimming the first 3 underscores.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('0_1_2_3_protein.pdb')];
                    case 1:
                        result = _a.sent();
                        expect(result.getTrimmedName('_', 3, 'front')).toEqual('3_protein');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow trimming a different character.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('protein-0-1-2-3.pdb')];
                    case 1:
                        result = _a.sent();
                        expect(result.getTrimmedName('-')).toEqual('protein-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow trimming a different number of words.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('protein_0_1_2_3.pdb')];
                    case 1:
                        result = _a.sent();
                        expect(result.getTrimmedName('_', 2)).toEqual('protein_0_1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid word counts by not trimming.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('protein_0_1_2_3.pdb')];
                    case 1:
                        result = _a.sent();
                        expect(result.getTrimmedName('_', -1)).toEqual('protein_0_1_2_3');
                        expect(result.getTrimmedName('_', 10)).toEqual('protein_0_1_2_3');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=BioblocksPDB.test.js.map