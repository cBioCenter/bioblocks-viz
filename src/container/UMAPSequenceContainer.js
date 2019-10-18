"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Papa = require("papaparse");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var immutable_1 = require("immutable");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var action_1 = require("~bioblocks-viz~/action");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var selector_1 = require("~bioblocks-viz~/selector");
var UMAPSequenceContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(UMAPSequenceContainerClass, _super);
    function UMAPSequenceContainerClass(props) {
        var _this = _super.call(this, props) || this;
        /**
         * A special hamming distance function that is speed optimized for sequence comparisons.
         * Assumes that sequences are passed with a single integer for each position. If
         * the position is the same in each position then the distance is zero, otherwise
         * the distance is one. The total distance is then the sum of each positional distance.
         * @returns the total distance between a pair of sequences.
         */
        _this.equalityHammingDistance = function (seq1, seq2) {
            var result = 0;
            for (var i = 0; i < seq1.length; i++) {
                if (seq1[i] !== seq2[i]) {
                    result += 1;
                }
            }
            return result;
        };
        _this.getDataLabels = function () {
            var _a = _this.state, labelCategory = _a.labelCategory, seqNameToTaxonomyMetadata = _a.seqNameToTaxonomyMetadata, subsampledSequences = _a.subsampledSequences;
            var dataLabels = new Array();
            if (seqNameToTaxonomyMetadata) {
                var seqStates = subsampledSequences.map(function (seq) {
                    if (seq.annotations.name && seqNameToTaxonomyMetadata[seq.annotations.name]) {
                        return seqNameToTaxonomyMetadata[seq.annotations.name][labelCategory];
                    }
                    return undefined;
                });
                dataLabels = data_1.Marker.colors.autoColorFromStates(seqStates);
            }
            return dataLabels;
        };
        _this.onLabelChange = function (event, data) {
            _this.setState({
                labelCategory: data.value,
            });
        };
        _this.onTaxonomyUpload = function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var files, file, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.persist();
                        files = e.target.files;
                        if (!files) {
                            return [2 /*return*/];
                        }
                        file = files.item(0);
                        _a = this.parseTaxonomy;
                        return [4 /*yield*/, helper_1.readFileAsText(file)];
                    case 1:
                        _a.apply(this, [_b.sent()]);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.renderTaxonomyUpload = function () {
            return (React.createElement(semantic_ui_react_1.Popup, { trigger: _this.renderTaxonomyTrigger(), content: React.createElement(React.Fragment, null,
                    React.createElement("span", null, "A tab delimited file with 2 columns and optional headers:"),
                    React.createElement("br", null),
                    React.createElement("span", null, "- First column is sequence name."),
                    React.createElement("br", null),
                    React.createElement("span", null, "- Second column is how to group sequences.")) }));
        };
        _this.renderTaxonomyTrigger = function () {
            return (React.createElement(semantic_ui_react_1.Label, { as: 'label', basic: true, htmlFor: 'upload-taxonomy' },
                React.createElement(semantic_ui_react_1.Button, { icon: 'upload', label: {
                        basic: true,
                        content: 'Upload Taxonomy File',
                    }, labelPosition: 'right' }),
                React.createElement("input", { hidden: true, id: 'upload-taxonomy', multiple: false, onChange: _this.onTaxonomyUpload, required: true, type: 'file' })));
        };
        _this.setupSequenceAnnotation = function (allSequences, labelCategory) {
            _this.setState({
                seqNameToTaxonomyMetadata: allSequences.reduce(function (acc, seq) {
                    var _a;
                    if (seq.annotations.name && seq.annotations.metadata) {
                        acc[seq.annotations.name] = (_a = {},
                            _a[labelCategory] = seq.annotations.metadata[labelCategory],
                            _a);
                    }
                    return acc;
                }, {}),
            });
        };
        _this.state = {
            labelCategory: '',
            labels: new Array(),
            randomSequencesDataMatrix: new Array(new Array()),
            seqNameToTaxonomyMetadata: {},
            subsampledSequences: new Array(),
            tooltipNames: new Array(),
        };
        return _this;
    }
    UMAPSequenceContainerClass.prototype.componentDidMount = function () {
        this.prepareData();
    };
    UMAPSequenceContainerClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this.props, allSequences = _a.allSequences, labelCategory = _a.labelCategory, numSequencesToShow = _a.numSequencesToShow, taxonomyText = _a.taxonomyText;
        if (prevProps.allSequences !== allSequences ||
            prevProps.numSequencesToShow !== numSequencesToShow ||
            prevProps.labelCategory !== labelCategory ||
            prevProps.taxonomyText !== taxonomyText) {
            var onlyAnnotationChanged_1 = prevProps.allSequences.length === allSequences.length;
            prevProps.allSequences.forEach(function (seq, index) {
                if (!allSequences[index] || seq.sequence.localeCompare(allSequences[index].sequence) !== 0) {
                    onlyAnnotationChanged_1 = false;
                    return;
                }
            });
            if (onlyAnnotationChanged_1) {
                if (taxonomyText) {
                    this.parseTaxonomy(taxonomyText);
                }
                else {
                    // If sequence metadata only was updated, don't re-sample data.
                    this.setupSequenceAnnotation(allSequences, labelCategory);
                }
            }
            else {
                this.prepareData();
            }
        }
    };
    UMAPSequenceContainerClass.prototype.render = function () {
        var _a = this.props, allSequences = _a.allSequences, numIterationsBeforeReRender = _a.numIterationsBeforeReRender, showUploadButton = _a.showUploadButton, rest = tslib_1.__rest(_a, ["allSequences", "numIterationsBeforeReRender", "showUploadButton"]);
        var _b = this.state, labelCategory = _b.labelCategory, labels = _b.labels, randomSequencesDataMatrix = _b.randomSequencesDataMatrix, tooltipNames = _b.tooltipNames;
        var dataLabels = this.getDataLabels();
        return (React.createElement(semantic_ui_react_1.Grid, { centered: true, padded: true },
            React.createElement(semantic_ui_react_1.Grid.Row, null,
                React.createElement(component_1.UMAPVisualization, tslib_1.__assign({ currentLabel: labelCategory, dataLabels: dataLabels, dataMatrix: randomSequencesDataMatrix, distanceFn: this.equalityHammingDistance, errorMessages: [], labels: labels, numIterationsBeforeReRender: numIterationsBeforeReRender, onLabelChange: this.onLabelChange, tooltipNames: tooltipNames }, rest))),
            showUploadButton && React.createElement(semantic_ui_react_1.Grid.Row, null, this.renderTaxonomyUpload())));
    };
    /* testing
    public flipAnnotation() {
      const thisObj = this;
      const selectedCat = this.state.selectedLabelCategory;
      setTimeout(() => {
        if (selectedCat === 'class') {
          thisObj.setState({
            selectedLabelCategory: 'phylum',
          });
        } else if (selectedCat === 'phylum') {
          thisObj.setState({
            selectedLabelCategory: 'class',
          });
        }
  
        thisObj.flipAnnotation();
      }, 5000);
    }*/
    UMAPSequenceContainerClass.prototype.prepareData = function () {
        var _a = this.props, allSequences = _a.allSequences, labelCategory = _a.labelCategory, numSequencesToShow = _a.numSequencesToShow, taxonomyText = _a.taxonomyText;
        // load taxonomy
        if (taxonomyText) {
            this.parseTaxonomy(taxonomyText); // await taxonomyFile.text());
        }
        else {
            this.setupSequenceAnnotation(allSequences, labelCategory);
        }
        // load sequences
        // console.log(`all ${allSequences.length} fasta sequences:`, allSequences);
        // slice reasonable number of sequences if needed
        var subsampledSequences = this.state.subsampledSequences;
        if (!subsampledSequences || subsampledSequences.length !== numSequencesToShow) {
            subsampledSequences = helper_1.subsample(this.props.allSequences, numSequencesToShow);
        }
        this.setState({
            labelCategory: labelCategory,
            randomSequencesDataMatrix: subsampledSequences.map(function (seq) {
                return seq.integerRepresentation(['-']);
            }),
            subsampledSequences: subsampledSequences,
            tooltipNames: subsampledSequences.map(function (seq) { return (seq.annotations.name ? seq.annotations.name : ''); }),
        });
        // temporary for testing - flip the color annotation
        // this.flipAnnotation();
    };
    UMAPSequenceContainerClass.prototype.parseTaxonomy = function (taxonomyText) {
        var _this = this;
        if (taxonomyText) {
            var isHeaderPresent_1 = taxonomyText.split('\n')[0].includes('seq_name');
            Papa.parse(taxonomyText, {
                complete: function (results) {
                    // simple stats
                    // const labelProperties = this.getClassPhylumLabelDescription(); // todo: auto compute
                    _this.setState({
                        labels: isHeaderPresent_1
                            ? results.meta.fields.filter(function (field) { return field.toLocaleLowerCase() !== 'sequence'; })
                            : [],
                        seqNameToTaxonomyMetadata: results.data.reduce(function (acc, seqMetadata) {
                            var _a;
                            if (isHeaderPresent_1) {
                                acc[seqMetadata.seq_name] = seqMetadata;
                            }
                            else {
                                var seqRow = seqMetadata;
                                acc[seqRow[0]] = (_a = {
                                        seq_name: seqRow[0]
                                    },
                                    _a[_this.props.labelCategory] = seqRow[1],
                                    _a);
                            }
                            return acc;
                        }, {}),
                    });
                },
                header: isHeaderPresent_1,
            });
        }
    };
    UMAPSequenceContainerClass.defaultProps = {
        currentCells: immutable_1.Set(),
        labelCategory: 'class',
        numIterationsBeforeReRender: 1,
        numSequencesToShow: 4000,
        setCurrentCells: helper_1.EMPTY_FUNCTION,
        showUploadButton: false,
    };
    return UMAPSequenceContainerClass;
}(React.Component));
exports.UMAPSequenceContainerClass = UMAPSequenceContainerClass;
var mapStateToProps = function (state) { return ({
    currentCells: selector_1.selectCurrentItems(state, 'cells'),
}); };
var mapDispatchToProps = function (dispatch) {
    return redux_1.bindActionCreators({
        setCurrentCells: action_1.createContainerActions('cells').set,
    }, dispatch);
};
exports.UMAPSequenceContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(UMAPSequenceContainerClass);
//# sourceMappingURL=UMAPSequenceContainer.js.map