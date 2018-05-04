"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chell_1 = require("chell");
var d3 = require("d3");
var NGL = require("ngl");
exports.fetchAppropriateData = function (viz, dataDir) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (viz) {
            case chell_1.VIZ_TYPE['T-SNE']:
                return [2 /*return*/, fetchTSneCoordinateData(dataDir)];
            case chell_1.VIZ_TYPE.SPRING:
                return [2 /*return*/, deriveSpringData(dataDir)];
            case chell_1.VIZ_TYPE.NGL:
                return [2 /*return*/, fetchNGLData(dataDir)];
            case chell_1.VIZ_TYPE.CONTACT_MAP:
                return [2 /*return*/, fetchContactMapData(dataDir)];
            default:
                return [2 /*return*/, Promise.reject({ error: "Currently no appropriate data getter for " + viz })];
        }
        return [2 /*return*/];
    });
}); };
var deriveSpringData = function (dataDir) { return __awaiter(_this, void 0, void 0, function () {
    var coordinates, graphData, catColorData, nodeDict, i, node, label;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchSpringCoordinateData(dataDir + "/coordinates.txt")];
            case 1:
                coordinates = _a.sent();
                return [4 /*yield*/, fetchGraphData(dataDir + "/graph_data.json")];
            case 2:
                graphData = _a.sent();
                return [4 /*yield*/, fetchCategoricalColorData(dataDir + "/categorical_coloring_data.json")];
            case 3:
                catColorData = _a.sent();
                nodeDict = {};
                for (i = 0; i < graphData.nodes.length; ++i) {
                    node = graphData.nodes[i];
                    nodeDict[node.number] = node;
                    if (node.number in coordinates) {
                        node.fixed = true;
                        node.x = coordinates[node.number][0];
                        node.y = coordinates[node.number][1];
                    }
                    label = catColorData.label_list[i];
                    node.category = label;
                    node.colorHex = catColorData.label_colors[label];
                }
                graphData.links.forEach(function (link) {
                    var source = nodeDict[link.source];
                    var target = nodeDict[link.target];
                    if (source && target) {
                        link.source = source;
                        link.target = target;
                    }
                });
                return [2 /*return*/, graphData];
        }
    });
}); };
var fetchCategoricalColorData = function (file) { return __awaiter(_this, void 0, void 0, function () {
    var input, output, label_colors, _i, _a, key, hex;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, d3.json(file)];
            case 1:
                input = (_b.sent());
                output = {
                    label_colors: {},
                    label_list: input[Object.keys(input)[0]].label_list,
                };
                label_colors = input[Object.keys(input)[0]].label_colors;
                // The input file might specify hex values as either 0xrrggbb or #rrggbb, so we might need to convert the input to a consistent output format.
                for (_i = 0, _a = Object.keys(label_colors); _i < _a.length; _i++) {
                    key = _a[_i];
                    hex = label_colors[key];
                    if (typeof hex === 'number') {
                        output.label_colors[key] = hex;
                    }
                    else if (hex.charAt(0) === '#') {
                        output.label_colors[key] = Number.parseInt('0x' + hex.slice(1));
                    }
                    else {
                        output.label_colors[key] = Number.parseInt(hex);
                    }
                }
                return [2 /*return*/, output];
        }
    });
}); };
exports.fetchColorData = function (file) { return __awaiter(_this, void 0, void 0, function () {
    var colorText, dict;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d3.text(file)];
            case 1:
                colorText = _a.sent();
                dict = {};
                colorText.split('\n').forEach(function (entry, index, array) {
                    if (entry.length > 0) {
                        var items = entry.split(',');
                        var gene = items[0];
                        var expArray_1 = [];
                        items.forEach(function (e, i, a) {
                            if (i > 0) {
                                expArray_1.push(parseFloat(e));
                            }
                        });
                        dict[gene] = expArray_1;
                    }
                });
                return [2 /*return*/, dict];
        }
    });
}); };
var fetchSpringCoordinateData = function (file) { return __awaiter(_this, void 0, void 0, function () {
    var coordinateText, coordinates;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d3.text(file)];
            case 1:
                coordinateText = _a.sent();
                coordinates = [];
                coordinateText.split('\n').forEach(function (entry, index, array) {
                    var items = entry.split(',');
                    if (items.length >= 3) {
                        var xx = parseFloat(items[1].trim());
                        var yy = parseFloat(items[2].trim());
                        var nn = parseInt(items[0].trim(), 10);
                        coordinates[nn] = [xx, yy];
                    }
                });
                return [2 /*return*/, coordinates];
        }
    });
}); };
var fetchTSneCoordinateData = function (dataDir) { return __awaiter(_this, void 0, void 0, function () {
    var colorText, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d3.text(dataDir + "/tsne_output.csv")];
            case 1:
                colorText = _a.sent();
                result = [];
                colorText.split('\n').forEach(function (entry, index, array) {
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
var fetchGraphData = function (file) { return __awaiter(_this, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d3.json(file)];
            case 1:
                data = (_a.sent());
                if (!data.nodes || !data.links) {
                    throw new Error('Unable to parse graph_data - does it have node key(s)?');
                }
                return [2 /*return*/, data];
        }
    });
}); };
var fetchNGLData = function (dir) { return __awaiter(_this, void 0, void 0, function () {
    var file, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = dir + "/protein.pdb";
                return [4 /*yield*/, NGL.autoLoad(file)];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
var fetchContactMapData = function (dir) { return __awaiter(_this, void 0, void 0, function () {
    var contactMapFiles, promiseResults, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contactMapFiles = ['contacts_monomer.csv', 'coupling_scores.csv' /*, 'distance_map.csv'*/];
                return [4 /*yield*/, Promise.all(contactMapFiles.map(function (file) { return d3.text(dir + "/" + file); }))];
            case 1:
                promiseResults = _a.sent();
                data = {
                    contactMonomer: parseContactMonomerLine(promiseResults[0]),
                    couplingScore: parseCouplingScoreLine(promiseResults[1]),
                };
                return [2 /*return*/, data];
        }
    });
}); };
var parseContactMonomerLine = function (line) {
    var results = [];
    line
        .split('\n')
        .slice(1)
        .forEach(function (row) {
        var items = row.split(',');
        if (items.length === 3) {
            results.push({ i: parseFloat(items[0]), j: parseFloat(items[1]), dist: parseFloat(items[2]) });
        }
    });
    return results;
};
var parseCouplingScoreLine = function (line) {
    return line
        .split('\n')
        .slice(1)
        .map(function (row) {
        var items = row.split(',');
        return {
            i: parseFloat(items[0]),
            // tslint:disable-next-line:object-literal-sort-keys
            A_i: items[1],
            j: parseFloat(items[2]),
            A_j: items[3],
            fn: parseFloat(items[4]),
            cn: parseFloat(items[5]),
            segment_i: items[6],
            segment_j: items[7],
            probability: parseFloat(items[8]),
            dist_intra: parseFloat(items[9]),
            dist_multimer: parseFloat(items[10]),
            dist: parseFloat(items[11]),
            precision: parseFloat(items[12]),
        };
    });
};
