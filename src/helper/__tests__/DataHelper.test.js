"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// tslint:disable-next-line:no-import-side-effect
require("jest-fetch-mock");
var util_1 = require("util");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
describe('DataHelper', function () {
    beforeEach(function () {
        global.fetch.resetMocks();
    });
    it('Should throw an error when attempting to fetch data for an unsupported visualization type.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var badVizType;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    badVizType = 'Imagination';
                    expect.assertions(1);
                    return [4 /*yield*/, expect(helper_1.fetchAppropriateData(badVizType, '')).rejects.toEqual({
                            error: "Currently no appropriate data getter for " + badVizType,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Contact Map', function () {
        var couplingScoresCsv = '145,81,0.79312,7.5652,A,A,0.9,2.4,47,1.0,E,R\n\
      179,66,0.78681,3.5872,A,A,0.9,1.3,37,1.0,T,M';
        var secondaryStructureCsv = ',id,sec_struct_3state\n\
      0,30,C\n\
      1,31,C';
        var couplingScoresCsvWithNewline;
        var secondaryStructureCsvWithNewline;
        beforeEach(function () {
            couplingScoresCsvWithNewline = couplingScoresCsv + "\n";
            secondaryStructureCsvWithNewline = secondaryStructureCsv + "\n";
        });
        it('Should throw on incorrect location.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var reason;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reason = 'Empty path.';
                        expect.assertions(1);
                        return [4 /*yield*/, expect(helper_1.fetchAppropriateData(data_1.VIZ_TYPE.CONTACT_MAP, '')).rejects.toBe(reason)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        var couplingScoresCsvWithHeaders = "i,j,cn,dist,A_i,A_j,\n\n      145,81,0.79312,7.5652,E,R,\n      179,66,0.78681,3.5872,T,M,";
        var residueMappingCsv = 
        // tslint:disable-next-line:max-line-length
        'up_index	up_residue	ss_pred	ss_conf	msa_index	msa_cons%	msa_cons	in_const	pdb_atom	pdb_chain	pdb_index	pdb_residue	pdb_x_pos	pdb_y_pos	pdb_z_pos\n\
      66	M	H	1	66	51	*	*	340	A	68	M	11.714	0.502	32.231\n\
      81	R	H	2	81	18	*	*	448	A	83	R	-4.075	-8.650	45.662\n\
      145	E	H	8	145	14	*	*	936	A	147	E	7.560	-10.561	44.062\n\
      179	T	C	8	179	24	*	*	1219	A	181	T	12.019	-5.034	29.684';
        var firstScore = {
            A_i: 'E',
            A_j: 'R',
            cn: 0.79312,
            dist: 7.5652,
            i: 145,
            j: 81,
        };
        var firstScorePDB = {
            A_i: 'E',
            A_j: 'R',
            cn: 0.79312,
            dist: 7.5652,
            i: 147,
            j: 83,
        };
        var secondScore = {
            A_i: 'T',
            A_j: 'M',
            cn: 0.78681,
            dist: 3.5872,
            i: 179,
            j: 66,
        };
        var secondScorePDB = {
            A_i: 'T',
            A_j: 'M',
            cn: 0.78681,
            dist: 3.5872,
            i: 181,
            j: 68,
        };
        it('Should parse contact monomer data correctly.', function () {
            var data = helper_1.getCouplingScoresData(couplingScoresCsv);
            var expected = new data_1.CouplingContainer([firstScore, secondScore]);
            expect(data.allContacts).toEqual(expected.allContacts);
        });
        it('Should parse contact monomer data correctly when csv file has newline.', function () {
            var data = helper_1.getCouplingScoresData(couplingScoresCsvWithNewline);
            var expected = new data_1.CouplingContainer([firstScore, secondScore]);
            expect(data.allContacts).toEqual(expected.allContacts);
        });
        it('Should parse contact monomer data correctly when csv file has headers.', function () {
            var data = helper_1.getCouplingScoresData(couplingScoresCsvWithHeaders);
            var expected = new data_1.CouplingContainer([firstScore, secondScore]);
            expect(data.allContacts).toEqual(expected.allContacts);
        });
        it('Should allow the residue mapping and coupling score csv to be combined to generate the CouplingContainer.', function () {
            var residueMapping = helper_1.generateResidueMapping(residueMappingCsv);
            var data = helper_1.getCouplingScoresData(couplingScoresCsvWithHeaders, residueMapping);
            var expected = new data_1.CouplingContainer([firstScorePDB, secondScorePDB]);
            expect(data.allContacts).toEqual(expected.allContacts);
        });
        it('Should allow a previously created coupling score csv to be augmented with a residue mapping csv.', function () {
            var data = helper_1.getCouplingScoresData(couplingScoresCsvWithHeaders);
            var residueMapping = helper_1.generateResidueMapping(residueMappingCsv);
            var result = helper_1.augmentCouplingScoresWithResidueMapping(data, residueMapping);
            var expected = new data_1.CouplingContainer([firstScorePDB, secondScorePDB]);
            expect(result.allContacts).toEqual(expected.allContacts);
        });
        var expectedSecondaryData = [{ resno: 30, structId: 'C' }, { resno: 31, structId: 'C' }];
        it('Should parse secondary structure data correctly.', function () {
            var data = helper_1.getSecondaryStructureData(secondaryStructureCsv);
            expect(data).toEqual(expectedSecondaryData);
        });
        it('Should parse secondary structure data correctly when the csv file has newline.', function () {
            var data = helper_1.getSecondaryStructureData(secondaryStructureCsvWithNewline);
            expect(data).toEqual(expectedSecondaryData);
        });
        it('Should load pdb data if available.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, response, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('sample/protein.pdb')];
                    case 1:
                        expected = _a.sent();
                        response = {
                            couplingScores: new data_1.CouplingContainer(),
                            pdbData: { known: expected.amendPDBWithCouplingScores([], data_1.CONTACT_DISTANCE_PROXIMITY.CLOSEST) },
                            secondaryStructures: [],
                        };
                        fetchMock.mockResponse(util_1.inspect(response));
                        fetchMock.mockResponse(residueMappingCsv);
                        return [4 /*yield*/, helper_1.fetchAppropriateData(data_1.VIZ_TYPE.CONTACT_MAP, 'sample')];
                    case 2:
                        result = (_a.sent());
                        expect(util_1.inspect(result.pdbData)).toEqual(util_1.inspect({ known: expected }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('NGL', function () {
        it('Should throw on incorrect location.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var reason;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reason = 'Empty path.';
                        expect.assertions(1);
                        return [4 /*yield*/, expect(helper_1.fetchAppropriateData(data_1.VIZ_TYPE.NGL, '')).rejects.toBe(reason)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should resolve on nonempty location.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        return [4 /*yield*/, expect(helper_1.fetchAppropriateData(data_1.VIZ_TYPE.NGL, 'somewhere-over-the-rainbow')).resolves.toBeTruthy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Spring', function () {
        describe('Categorical Coloring File', function () {
            it('Should throw on incorrect location.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(helper_1.fetchSpringData('')).rejects.toThrowError()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should parse a correctly formatted categorical file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var colorData, result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            colorData = {
                                Sample: {
                                    label_colors: {
                                        P11A: '#7cff79',
                                        P11B: '#00007f',
                                        P12A: '#ff9400',
                                        P9A: '#0080ff',
                                    },
                                    label_list: ['P9A', 'P9A'],
                                },
                            };
                            fetchMock.mockResponse(JSON.stringify(colorData));
                            return [4 /*yield*/, helper_1.fetchSpringData('somewhere.place')];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual({
                                nodes: [
                                    {
                                        labelForCategory: { Sample: 'P9A' },
                                        number: 0,
                                    },
                                    {
                                        labelForCategory: { Sample: 'P9A' },
                                        number: 1,
                                    },
                                ],
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should throw on a incorrectly formatted categorical file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var colorData;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(1);
                            colorData = {
                                Sample: {
                                    label_colors: {
                                        P11A: '#7cff79',
                                        P11B: '#00007f',
                                        P12A: '#ff9400',
                                        P9A: '#0080ff',
                                    },
                                },
                            };
                            fetchMock.mockResponse(JSON.stringify(colorData));
                            return [4 /*yield*/, expect(helper_1.fetchSpringData('somewhere.place')).rejects.toBeTruthy()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('Coordinate File', function () {
            it('Should throw on incorrect column count.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fetchMock.mockResponse('1,2');
                            return [4 /*yield*/, expect(helper_1.fetchSpringCoordinateData('')).rejects.toThrowError()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should parse a correctly formatted coordinate file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var expected, result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expected = '0,21,12\n1,12,21\n';
                            fetchMock.mockResponse(expected);
                            return [4 /*yield*/, helper_1.fetchSpringCoordinateData('somewhere.place')];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual([[21, 12], [12, 21]]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should parse a empty coordinate file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fetchMock.mockResponse('');
                            return [4 /*yield*/, helper_1.fetchSpringCoordinateData('somewhere.place')];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('Graph File', function () {
            it('Should throw on incorrect location.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(1);
                            return [4 /*yield*/, expect(helper_1.fetchAppropriateData(data_1.VIZ_TYPE.SPRING, '')).rejects.toThrowError()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should parse a correctly formatted graph file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var expected, stringified, result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expected = {
                                links: [
                                    {
                                        distance: 2,
                                        source: 0,
                                        target: 1,
                                    },
                                ],
                                nodes: [
                                    {
                                        name: 0,
                                        number: 0,
                                    },
                                    {
                                        name: 1,
                                        number: 1,
                                    },
                                ],
                            };
                            stringified = JSON.stringify(expected);
                            fetchMock.mockResponse(stringified);
                            return [4 /*yield*/, helper_1.fetchGraphData(stringified)];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(expected);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('Should throw on a incorrectly formatted graph file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var expected, stringified;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect.assertions(1);
                            expected = {
                                links: [
                                    {
                                        distance: 2,
                                        source: 0,
                                        target: 1,
                                    },
                                ],
                            };
                            stringified = JSON.stringify(expected);
                            fetchMock.mockResponse(stringified);
                            return [4 /*yield*/, expect(helper_1.fetchGraphData(stringified)).rejects.toBeTruthy()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('T-SNE', function () {
        it('Should return empty data for an incorrect location.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, sampleCsv;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = [
                            [0.2586516988310038068, -5.607454590334670641],
                            [-3.112878150223143958, -3.342860779282196049],
                            [5.882927335707632821, 4.215268767108215187],
                        ];
                        sampleCsv = '2.586516988310038068e-01,-5.607454590334670641e+00\n\
        -3.112878150223143958e+00,-3.342860779282196049e+00\n\
        5.882927335707632821e+00,4.215268767108215187e+00\n';
                        fetchMock.mockResponseOnce(sampleCsv);
                        return [4 /*yield*/, expect(helper_1.fetchAppropriateData(data_1.VIZ_TYPE.T_SNE, '')).resolves.toEqual(expected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=DataHelper.test.js.map