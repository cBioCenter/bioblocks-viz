"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var helper_1 = require("~bioblocks-viz~/helper");
describe('FetchHelper', function () {
    beforeEach(function () {
        fetchMock.resetMocks();
    });
    describe('CSV Files', function () {
        it('Should correctly fetch them.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = '1,2,3';
                        fetchMock.mockResponseOnce(expected);
                        return [4 /*yield*/, helper_1.fetchCSVFile('foo.csv')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(expected);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should throw errors.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = 'Bioblocks-viz error fetching CSV File!';
                        fetchMock.mockResponseOnce('error', { status: 400 });
                        return [4 /*yield*/, expect(helper_1.fetchCSVFile('foo.csv')).rejects.toThrowError(expected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('JSON Files', function () {
        it('Should correctly fetch them.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = { nier: 'automata' };
                        fetchMock.mockResponseOnce(JSON.stringify(expected));
                        return [4 /*yield*/, helper_1.fetchJSONFile('best-game.json')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expected);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should throw errors.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = 'Bioblocks-viz error fetching JSON File!';
                        fetchMock.mockResponseOnce('error', { status: 400 });
                        return [4 /*yield*/, expect(helper_1.fetchJSONFile('foo.json')).rejects.toThrowError(expected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Text Files', function () {
        it('Should allow any file to be read as text', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, file, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = JSON.stringify({ nier: 'automata' });
                        file = new File([expected], 'file', { type: 'text/html' });
                        return [4 /*yield*/, helper_1.readFileAsText(file)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expected);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should catch errors with invalid files.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect.assertions(1);
                return [2 /*return*/, expect(helper_1.readFileAsText({})).rejects.toBeTruthy()];
            });
        }); });
        it('Should catch parsing errors with.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, file;
            return tslib_1.__generator(this, function (_a) {
                expect.assertions(1);
                expected = JSON.stringify({ nier: 'automata' });
                file = new File([expected], 'file', { type: 'text/html' });
                FileReader.prototype.readAsText = function () {
                    if (this.onerror) {
                        this.onerror(new ProgressEvent('error'));
                    }
                };
                return [2 /*return*/, expect(helper_1.readFileAsText(file)).rejects.toEqual('Problem parsing input file.')];
            });
        }); });
    });
});
//# sourceMappingURL=FetchHelper.test.js.map