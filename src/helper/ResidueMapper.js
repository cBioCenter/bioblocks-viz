"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var UNI_PROT_RESNO_HEADER = 'up_index';
var UNI_PROT_RESNAME_HEADER = 'up_residue';
var PDB_RESNO_HEADER = 'pdb_index';
var PDB_RESNAME_HEADER = 'pdb_residue';
var EV_SERVER_COUPLING_HEADER = 'id';
var EV_SERVER_STRUCTURE_HEADER = 'coord_id';
var EV_SERVER_STRUCTURE_CODE_HEADER = 'one_letter_code';
var EVFOLD_EXPECTED_HEADERS = [UNI_PROT_RESNO_HEADER, UNI_PROT_RESNAME_HEADER, PDB_RESNO_HEADER, PDB_RESNAME_HEADER];
var EVSERVER_EXPECTED_HEADERS = [
    EV_SERVER_COUPLING_HEADER,
    EV_SERVER_STRUCTURE_HEADER,
    EV_SERVER_STRUCTURE_CODE_HEADER,
];
/**
 * Determines the mapping of residues from a UniProt file to a PDB, given a indextableplus file.
 *
 * @description This file is, semantically, a csv with 4 headers:
 *
 * up_index - UniProt residue number.
 *
 * up_residue - UniProt residue name.
 *
 * pdb_index - PDB residue number.
 *
 * pdb_residue - PDB residue name.
 *
 * @param text The contents of a indextableplus file.
 * @returns Array of all residue mappings.
 */
exports.generateResidueMapping = function (text) {
    var tabOrCommaRegex = /\t|,/;
    var headers = text.split('\n')[0].split(tabOrCommaRegex);
    var isEvServer = isEvServerJob(headers);
    var headerMap = getResidueMappingHeaders(headers, isEvServer);
    var couplingsResnoIndex = isEvServer ? headerMap[EV_SERVER_COUPLING_HEADER] : headerMap[UNI_PROT_RESNO_HEADER];
    var structureResnoIndex = isEvServer ? headerMap[EV_SERVER_STRUCTURE_HEADER] : headerMap[PDB_RESNO_HEADER];
    var structureResCodeIndex = isEvServer ? headerMap[EV_SERVER_STRUCTURE_CODE_HEADER] : headerMap[PDB_RESNAME_HEADER];
    return text
        .split('\n')
        .slice(1)
        .reduce(function (result, line) {
        var splitLine = line.split(tabOrCommaRegex);
        if (splitLine.length >= EVFOLD_EXPECTED_HEADERS.length) {
            result.push({
                couplingsResCode: isEvServer
                    ? splitLine[structureResCodeIndex]
                    : splitLine[headerMap[UNI_PROT_RESNAME_HEADER]],
                couplingsResno: parseInt(splitLine[couplingsResnoIndex], 10),
                pdbResCode: splitLine[structureResCodeIndex],
                pdbResno: parseInt(splitLine[structureResnoIndex], 10),
            });
        }
        return result;
    }, new Array());
};
var getResidueMappingHeaders = function (headers, isEvServer) {
    var headerMap = {};
    var expectedHeaders = isEvServer ? EVSERVER_EXPECTED_HEADERS : EVFOLD_EXPECTED_HEADERS;
    if (headers.length >= EVFOLD_EXPECTED_HEADERS.length) {
        expectedHeaders.map(function (header) {
            if (!headers.includes(header)) {
                throw new Error("Missing error " + header + " in residue mapping file!");
            }
            headerMap[header] = headers.indexOf(header);
        });
    }
    return headerMap;
};
var isEvServerJob = function (headers) {
    var e_1, _a;
    try {
        for (var EVSERVER_EXPECTED_HEADERS_1 = tslib_1.__values(EVSERVER_EXPECTED_HEADERS), EVSERVER_EXPECTED_HEADERS_1_1 = EVSERVER_EXPECTED_HEADERS_1.next(); !EVSERVER_EXPECTED_HEADERS_1_1.done; EVSERVER_EXPECTED_HEADERS_1_1 = EVSERVER_EXPECTED_HEADERS_1.next()) {
            var header = EVSERVER_EXPECTED_HEADERS_1_1.value;
            if (!headers.includes(header)) {
                return false;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (EVSERVER_EXPECTED_HEADERS_1_1 && !EVSERVER_EXPECTED_HEADERS_1_1.done && (_a = EVSERVER_EXPECTED_HEADERS_1.return)) _a.call(EVSERVER_EXPECTED_HEADERS_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
};
//# sourceMappingURL=ResidueMapper.js.map