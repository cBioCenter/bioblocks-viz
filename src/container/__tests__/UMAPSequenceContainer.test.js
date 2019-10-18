"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var react_test_renderer_1 = require("react-test-renderer");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
// tslint:disable-next-line: max-func-body-length
describe('UMAPSequenceContainer', function () {
    var sequence;
    var sequences;
    var taxonomyText;
    beforeEach(function () {
        jest.clearAllTimers();
        jest.useFakeTimers();
        sequence = new data_1.Seq('gatcctag');
        sequences = [new data_1.SeqRecord(sequence)];
        // Taxonomy text based off betalactamase_alignment - PSE1_NATURAL_TAXONOMY.csv
        taxonomyText = "seq_name,sequence,tax_id,superkingdom,phylum,genus,class,subphylum,family,order,species\nexample_sequence,EVA-NERV,59846,Bacteria,Firmicutes,Paenibacillus,Bacilli,Paenibacillaceae,Bacillales,Paenibacillus,chibensis";
    });
    it('Should render when given an empty sequence.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: [] }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render when given a sequence.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: sequences }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle a taxonomy update.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: sequences }));
        var expected = {
            example_sequence: {
                class: 'Bacilli',
                family: 'Bacillales',
                genus: 'Paenibacillus',
                order: 'Paenibacillus',
                phylum: 'Firmicutes',
                seq_name: 'example_sequence',
                sequence: 'EVA-NERV',
                species: 'chibensis',
                subphylum: 'Paenibacillaceae',
                superkingdom: 'Bacteria',
                tax_id: '59846',
            },
        };
        wrapper.setProps({
            taxonomyText: taxonomyText,
        });
        expect(wrapper.state('seqNameToTaxonomyMetadata')).toEqual(expected);
    });
    it('Should render an upload form when enabled.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: sequences, showUploadButton: true }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should parse a taxonomy file with headers.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, instance, expected;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: [], labelCategory: 'example_sequence', showUploadButton: true }));
                    instance = wrapper.instance();
                    expect(instance.state.labels).toEqual([]);
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper
                                    .find('input')
                                    .simulate('change', { target: { files: { item: function () { return new File([taxonomyText], 'mock'); }, length: 1 } } });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.update();
                                instance.forceUpdate();
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _a.sent();
                    expected = [
                        'seq_name',
                        'tax_id',
                        'superkingdom',
                        'phylum',
                        'genus',
                        'class',
                        'subphylum',
                        'family',
                        'order',
                        'species',
                    ];
                    expect(instance.state.labels).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should parse a taxonomy file without headers.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, instance, taxonomyTextNoHeaders, expected;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: [], labelCategory: 'example_sequence', showUploadButton: true }));
                    instance = wrapper.instance();
                    expect(instance.state.labels).toEqual([]);
                    taxonomyTextNoHeaders = taxonomyText.split('\n')[1];
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.find('input').simulate('change', {
                                    target: { files: { item: function () { return new File([taxonomyTextNoHeaders], 'mock'); }, length: 1 } },
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.update();
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _a.sent();
                    expected = new Array();
                    expect(instance.state.labels).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should gracefully handle an invalid taxonomy file.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, instance;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: [], labelCategory: 'example_sequence', showUploadButton: true }));
                    instance = wrapper.instance();
                    expect(instance.state.labels).toEqual([]);
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.find('input').simulate('change', { target: { files: null } });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.update();
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _a.sent();
                    expect(instance.state.labels).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle updating the data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: sequences }));
                    wrapper.setProps({
                        allSequences: [new data_1.SeqRecord(new data_1.Seq('ggaattcc'))],
                    });
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.update();
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect(wrapper).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle removing the taxonomy data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: sequences, taxonomyText: taxonomyText }));
                    wrapper.setProps({
                        taxonomyText: undefined,
                    });
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.update();
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect(wrapper).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle missing annotation data.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var unannotatedSequences, wrapper;
        return tslib_1.__generator(this, function (_a) {
            unannotatedSequences = sequences.map(function (seq) {
                seq.annotations.name = undefined;
                return seq;
            });
            wrapper = enzyme_1.shallow(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: unannotatedSequences, taxonomyText: taxonomyText }));
            expect(wrapper).toMatchSnapshot();
            return [2 /*return*/];
        });
    }); });
    it('Should use hamming method for distance calculation.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, instance, spy;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(React.createElement(container_1.UMAPSequenceContainerClass, { allSequences: tslib_1.__spread(sequences, sequences, sequences, sequences, sequences, sequences, sequences, [
                            new data_1.SeqRecord(new data_1.Seq('catCat'))
                        ], sequences, sequences, sequences, sequences, sequences, sequences, sequences, sequences) }));
                    instance = wrapper.instance();
                    spy = jest.spyOn(instance, 'equalityHammingDistance');
                    expect(spy).not.toHaveBeenCalled();
                    return [4 /*yield*/, react_test_renderer_1.act(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                wrapper.update();
                                instance.forceUpdate();
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    jest.runAllTimers();
                    expect(instance.equalityHammingDistance).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=UMAPSequenceContainer.test.js.map