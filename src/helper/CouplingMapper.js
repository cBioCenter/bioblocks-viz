"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateDefaultHeaderIndices = function (items) { return ({
    A_i: items.length - 2,
    A_j: items.length - 1,
    cn: 2,
    dist: 3,
    i: 0,
    j: 1,
}); };
// tslint:disable-next-line:export-name
exports.getCouplingHeaderIndices = function (items, areHeadersPresent) {
    if (!areHeadersPresent) {
        return generateDefaultHeaderIndices(items);
    }
    else {
        var result_1 = {};
        items.filter(function (item) { return item.length >= 1; }).map(function (header) {
            // Trim to remove whitespace, newlines, carriage returns, etc.
            result_1[header.trim()] = items.indexOf(header);
        });
        return result_1;
    }
};
//# sourceMappingURL=CouplingMapper.js.map