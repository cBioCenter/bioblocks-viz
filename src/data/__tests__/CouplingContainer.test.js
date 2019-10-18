"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data");
describe('CouplingContainer', function () {
    // This same intentionally includes a mirrored pair, [i=1,j=0] and [i=0][j=1].
    var sampleContacts = [
        { cn: 0.5, i: 1, j: 2, dist: 1 },
        { cn: 0.5, i: 2, j: 1, dist: 1 },
        { cn: 0.7, i: 3, j: 4, dist: 5 },
        { cn: 0.2, i: 8, j: 9, dist: 7 },
    ];
    it('Should store a coupling [i=x, j=y] to the same place as [i=y, j=x].', function () {
        var result = new data_1.CouplingContainer(sampleContacts);
        expect(result.getCouplingScore(1, 2)).toEqual(result.getCouplingScore(2, 1));
    });
    it('Should tally unique number of couplings.', function () {
        var result = new data_1.CouplingContainer(sampleContacts);
        expect(result.totalContacts).toBe(3);
    });
    it('Should allow adding of new couplings.', function () {
        var result = new data_1.CouplingContainer(sampleContacts);
        result.addCouplingScore({ i: 2, j: 3, dist: 4 });
        expect(result.totalContacts).toBe(4);
    });
    it('Should allow updating of existing couplings.', function () {
        var result = new data_1.CouplingContainer(sampleContacts);
        var expected = 5;
        var score = result.getCouplingScore(1, 2);
        if (!score) {
            expect(score).not.toBeUndefined();
        }
        else {
            expect(score.dist).not.toBe(expected);
        }
        result.addCouplingScore({ i: 1, j: 2, dist: expected });
        score = result.getCouplingScore(1, 2);
        if (!score) {
            expect(score).not.toBeUndefined();
        }
        else {
            expect(score.dist).toBe(expected);
        }
    });
    it('Should determine if a contact exists in storage regardless of order of [i, j].', function () {
        var result = new data_1.CouplingContainer([{ i: 1, j: 2, dist: 1 }]);
        expect(result.includes(1, 2)).toBe(true);
        expect(result.includes(2, 1)).toBe(true);
    });
    it('Should allow iterators to iterate through existing contacts.', function () {
        var e_1, _a;
        var result = new data_1.CouplingContainer(sampleContacts);
        try {
            for (var result_1 = tslib_1.__values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                var contact = result_1_1.value;
                expect(sampleContacts).toContainEqual(contact);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (result_1_1 && !result_1_1.done && (_a = result_1.return)) _a.call(result_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    it('Should allow retrieving the contacts sorted by rank.', function () {
        var result = new data_1.CouplingContainer(sampleContacts).rankedContacts;
        var expected = [sampleContacts[2], sampleContacts[0], sampleContacts[3]];
        expect(result).toEqual(expected);
    });
    it('Should return undefined when getting a contact out of bounds.', function () {
        var result = new data_1.CouplingContainer(sampleContacts);
        expect(result.getAminoAcidOfContact(777)).toBeUndefined();
        expect(result.getCouplingScore(777, 777)).toBeUndefined();
    });
    it('Should allow have contacts with undefined cn values at the bottom of the sorted list.', function () {
        var e_2, _a;
        var dummyScores = [{ i: 1, j: 1, dist: 0 }, { i: 2, j: 2, dist: 1 }, { i: 11, j: 11, dist: 11 }];
        try {
            for (var dummyScores_1 = tslib_1.__values(dummyScores), dummyScores_1_1 = dummyScores_1.next(); !dummyScores_1_1.done; dummyScores_1_1 = dummyScores_1.next()) {
                var score = dummyScores_1_1.value;
                var result = new data_1.CouplingContainer(tslib_1.__spread([score], sampleContacts)).rankedContacts;
                var expected = [sampleContacts[2], sampleContacts[0], sampleContacts[3], score];
                expect(result).toEqual(expected);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (dummyScores_1_1 && !dummyScores_1_1.done && (_a = dummyScores_1.return)) _a.call(dummyScores_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
    it('Should return the correct amino acid sequence for a set of contacts.', function () {
        var contacts = [
            { A_i: 'A', A_j: 'T', cn: 0.5, i: 1, j: 3, dist: 1 },
            { A_i: 'R', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
            { A_i: 'T', A_j: 'R', cn: 0.5, i: 3, j: 2, dist: 1 },
            { A_i: 'R', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
            { A_i: 'S', A_j: 'A', cn: 0.5, i: 4, j: 1, dist: 1 },
            { A_i: 'T', A_j: 'Y', cn: 0.5, i: 3, j: 5, dist: 1 },
        ];
        var container = new data_1.CouplingContainer(contacts);
        expect(container.sequence).toEqual('ARTSY');
    });
    it('Should return the correct amino acid sequence for a set of contacts when indices are flipped.', function () {
        var contacts = [
            { A_i: 'T', A_j: 'A', cn: 0.5, i: 3, j: 1, dist: 1 },
            { A_i: 'A', A_j: 'R', cn: 0.5, i: 1, j: 2, dist: 1 },
            { A_i: 'R', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
            { A_i: 'T', A_j: 'R', cn: 0.5, i: 3, j: 2, dist: 1 },
            { A_i: 'A', A_j: 'S', cn: 0.5, i: 1, j: 4, dist: 1 },
            { A_i: 'Y', A_j: 'T', cn: 0.5, i: 5, j: 3, dist: 1 },
        ];
        var container = new data_1.CouplingContainer(contacts);
        expect(container.sequence).toEqual('ARTSY');
    });
    it('Should return the correct amino acid sequence for a set of contacts when they are updated and flipped.', function () {
        var contacts = [
            { cn: 0.5, i: 3, j: 1, dist: 1 },
            { cn: 0.5, i: 1, j: 2, dist: 1 },
            { cn: 0.5, i: 2, j: 3, dist: 1 },
            { cn: 0.5, i: 3, j: 2, dist: 1 },
            { cn: 0.5, i: 1, j: 4, dist: 1 },
            { cn: 0.5, i: 5, j: 3, dist: 1 },
        ];
        var container = new data_1.CouplingContainer(contacts);
        container.updateContact(3, 1, { A_i: 'T', A_j: 'A' });
        container.updateContact(1, 2, { A_i: 'A', A_j: 'R' });
        container.updateContact(2, 3, { A_i: 'R', A_j: 'T' });
        container.updateContact(3, 2, { A_i: 'T', A_j: 'R' });
        container.updateContact(1, 4, { A_i: 'A', A_j: 'S' });
        container.updateContact(5, 3, { A_i: 'Y', A_j: 'T' });
        expect(container.sequence).toEqual('ARTSY');
    });
    it('Should return the correct amino acid sequence for a set of contacts when they are updated and not flipped.', function () {
        var contacts = [
            { cn: 0.5, i: 1, j: 3, dist: 1 },
            { cn: 0.5, i: 2, j: 1, dist: 1 },
            { cn: 0.5, i: 3, j: 2, dist: 1 },
            { cn: 0.5, i: 2, j: 3, dist: 1 },
            { cn: 0.5, i: 4, j: 1, dist: 1 },
            { cn: 0.5, i: 3, j: 5, dist: 1 },
        ];
        var container = new data_1.CouplingContainer(contacts);
        container.updateContact(1, 3, { A_i: 'A', A_j: 'T' });
        container.updateContact(2, 1, { A_i: 'R', A_j: 'A' });
        container.updateContact(3, 2, { A_i: 'T', A_j: 'R' });
        container.updateContact(2, 3, { A_i: 'R', A_j: 'T' });
        container.updateContact(4, 1, { A_i: 'S', A_j: 'A' });
        container.updateContact(3, 5, { A_i: 'T', A_j: 'Y' });
        expect(container.sequence).toEqual('ARTSY');
    });
    describe('Amino acid helper', function () {
        it('Should return undefined when retrieving an amino acid from an empty Coupling Container.', function () {
            var container = new data_1.CouplingContainer();
            expect(container.getAminoAcidOfContact(2)).toEqual(undefined);
            expect(function () { return new data_1.CouplingContainer().getAminoAcidOfContact(0); }).not.toThrow();
        });
        it('Should return undefined when an amino acid that has not been stored is retrieved.', function () {
            var container = new data_1.CouplingContainer();
            expect(container.getAminoAcidOfContact(3)).toEqual(undefined);
            expect(function () { return new data_1.CouplingContainer(sampleContacts).getAminoAcidOfContact(0); }).not.toThrow();
        });
        it('Should allow the correct amino acid corresponding to an individual contact to be retrieved.', function () {
            var contacts = [
                { A_i: 'A', A_j: 'N', cn: 0.5, i: 1, j: 2, dist: 1 },
                { A_i: 'N', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
            ];
            var container = new data_1.CouplingContainer(contacts);
            expect(container.getAminoAcidOfContact(1)).toEqual(data_1.AminoAcid.Alanine);
            expect(container.getAminoAcidOfContact(2)).toEqual(data_1.AminoAcid.Asparagine);
        });
    });
    describe('Scores', function () {
        it('Should allow sorting by different score sources.', function () {
            var sampleScores = [
                { i: 1, j: 10, cn: 6, dist: 0, dist_intra: 1, dist_multimer: 2, fn: 3, probability: 4, precision: 5 },
                { i: 2, j: 11, cn: 5, dist: 6, dist_intra: 0, dist_multimer: 1, fn: 2, probability: 3, precision: 4 },
                { i: 3, j: 12, cn: 4, dist: 5, dist_intra: 6, dist_multimer: 0, fn: 1, probability: 2, precision: 3 },
                { i: 4, j: 13, cn: 3, dist: 4, dist_intra: 5, dist_multimer: 6, fn: 0, probability: 1, precision: 2 },
                { i: 5, j: 14, cn: 2, dist: 3, dist_intra: 4, dist_multimer: 5, fn: 6, probability: 0, precision: 1 },
                { i: 6, j: 15, cn: 1, dist: 2, dist_intra: 3, dist_multimer: 4, fn: 5, probability: 6, precision: 0 },
                { i: 7, j: 16, cn: 0, dist: 1, dist_intra: 2, dist_multimer: 3, fn: 4, probability: 5, precision: 6 },
            ];
            var undefinedScores = [{ i: 8, j: 17 }, { i: 9, j: 18 }];
            var expected = Array.from(sampleScores);
            Object.keys(data_1.COUPLING_SCORE_SOURCE).forEach(function (scoreSource) {
                var result = new data_1.CouplingContainer(tslib_1.__spread(sampleScores, undefinedScores), scoreSource).rankedContacts;
                expect(result).toEqual(tslib_1.__spread(expected, undefinedScores));
                expected = tslib_1.__spread(expected.slice(1, expected.length), [expected[0]]);
            });
        });
        it('Should sort the scores by cn if an invalid source is provided.', function () {
            var sampleScores = [
                { i: 1, j: 10, cn: 6, dist: 0, dist_intra: 1, dist_multimer: 2, fn: 3, probability: 4, precision: 5 },
                { i: 2, j: 11, cn: 5, dist: 6, dist_intra: 0, dist_multimer: 1, fn: 2, probability: 3, precision: 4 },
                { i: 3, j: 12, cn: 4, dist: 5, dist_intra: 6, dist_multimer: 0, fn: 1, probability: 2, precision: 3 },
                { i: 4, j: 13, cn: 3, dist: 4, dist_intra: 5, dist_multimer: 6, fn: 0, probability: 1, precision: 2 },
                { i: 5, j: 14, cn: 2, dist: 3, dist_intra: 4, dist_multimer: 5, fn: 6, probability: 0, precision: 1 },
                { i: 6, j: 15, cn: 1, dist: 2, dist_intra: 3, dist_multimer: 4, fn: 5, probability: 6, precision: 0 },
                { i: 7, j: 16, cn: 0, dist: 1, dist_intra: 2, dist_multimer: 3, fn: 4, probability: 5, precision: 6 },
            ];
            var result = new data_1.CouplingContainer(sampleScores, 'smoke').rankedContacts;
            var expected = Array.from(sampleScores);
            expect(result).toEqual(expected);
        });
    });
});
//# sourceMappingURL=CouplingContainer.test.js.map