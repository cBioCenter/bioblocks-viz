"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data");
exports.fetchCSVFile = function (filename) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var response;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(filename)];
            case 1:
                response = _a.sent();
                if (response.ok) {
                    return [2 /*return*/, response.text()];
                }
                else {
                    throw new Error(genErrorMsg('CSV', response));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.fetchJSONFile = function (filename) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var response;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(filename)];
            case 1:
                response = _a.sent();
                if (response.ok) {
                    return [2 /*return*/, response.json()];
                }
                else {
                    throw new Error(genErrorMsg('JSON', response));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.fetchFastaFile = function (filename) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var response, _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, fetch(filename)];
            case 1:
                response = _c.sent();
                if (!response.ok) return [3 /*break*/, 3];
                _b = (_a = data_1.SeqIO).parseFile;
                return [4 /*yield*/, response.text()];
            case 2: return [2 /*return*/, _b.apply(_a, [_c.sent(), data_1.SEQUENCE_FILE_TYPES.fasta])];
            case 3: throw new Error("error " + response);
        }
    });
}); };
var genErrorMsg = function (fileType, response) {
    return "Bioblocks-viz error fetching " + fileType + " File!\nStatus: " + response.status + "\nMessage: " + response.statusText + "\n";
};
// https://blog.shovonhasan.com/using-promises-with-filereader/
exports.readFileAsText = function (inputFile) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var temporaryFileReader;
    return tslib_1.__generator(this, function (_a) {
        temporaryFileReader = new FileReader();
        return [2 /*return*/, new Promise(function (resolve, reject) {
                temporaryFileReader.onerror = function () {
                    temporaryFileReader.abort();
                    reject('Problem parsing input file.');
                };
                temporaryFileReader.onload = function () {
                    resolve(temporaryFileReader.result);
                };
                temporaryFileReader.readAsText(inputFile);
            })];
    });
}); };
//# sourceMappingURL=FetchHelper.js.map