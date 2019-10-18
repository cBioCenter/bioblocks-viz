"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var NGL = require("ngl");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
exports.fetchAppropriateData = function (viz, dataDir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (viz) {
            case data_1.VIZ_TYPE.T_SNE:
                return [2 /*return*/, exports.fetchTSneCoordinateData(dataDir)];
            case data_1.VIZ_TYPE.SPRING:
                return [2 /*return*/, exports.fetchSpringData(dataDir)];
            case data_1.VIZ_TYPE.NGL:
                return [2 /*return*/, exports.fetchNGLDataFromDirectory(dataDir)];
            case data_1.VIZ_TYPE.CONTACT_MAP:
            case data_1.VIZ_TYPE.INFO_PANEL:
                return [2 /*return*/, exports.fetchContactMapData(dataDir)];
            default:
                return [2 /*return*/, Promise.reject({ error: "Currently no appropriate data getter for " + viz })];
        }
        return [2 /*return*/];
    });
}); };
exports.fetchAppropriateDataFromFile = function (viz, file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = viz;
                switch (_a) {
                    case data_1.VIZ_TYPE.NGL: return [3 /*break*/, 1];
                    case data_1.VIZ_TYPE.CONTACT_MAP: return [3 /*break*/, 2];
                }
                return [3 /*break*/, 4];
            case 1: return [2 /*return*/, exports.fetchNGLDataFromFile(file)];
            case 2:
                _b = {};
                _c = exports.getCouplingScoresData;
                return [4 /*yield*/, helper_1.readFileAsText(file)];
            case 3: return [2 /*return*/, (_b.couplingScores = _c.apply(void 0, [_d.sent()]), _b)];
            case 4: return [2 /*return*/, Promise.reject({ error: "Currently no appropriate data getter for " + viz + " files" })];
        }
    });
}); };
exports.fetchSpringData = function (dataDir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var catColorData, nodes, categories;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchCategoricalColorData(dataDir + "/categorical_coloring_data.json")];
            case 1:
                catColorData = _a.sent();
                nodes = new Array();
                categories = Object.keys(catColorData);
                catColorData[categories[0]].label_list.forEach(function (label, index) {
                    nodes.push({
                        labelForCategory: categories.reduce(function (prev, category) {
                            var _a;
                            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[category] = catColorData[category].label_list[index], _a)));
                        }, {}),
                        number: index,
                    });
                });
                return [2 /*return*/, { nodes: nodes }];
        }
    });
}); };
var fetchCategoricalColorData = function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var input, result, _a, _b, key, colorData, output;
    var e_1, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, helper_1.fetchJSONFile(file)];
            case 1:
                input = (_d.sent());
                result = {};
                try {
                    for (_a = tslib_1.__values(Object.keys(input)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        key = _b.value;
                        colorData = input[key];
                        if (!colorData.label_colors || !colorData.label_list) {
                            throw new Error("Unable to parse color data - does it have keys named 'label_colors' and 'label_list'");
                        }
                        output = getParsedColor(colorData, input);
                        result[key] = output;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.fetchSpringCoordinateData = function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var coordinateText, coordinates, rows;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, helper_1.fetchCSVFile(file)];
            case 1:
                coordinateText = _a.sent();
                coordinates = [];
                rows = coordinateText ? coordinateText.split('\n') : [];
                rows.forEach(function (entry, index, array) {
                    var items = entry.split(',');
                    if (items.length >= 3) {
                        var xx = parseFloat(items[1].trim());
                        var yy = parseFloat(items[2].trim());
                        var nn = parseInt(items[0].trim(), 10);
                        coordinates[nn] = [xx, yy];
                    }
                    else if (entry.localeCompare('') !== 0) {
                        throw new Error("Unable to parse coordinate data - Row " + index + " does not have at least 3 columns!");
                    }
                });
                return [2 /*return*/, coordinates];
        }
    });
}); };
exports.fetchMatrixData = function (filePath) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var coordText, result;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, helper_1.fetchCSVFile("" + filePath)];
            case 1:
                coordText = _a.sent();
                result = [];
                coordText.split('\n').forEach(function (entry) {
                    if (entry.length > 0) {
                        var items = entry.split(',').map(Number.parseFloat);
                        result.push(items);
                    }
                });
                return [2 /*return*/, result];
        }
    });
}); };
exports.fetchTSneCoordinateData = function (dataDir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var coordText, result;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, helper_1.fetchCSVFile(dataDir + "/tsne_output.csv")];
            case 1:
                coordText = _a.sent();
                result = [];
                coordText.split('\n').forEach(function (entry) {
                    if (entry.length > 0) {
                        var items = entry.split(',');
                        var coordinates = [parseFloat(items[0]), parseFloat(items[1])];
                        result.push(coordinates);
                    }
                });
                return [2 /*return*/, result];
        }
    });
}); };
exports.fetchTensorTSneCoordinateDataFromFile = function (fileLocation) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var coordText, matrix, _a, _b, row;
    var e_2, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, helper_1.fetchCSVFile(fileLocation)];
            case 1:
                coordText = _d.sent();
                matrix = new Array();
                try {
                    for (_a = tslib_1.__values(coordText.split('\n')), _b = _a.next(); !_b.done; _b = _a.next()) {
                        row = _b.value;
                        if (row.length >= 1) {
                            matrix.push(row.split(',').map(parseFloat));
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return [2 /*return*/, matrix];
        }
    });
}); };
exports.fetchTensorTSneCoordinateData = function (dataDir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, exports.fetchTensorTSneCoordinateDataFromFile(dataDir + "/tsne_matrix.csv")];
    });
}); };
exports.fetchGraphData = function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var data;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, helper_1.fetchJSONFile(file)];
            case 1:
                data = (_a.sent());
                if (!data.nodes || !data.links) {
                    throw new Error("Unable to parse graph data - does it have keys named 'nodes' and 'links'");
                }
                return [2 /*return*/, data];
        }
    });
}); };
exports.fetchNGLDataFromDirectory = function (dir) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var file;
    return tslib_1.__generator(this, function (_a) {
        if (dir.length === 0) {
            return [2 /*return*/, Promise.reject('Empty path.')];
        }
        file = dir + "/protein.pdb";
        return [2 /*return*/, exports.fetchNGLDataFromFile(file)];
    });
}); };
exports.fetchNGLDataFromFile = function (file, params) {
    if (params === void 0) { params = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, NGL.autoLoad(file, params)];
            case 1: return [2 /*return*/, (_a.sent())];
        }
    }); });
};
exports.fetchContactMapData = function (dir, knownOrPredicted) {
    if (knownOrPredicted === void 0) { knownOrPredicted = 'known'; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var contactMapFiles, promiseResults, pdbFile, pdbData;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (dir.length === 0) {
                        return [2 /*return*/, Promise.reject('Empty path.')];
                    }
                    contactMapFiles = ['coupling_scores.csv', 'residue_mapping.csv'];
                    return [4 /*yield*/, Promise.all(contactMapFiles.map(function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            return [2 /*return*/, helper_1.fetchCSVFile(dir + "/" + file)];
                        }); }); }))];
                case 1:
                    promiseResults = _b.sent();
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB(dir + "/protein.pdb")];
                case 2:
                    pdbFile = _b.sent();
                    pdbData = (_a = {},
                        _a[knownOrPredicted] = pdbFile,
                        _a);
                    return [2 /*return*/, {
                            couplingScores: pdbFile.amendPDBWithCouplingScores(exports.getCouplingScoresData(promiseResults[0], helper_1.generateResidueMapping(promiseResults[1])).rankedContacts, data_1.CONTACT_DISTANCE_PROXIMITY.CLOSEST),
                            pdbData: pdbData,
                            secondaryStructures: [],
                        }];
            }
        });
    });
};
var getParsedColor = function (colorData, input) {
    var e_3, _a;
    var output = {
        label_colors: {},
        label_list: colorData.label_list,
    };
    var label_colors = input[Object.keys(input)[0]].label_colors;
    try {
        // The input file might specify hex values as either 0xrrggbb or #rrggbb, so we need to convert the input to a consistent output format.
        for (var _b = tslib_1.__values(Object.keys(label_colors)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var labelColorKey = _c.value;
            var hex = label_colors[labelColorKey];
            if (typeof hex === 'number') {
                output.label_colors[labelColorKey] = hex;
            }
            else if (hex.charAt(0) === '#') {
                output.label_colors[labelColorKey] = Number.parseInt("0x" + hex.slice(1), 16);
            }
            else {
                output.label_colors[labelColorKey] = Number.parseInt(hex, 16);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return output;
};
/**
 * Parses a coupling_scores.csv file to generate the appropriate data structure.
 *
 * !Important!
 * Currently 12 fields are assumed to be part of a single coupling score.
 * As such, any rows with less will be ignored.
 *
 * @param line The csv file as a single string.
 * @param residueMapping Maps the coupling_score.csv residue number to the residue number for the PDB.
 * @returns Array of CouplingScores suitable for bioblocks-viz consumption.
 */
exports.getCouplingScoresData = function (line, residueMapping) {
    if (residueMapping === void 0) { residueMapping = []; }
    var headerRow = line.split('\n')[0].split(',');
    var isHeaderPresent = isCouplingHeaderPresent(headerRow);
    var headerIndices = helper_1.getCouplingHeaderIndices(headerRow, isHeaderPresent);
    var couplingScores = new data_1.CouplingContainer();
    line
        .split('\n')
        .slice(isHeaderPresent ? 1 : 0)
        .filter(function (row) { return row.split(',').length >= 2; })
        .map(function (row) {
        var items = row.split(',');
        var score = getCouplingScoreFromCSVRow(items, headerIndices);
        if (residueMapping.length >= 1) {
            var mappingIndexI = residueMapping.findIndex(function (mapping) { return mapping.couplingsResno === score.i; });
            var mappingIndexJ = residueMapping.findIndex(function (mapping) { return mapping.couplingsResno === score.j; });
            couplingScores.addCouplingScore(tslib_1.__assign(tslib_1.__assign({}, score), { A_i: residueMapping[mappingIndexI].pdbResCode, A_j: residueMapping[mappingIndexJ].pdbResCode, i: residueMapping[mappingIndexI].pdbResno, j: residueMapping[mappingIndexJ].pdbResno }));
        }
        else {
            couplingScores.addCouplingScore(score);
        }
    });
    return couplingScores;
};
var isCouplingHeaderPresent = function (headerRow) {
    return ['cn', 'dist', 'i', 'j'].filter(function (row) { return headerRow.includes(row); }).length >= 1;
};
var getCouplingScoreFromCSVRow = function (row, headerIndices) {
    return Object.entries(headerIndices).reduce(function (prev, headerName) {
        var _a;
        var couplingKey = headerName[0];
        var couplingKeyIndex = headerName[1];
        return tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[couplingKey] = isNaN(Number(row[couplingKeyIndex])) ? row[couplingKeyIndex] : Number(row[couplingKeyIndex]), _a));
    }, { i: -1, j: -1 });
};
exports.augmentCouplingScoresWithResidueMapping = function (couplingScores, residueMapping) {
    var e_4, _a;
    if (residueMapping === void 0) { residueMapping = []; }
    var result = new data_1.CouplingContainer();
    var _loop_1 = function (couplingScore) {
        var mappedIndexI = residueMapping.findIndex(function (mapping) { return mapping.couplingsResno === couplingScore.i; });
        var mappedIndexJ = residueMapping.findIndex(function (mapping) { return mapping.couplingsResno === couplingScore.j; });
        result.addCouplingScore(tslib_1.__assign(tslib_1.__assign({}, couplingScore), { A_i: residueMapping[mappedIndexI].pdbResCode, A_j: residueMapping[mappedIndexJ].pdbResCode, i: residueMapping[mappedIndexI].pdbResno, j: residueMapping[mappedIndexJ].pdbResno }));
    };
    try {
        for (var couplingScores_1 = tslib_1.__values(couplingScores), couplingScores_1_1 = couplingScores_1.next(); !couplingScores_1_1.done; couplingScores_1_1 = couplingScores_1.next()) {
            var couplingScore = couplingScores_1_1.value;
            _loop_1(couplingScore);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (couplingScores_1_1 && !couplingScores_1_1.done && (_a = couplingScores_1.return)) _a.call(couplingScores_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return result;
};
/**
 * Parses a distance_map.csv file to generate the appropriate secondary structure mapping.
 *
 * !Important!
 * The first line in the csv will be ignored as it is assumed to be a csv header.
 *
 * !Important!
 * Currently 3 fields are assumed to be part of a single entry, with the second and third actually being relevant.
 * As such, any other rows will be ignored.
 *
 * @param line The csv file as a single string.
 * @returns Array of SecondaryStructure mappings suitable for bioblocks-viz consumption.
 */
exports.getSecondaryStructureData = function (line) {
    return line
        .split('\n')
        .slice(1)
        .filter(function (row) { return row.split(',').length >= 3; })
        .map(function (row) {
        var items = row.split(',');
        return {
            resno: parseFloat(items[1]),
            structId: items[2],
        };
    });
};
/**
 * Randomly select and return "n" objects or indices (if returnIndices==true) and return
 * in a new array.
 *
 * If "n" is larger than the array, return the array directly or all the indices in the
 * array (if returnIndices==true).
 *
 * No duplicates are returned
 */
function subsample(arr, n, returnIndices) {
    if (returnIndices === void 0) { returnIndices = false; }
    var unselectedObjBowl = returnIndices ? arr.map(function (obj, idx) { return idx; }) : tslib_1.__spread(arr);
    if (n >= arr.length) {
        return unselectedObjBowl;
    }
    var toReturn = new Array();
    while (toReturn.length < n) {
        // tslint:disable-next-line: insecure-random
        var randomIdx = Math.floor(Math.random() * unselectedObjBowl.length); // btw 0 and length of in sequenceBowl
        toReturn.push(unselectedObjBowl[randomIdx]);
        unselectedObjBowl.splice(randomIdx, 1);
    }
    return toReturn;
}
exports.subsample = subsample;
//# sourceMappingURL=DataHelper.js.map