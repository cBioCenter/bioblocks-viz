"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var immutable_1 = require("immutable");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var semantic_ui_react_1 = require("semantic-ui-react");
var action_1 = require("~bioblocks-viz~/action");
var ResiduePairAction_1 = require("~bioblocks-viz~/action/ResiduePairAction");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var reducer_1 = require("~bioblocks-viz~/reducer");
var selector_1 = require("~bioblocks-viz~/selector");
var NGLContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(NGLContainerClass, _super);
    function NGLContainerClass(props) {
        var _this = _super.call(this, props) || this;
        _this.onExperimentalProteinSelect = function (event, data) {
            var fullName = data.value.split(' ')[0];
            _this.setState({
                selectedExperimentalProteins: data.checked
                    ? tslib_1.__spread(_this.state.selectedExperimentalProteins, [fullName]) : _this.state.selectedExperimentalProteins.filter(function (pdb) { return pdb !== fullName; }),
            });
        };
        _this.onPredictedProteinSelect = function (event, data) {
            var fullName = data.value.split(' ')[0];
            _this.setState({
                selectedPredictedProteins: data.checked
                    ? tslib_1.__spread(_this.state.selectedPredictedProteins, [fullName]) : _this.state.selectedPredictedProteins.filter(function (pdb) { return pdb !== fullName; }),
            });
        };
        _this.renderPDBTableBody = function (data, pdbGroup, cellStyle, onChange) {
            return React.createElement(semantic_ui_react_1.Table.Body, null, _this.renderPDBTableBodyRows(data, pdbGroup, cellStyle, onChange));
        };
        _this.renderPDBTableBodyRows = function (data, pdbGroup, cellStyle, onChange) {
            var _a = _this.state, selectedExperimentalProteins = _a.selectedExperimentalProteins, selectedPredictedProteins = _a.selectedPredictedProteins;
            return data.map(function (pdb, index) { return (React.createElement(semantic_ui_react_1.Table.Row, { key: "pdb-radio-" + pdbGroup + "-" + index },
                React.createElement(semantic_ui_react_1.Table.Cell, { style: cellStyle },
                    React.createElement(semantic_ui_react_1.Popup, { position: 'bottom center', pinned: true, trigger: React.createElement(semantic_ui_react_1.Checkbox, { checked: (pdbGroup === 'experimental'
                                ? selectedExperimentalProteins
                                : selectedPredictedProteins).includes(pdb.name), onChange: onChange, value: pdb.name, label: pdb.name
                                .split('_')
                                .reverse()
                                .slice(0, 4)
                                .reverse()
                                .join('_') }) }, pdb.name)),
                _this.renderPDBTableSequenceCell(pdbGroup, cellStyle, pdb),
                _this.renderPDBTableSourceCell(pdbGroup, cellStyle, pdb),
                _this.renderPDBTableRankCell(pdbGroup, cellStyle, pdb))); });
        };
        _this.renderPDBTableHeader = function (pdbGroup, cellStyle) {
            return (React.createElement(semantic_ui_react_1.Table.Header, null,
                React.createElement(semantic_ui_react_1.Table.Row, null,
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, { style: cellStyle }, "Name"),
                    _this.renderPDBTableSequenceHeader(pdbGroup, cellStyle),
                    _this.renderPDBTableSourceHeader(pdbGroup, cellStyle),
                    _this.renderPDBTableRankHeader(pdbGroup, cellStyle))));
        };
        _this.renderPDBTableRankCell = function (pdbGroup, cellStyle, pdb) {
            return pdbGroup === 'predicted' && React.createElement(semantic_ui_react_1.Table.Cell, { style: cellStyle }, pdb.rank);
        };
        _this.renderPDBTableRankHeader = function (pdbGroup, cellStyle) {
            return pdbGroup === 'predicted' && React.createElement(semantic_ui_react_1.Table.HeaderCell, { style: cellStyle }, "Rank");
        };
        _this.renderPDBTableSequenceCell = function (pdbGroup, cellStyle, pdb) {
            return (pdbGroup === 'experimental' && (React.createElement(semantic_ui_react_1.Table.Cell, { style: cellStyle }, _this.state.predictedProteins.length >= 1
                ? "" + _this.sequenceSimilarityPercent(pdb.sequence, _this.state.predictedProteins[0].sequence)
                : 'N/A')));
        };
        _this.renderPDBTableSequenceHeader = function (pdbGroup, cellStyle) {
            return pdbGroup === 'experimental' && React.createElement(semantic_ui_react_1.Table.HeaderCell, { style: cellStyle }, "Seq. ID");
        };
        _this.renderPDBTableSourceCell = function (pdbGroup, cellStyle, pdb) {
            return pdbGroup === 'experimental' && React.createElement(semantic_ui_react_1.Table.Cell, { style: cellStyle }, pdb.source);
        };
        _this.renderPDBTableSourceHeader = function (pdbGroup, cellStyle) {
            return pdbGroup === 'experimental' && React.createElement(semantic_ui_react_1.Table.HeaderCell, { style: cellStyle }, "Source");
        };
        _this.state = {
            experimentalProteins: [],
            predictedProteins: [],
            selectedExperimentalProteins: [],
            selectedPredictedProteins: [],
        };
        _this.setupDataServices();
        return _this;
    }
    NGLContainerClass.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, experimentalProteins, predictedProteins, selectedExperimentalProteins, selectedPredictedProteins;
            return tslib_1.__generator(this, function (_b) {
                _a = this.state, experimentalProteins = _a.experimentalProteins, predictedProteins = _a.predictedProteins;
                selectedExperimentalProteins = experimentalProteins.length >= 1 ? [experimentalProteins[0].name] : [];
                selectedPredictedProteins = predictedProteins.length >= 1 ? [predictedProteins[0].name] : [];
                this.setState({
                    selectedExperimentalProteins: selectedExperimentalProteins,
                    selectedPredictedProteins: selectedPredictedProteins,
                });
                return [2 /*return*/];
            });
        });
    };
    NGLContainerClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, experimentalProteins, predictedProteins, experimentalProteinsFromFiles, predictedProteinsFromFiles, _b, selectedExperimentalProteins, selectedPredictedProteins, isNewData;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, experimentalProteins = _a.experimentalProteins, predictedProteins = _a.predictedProteins;
                        return [4 /*yield*/, Promise.all(experimentalProteins.map(function (file) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, (typeof file === 'string' ? data_1.BioblocksPDB.createPDB(file) : file)];
                            }); }); }))];
                    case 1:
                        experimentalProteinsFromFiles = _c.sent();
                        return [4 /*yield*/, Promise.all(predictedProteins.map(function (file) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                                return [2 /*return*/, (typeof file === 'string' ? data_1.BioblocksPDB.createPDB(file) : file)];
                            }); }); }))];
                    case 2:
                        predictedProteinsFromFiles = _c.sent();
                        _b = this.state, selectedExperimentalProteins = _b.selectedExperimentalProteins, selectedPredictedProteins = _b.selectedPredictedProteins;
                        isNewData = false;
                        if (this.isBioblocksPDBArrayEqual(experimentalProteinsFromFiles, prevState.experimentalProteins)) {
                            isNewData = true;
                            selectedExperimentalProteins =
                                experimentalProteinsFromFiles.length === 0 ? [] : [experimentalProteinsFromFiles[0].name];
                        }
                        if (this.isBioblocksPDBArrayEqual(predictedProteinsFromFiles, prevState.predictedProteins)) {
                            isNewData = true;
                            selectedPredictedProteins = predictedProteinsFromFiles.length === 0 ? [] : [predictedProteinsFromFiles[0].name];
                        }
                        if (isNewData) {
                            this.setState({
                                experimentalProteins: experimentalProteinsFromFiles,
                                predictedProteins: predictedProteinsFromFiles,
                                selectedExperimentalProteins: selectedExperimentalProteins,
                                selectedPredictedProteins: selectedPredictedProteins,
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    NGLContainerClass.prototype.setupDataServices = function () {
        reducer_1.createContainerReducer('secondaryStructure/hovered');
        reducer_1.createContainerReducer('secondaryStructure/selected');
        reducer_1.createContainerReducer('pdb');
        reducer_1.createResiduePairReducer();
    };
    NGLContainerClass.prototype.render = function () {
        var _a = this.props, lockedResiduePairs = _a.lockedResiduePairs, rest = tslib_1.__rest(_a, ["lockedResiduePairs"]);
        var _b = this.state, experimentalProteins = _b.experimentalProteins, predictedProteins = _b.predictedProteins, selectedExperimentalProteins = _b.selectedExperimentalProteins, selectedPredictedProteins = _b.selectedPredictedProteins;
        return (React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
            React.createElement(semantic_ui_react_1.Grid, { padded: true },
                React.createElement(semantic_ui_react_1.Grid.Row, null,
                    React.createElement(component_1.NGLComponent, tslib_1.__assign({}, rest, { experimentalProteins: experimentalProteins.filter(function (pdb) { return selectedExperimentalProteins.includes(pdb.name); }), lockedResiduePairs: lockedResiduePairs.toJS(), menuItems: [
                            {
                                component: {
                                    name: 'POPUP',
                                    props: {
                                        children: this.renderPDBSelector(),
                                        disabled: experimentalProteins.length === 0 && predictedProteins.length === 0,
                                        position: 'top center',
                                        wide: 'very',
                                    },
                                },
                                description: 'PDB Selector',
                                iconName: 'tasks',
                            },
                        ], predictedProteins: predictedProteins.filter(function (pdb) { return selectedPredictedProteins.includes(pdb.name); }) }))))));
    };
    NGLContainerClass.prototype.isBioblocksPDBArrayEqual = function (a, b) {
        return (a.length !== b.length || a.reduce(function (prev, cur, index) { return prev || cur.name !== b[index].name; }, false));
    };
    NGLContainerClass.prototype.renderPDBSelector = function () {
        return (React.createElement(semantic_ui_react_1.Grid, { divided: true, padded: true },
            React.createElement(semantic_ui_react_1.Grid.Row, null,
                React.createElement(semantic_ui_react_1.Grid.Column, null,
                    React.createElement(semantic_ui_react_1.Header, null, "Select Structures to Display"))),
            React.createElement(semantic_ui_react_1.Grid.Row, { columns: 2, style: { padding: '5px 0' } },
                React.createElement(semantic_ui_react_1.Grid.Column, { width: 9 }, "Experimental (" + this.state.selectedExperimentalProteins.length + "/" + this.props.experimentalProteins.length + ")",
                    this.renderPDBTable(this.state.experimentalProteins, 'experimental', this.onExperimentalProteinSelect)),
                React.createElement(semantic_ui_react_1.Grid.Column, { width: 7 }, "Predicted (" + this.state.selectedPredictedProteins.length + "/" + this.props.predictedProteins.length + ")",
                    this.renderPDBTable(this.state.predictedProteins, 'predicted', this.onPredictedProteinSelect)))));
    };
    NGLContainerClass.prototype.renderPDBTable = function (data, pdbGroup, onChange) {
        var maxPDBPerPopup = this.props.maxPDBPerPopup;
        var cellStyle = { padding: '5px 0' };
        return (React.createElement("div", { style: { height: maxPDBPerPopup * 50 + "px", overflow: 'auto' } },
            React.createElement(semantic_ui_react_1.Table, { basic: 'very', compact: true, padded: true },
                this.renderPDBTableHeader(pdbGroup, cellStyle),
                this.renderPDBTableBody(data, pdbGroup, cellStyle, onChange))));
    };
    NGLContainerClass.prototype.sequenceSimilarityPercent = function (seqA, seqB, fractionDigits) {
        if (fractionDigits === void 0) { fractionDigits = 1; }
        var result = (seqA.split('').reduce(function (prev, cur, seqIndex) {
            return prev + (cur === seqB[seqIndex] ? 1 : 0);
        }, 0) /
            seqA.length) *
            100;
        return isNaN(result) ? 'N/A' : result.toFixed(fractionDigits) + "%";
    };
    NGLContainerClass.defaultProps = {
        dispatchNglFetch: helper_1.EMPTY_FUNCTION,
        experimentalProteins: [],
        isDataLoading: false,
        lockedResiduePairs: immutable_1.Map(),
        maxPDBPerPopup: 5,
        measuredProximity: data_1.CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
        predictedProteins: [],
        showConfigurations: true,
    };
    return NGLContainerClass;
}(React.Component));
exports.NGLContainerClass = NGLContainerClass;
var mapStateToProps = function (state, ownProps) { return ({
    candidateResidues: selector_1.getCandidates(state).toArray(),
    hoveredResidues: selector_1.getHovered(state).toArray(),
    hoveredSecondaryStructures: selector_1.selectCurrentItems(state, 'secondaryStructure/hovered').toArray(),
    lockedResiduePairs: selector_1.getLocked(state),
    removeNonLockedResidues: function () {
        var _a = ResiduePairAction_1.createResiduePairActions(), candidates = _a.candidates, hovered = _a.hovered;
        candidates.clear();
        hovered.clear();
    },
    selectedSecondaryStructures: selector_1.selectCurrentItems(state, 'secondaryStructure/selected').toArray(),
}); };
var mapDispatchToProps = function (dispatch) {
    return redux_1.bindActionCreators({
        addCandidateResidues: ResiduePairAction_1.createResiduePairActions().candidates.addMultiple,
        addHoveredResidues: ResiduePairAction_1.createResiduePairActions().hovered.set,
        addLockedResiduePair: ResiduePairAction_1.createResiduePairActions().locked.add,
        removeAllLockedResiduePairs: ResiduePairAction_1.createResiduePairActions().locked.clear,
        removeAllSelectedSecondaryStructures: action_1.createContainerActions('secondaryStructure/selected').clear,
        removeCandidateResidues: ResiduePairAction_1.createResiduePairActions().candidates.clear,
        removeHoveredResidues: ResiduePairAction_1.createResiduePairActions().hovered.clear,
        removeLockedResiduePair: ResiduePairAction_1.createResiduePairActions().locked.remove,
    }, dispatch);
};
var ConnectedNGLContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(NGLContainerClass);
exports.NGLContainer = function (props) {
    return (React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
        React.createElement(ConnectedNGLContainer, tslib_1.__assign({}, props))));
};
exports.NGLContainer.defaultProps = NGLContainerClass.defaultProps;
//# sourceMappingURL=NGLContainer.js.map