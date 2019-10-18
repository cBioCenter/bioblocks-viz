"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("~bioblocks-viz~/helper");
describe('ResidueMapper', function () {
    var simpleFile = 'up_index\tup_residue\tpdb_index\tpdb_residue\n24\tH\t26\tH\n25\tP\t27\tP';
    it('Should map residues correctly when given properly formatted indextableplus text.', function () {
        var result = helper_1.generateResidueMapping(simpleFile);
        var expected = [
            {
                couplingsResCode: 'H',
                couplingsResno: 24,
                pdbResCode: 'H',
                pdbResno: 26,
            },
            {
                couplingsResCode: 'P',
                couplingsResno: 25,
                pdbResCode: 'P',
                pdbResno: 27,
            },
        ];
        expect(result).toEqual(expected);
    });
    it('Should throw when given text that is missing the required headers.', function () {
        expect(function () { return helper_1.generateResidueMapping('1\t2\t3\t4\t5'); }).toThrowError();
    });
    it('Should return an empty list if headers are correct but no other text is provided.', function () {
        var expected = new Array();
        var result = helper_1.generateResidueMapping(simpleFile.split('\n')[0]);
        expect(result).toEqual(expected);
    });
    it('Should skip empty lines.', function () {
        var expected = [
            {
                couplingsResCode: 'H',
                couplingsResno: 24,
                pdbResCode: 'H',
                pdbResno: 26,
            },
            {
                couplingsResCode: 'P',
                couplingsResno: 25,
                pdbResCode: 'P',
                pdbResno: 27,
            },
        ];
        var splitLines = simpleFile.split('\n');
        var foo = splitLines[0]
            .concat('\n', splitLines[1])
            .concat('\n', '')
            .concat('\n', splitLines[2]);
        var result = helper_1.generateResidueMapping(foo);
        expect(result).toEqual(expected);
    });
});
//# sourceMappingURL=ResidueMapper.test.js.map