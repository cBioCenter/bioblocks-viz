"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var semantic_ui_react_1 = require("semantic-ui-react");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var reducer_1 = require("~bioblocks-viz~/reducer");
// TODO: Move to helper.
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
var ExampleAppClass = /** @class */ (function (_super) {
    tslib_1.__extends(ExampleAppClass, _super);
    function ExampleAppClass(props) {
        var _this = _super.call(this, props) || this;
        _this.onSwitchDataset = function () {
            _this.setState({
                allSequences: [],
                datasetLocation: _this.state.datasetLocation === 'hpc/full' ? 'tabula_muris/full' : 'hpc/full',
                scRNAseqCategoricalData: {},
                scRNAseqMatrix: new Array(new Array()),
            });
        };
        _this.renderStartMessage = function () { return (React.createElement(semantic_ui_react_1.Segment, null,
            React.createElement(semantic_ui_react_1.Message, null, "Demonstration of UMAP and T-SNE visualizations of the '" + _this.state.datasetLocation + "' dataset. "),
            React.createElement(semantic_ui_react_1.Button, { onClick: _this.onSwitchDataset }, "Switch to '" + (_this.state.datasetLocation === 'hpc/full' ? 'tabula_muris/full' : 'hpc/full') + "' dataset"))); };
        _this.renderSPRINGAndUMAP = function () {
            return (React.createElement(semantic_ui_react_1.Grid, { centered: true, columns: 2, padded: true, relaxed: true },
                React.createElement(semantic_ui_react_1.Grid.Row, null,
                    React.createElement(semantic_ui_react_1.Grid.Column, null,
                        React.createElement(container_1.UMAPSequenceContainer, { allSequences: _this.state.allSequences, taxonomyText: _this.state.taxonomyText, labelCategory: 'class' })),
                    React.createElement(semantic_ui_react_1.Grid.Column, null,
                        React.createElement(container_1.SpringContainer, { datasetLocation: "../datasets/" + _this.state.datasetLocation })))));
        };
        _this.state = ExampleAppClass.initialState;
        return _this;
    }
    ExampleAppClass.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setupUMAPData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ExampleAppClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var datasetLocation;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasetLocation = this.state.datasetLocation;
                        if (!(prevState.datasetLocation !== datasetLocation)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setupUMAPData()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ExampleAppClass.prototype.render = function (_a) {
        var style = (_a === void 0 ? this.props : _a).style;
        return (React.createElement("div", { id: 'BioblocksVizApp', style: tslib_1.__assign(tslib_1.__assign({}, style), { height: '1000px' }) },
            React.createElement("meta", { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
            React.createElement(semantic_ui_react_1.Segment, { attached: true, raised: true },
                React.createElement(semantic_ui_react_1.Header, { as: 'h1', attached: 'top' }, "Bioblocks-Viz: Visualization Component Library"),
                this.renderStartMessage()),
            this.renderSPRINGAndUMAP()));
    };
    ExampleAppClass.prototype.setupUMAPData = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var datasetLocation, taxonomyText, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        datasetLocation = this.state.datasetLocation;
                        if (!this.props.taxonomyFilename) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch(this.props.taxonomyFilename)];
                    case 1: return [4 /*yield*/, (_c.sent()).text()];
                    case 2:
                        taxonomyText = _c.sent();
                        _c.label = 3;
                    case 3:
                        _a = this.setState;
                        _b = {};
                        return [4 /*yield*/, exports.fetchFastaFile(this.props.fastaFilename)];
                    case 4:
                        _b.allSequences = _c.sent();
                        return [4 /*yield*/, helper_1.fetchJSONFile("datasets/" + datasetLocation + "/categorical_coloring_data.json")];
                    case 5:
                        _b.scRNAseqCategoricalData = (_c.sent());
                        return [4 /*yield*/, helper_1.fetchMatrixData("datasets/" + datasetLocation + "/tsne_matrix.csv")];
                    case 6:
                        _a.apply(this, [(_b.scRNAseqMatrix = _c.sent(),
                                _b.taxonomyText = taxonomyText,
                                _b)]);
                        return [2 /*return*/];
                }
            });
        });
    };
    ExampleAppClass.initialState = {
        allSequences: new Array(),
        datasetLocation: 'hpc/full',
        errorMsg: '',
        isDragHappening: false,
        isLoading: false,
        scRNAseqCategoricalData: {},
        scRNAseqCategorySelected: 'Sample',
        scRNAseqMatrix: new Array(),
        taxonomyText: '',
    };
    ExampleAppClass.defaultProps = {
        fastaFilename: 'datasets/betalactamase_alignment/PSE1_natural_top5K_subsample.a2m',
        style: {
            backgroundColor: '#ffffff',
        },
    };
    return ExampleAppClass;
}(React.Component));
var mapDispatchToProps = function (dispatch) { return redux_1.bindActionCreators({}, dispatch); };
var ExampleApp = react_redux_1.connect(null, mapDispatchToProps)(ExampleAppClass);
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
    React.createElement(ExampleApp, null)), document.getElementById('example-root'));
if (module.hot) {
    module.hot.accept();
}
//# sourceMappingURL=index.js.map