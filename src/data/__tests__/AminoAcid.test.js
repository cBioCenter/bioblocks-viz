"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var NGL = require("ngl");
var data_1 = require("~bioblocks-viz~/data");
describe('Amino Acids', function () {
    it('Should correctly have all single letter codes.', function () {
        var expected = [
            'A',
            'R',
            'N',
            'D',
            'C',
            'Q',
            'E',
            'G',
            'H',
            'I',
            'L',
            'K',
            'M',
            'F',
            'P',
            'S',
            'T',
            'W',
            'Y',
            'V',
        ];
        expect(data_1.AminoAcid.ALL_1LETTER_CODES()).toEqual(expected);
    });
    it('Should correctly have all single letter codes.', function () {
        var expected = [
            'ALA',
            'ARG',
            'ASN',
            'ASP',
            'CYS',
            'GLN',
            'GLU',
            'GLY',
            'HIS',
            'ILE',
            'LEU',
            'LYS',
            'MET',
            'PHE',
            'PRO',
            'SER',
            'THR',
            'TRP',
            'TYR',
            'VAL',
        ];
        expect(data_1.AminoAcid.ALL_3LETTER_CODES()).toEqual(expected);
    });
});
describe('Sequence Mismatch', function () {
    // Taken from 1g68 dataset.
    var firstSequence = 'LAQTQASMERNDAIVKIGHSIFDVYTS';
    var secondSequence = 'LAQTQASMARNDAIVKIGHSIFDVYTS';
    it('Should correctly report sequence mismatches.', function () {
        var expected = [
            {
                couplingAminoAcid: data_1.AminoAcid.GlutamicAcid,
                pdbAminoAcid: data_1.AminoAcid.Alanine,
                resno: 8,
            },
        ];
        expect(data_1.getSequenceMismatch(firstSequence, secondSequence)).toEqual(expected);
    });
    it('Should correctly report no sequence mismatch from empty PDB and CouplingContainer.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var pdb, couplings, expected;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB()];
                case 1:
                    pdb = _a.sent();
                    couplings = new data_1.CouplingContainer();
                    expected = [];
                    expect(data_1.getPDBAndCouplingMismatch(pdb, couplings)).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should correctly report a sequence mismatch from PDB and CouplingContainer.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var pdb, couplings, expected;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data_1.BioblocksPDB.createPDB = jest.fn(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                        var nglData;
                        return tslib_1.__generator(this, function (_a) {
                            nglData = new NGL.Structure('test', '');
                            nglData.getSequence = jest.fn(function () { return secondSequence.split(''); });
                            return [2 /*return*/, data_1.BioblocksPDB.createPDBFromNGLData(nglData)];
                        });
                    }); });
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB()];
                case 1:
                    pdb = _a.sent();
                    couplings = new data_1.CouplingContainer(firstSequence.split('').map(function (char, index) { return ({
                        A_i: char,
                        A_j: char,
                        i: index + 1,
                        j: index + 1,
                    }); }));
                    expected = [
                        {
                            couplingAminoAcid: data_1.AminoAcid.Alanine,
                            pdbAminoAcid: data_1.AminoAcid.GlutamicAcid,
                            resno: 8,
                        },
                    ];
                    expect(data_1.getPDBAndCouplingMismatch(pdb, couplings)).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should correctly report empty mismatches for PDB and CouplingContainer with different length sequence.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var pdb, couplings;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('sample.pdb')];
                case 1:
                    pdb = _a.sent();
                    couplings = new data_1.CouplingContainer(firstSequence
                        .substr(1)
                        .split('')
                        .map(function (char, index) { return ({
                        A_i: char,
                        A_j: char,
                        i: index + 1,
                        j: index + 1,
                    }); }));
                    expect(data_1.getPDBAndCouplingMismatch(pdb, couplings)).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=AminoAcid.test.js.map