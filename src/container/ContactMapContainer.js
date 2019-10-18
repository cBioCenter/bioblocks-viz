"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var action_1 = require("~bioblocks-viz~/action");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var reducer_1 = require("~bioblocks-viz~/reducer");
var selector_1 = require("~bioblocks-viz~/selector");
exports.initialContactMapContainerState = {
    linearDistFilter: 5,
    minimumProbability: 0.9,
    minimumScore: 0,
    numPredictionsToShow: -1,
    pointsToPlot: [],
    rankFilter: [1, 100],
};
/**
 * Container for the ContactMap, responsible for data interaction.
 * @extends {React.Component<IContactMapContainerProps, ContactMapContainerState>}
 */
var ContactMapContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(ContactMapContainerClass, _super);
    function ContactMapContainerClass(props) {
        var _this = _super.call(this, props) || this;
        _this.state = exports.initialContactMapContainerState;
        _this.onLinearDistFilterChange = function () { return function (value) {
            _this.setState({
                linearDistFilter: value,
            });
        }; };
        _this.onMinimumProbabilityChange = function () { return function (value) {
            _this.setState({
                minimumProbability: value,
            });
        }; };
        _this.onNumPredictionsToShowChange = function () { return function (value) {
            _this.setState({
                numPredictionsToShow: value,
            });
        }; };
        _this.getConfigs = function () {
            var _a;
            var _b = _this.state, linearDistFilter = _b.linearDistFilter, minimumProbability = _b.minimumProbability, numPredictionsToShow = _b.numPredictionsToShow;
            var chainLength = _this.props.data.couplingScores.chainLength;
            return [
                {
                    marks: (_a = {},
                        _a[Math.floor(chainLength / 2)] = 'L/2',
                        _a[Math.floor(chainLength / 4)] = 'L/4',
                        _a[0] = '0',
                        _a[chainLength] = 'L',
                        _a[chainLength * 2] = '2L',
                        _a[chainLength * 3] = '3L',
                        _a),
                    name: '# Couplings to Display',
                    onChange: _this.onNumPredictionsToShowChange(),
                    type: data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER,
                    values: {
                        current: numPredictionsToShow,
                        defaultValue: Math.floor(chainLength / 2),
                        max: chainLength * 3,
                        min: 0,
                    },
                },
                {
                    name: 'Linear Distance Filter (|i - j|)',
                    onChange: _this.onLinearDistFilterChange(),
                    type: data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER,
                    values: {
                        current: linearDistFilter,
                        defaultValue: exports.initialContactMapContainerState.linearDistFilter,
                        max: 10,
                        min: 1,
                    },
                },
                {
                    name: 'Minimum Probability',
                    onChange: _this.onMinimumProbabilityChange(),
                    step: 0.01,
                    type: data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER,
                    values: {
                        current: minimumProbability,
                        defaultValue: exports.initialContactMapContainerState.minimumProbability,
                        max: 1.0,
                        min: 0.0,
                    },
                },
            ];
        };
        _this.getPredictedFilters = function () {
            var _a = _this.state, linearDistFilter = _a.linearDistFilter, minimumProbability = _a.minimumProbability, minimumScore = _a.minimumScore;
            return new Array({
                filterFn: function (score) { return (score.probability !== undefined ? score.probability >= minimumProbability : true); },
            }, {
                filterFn: function (score) { return (score.score !== undefined ? score.score >= minimumScore : true); },
            }, {
                filterFn: function (score) { return Math.abs(score.i - score.j) >= linearDistFilter; },
            });
        };
        _this.setupDataServices();
        return _this;
    }
    ContactMapContainerClass.prototype.setupDataServices = function () {
        reducer_1.createContainerReducer('secondaryStructure/hovered');
        reducer_1.createContainerReducer('secondaryStructure/selected');
        reducer_1.createContainerReducer('pdb');
        reducer_1.createResiduePairReducer();
    };
    ContactMapContainerClass.prototype.componentDidMount = function () {
        this.setupData(true);
    };
    ContactMapContainerClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this.props, agreementColor = _a.agreementColor, allColor = _a.allColor, data = _a.data;
        var _b = this.state, linearDistFilter = _b.linearDistFilter, minimumProbability = _b.minimumProbability, minimumScore = _b.minimumScore, numPredictionsToShow = _b.numPredictionsToShow, rankFilter = _b.rankFilter;
        var isRecomputeNeeded = agreementColor !== prevProps.agreementColor ||
            allColor !== prevProps.allColor ||
            data.couplingScores !== prevProps.data.couplingScores ||
            linearDistFilter !== prevState.linearDistFilter ||
            minimumProbability !== prevState.minimumProbability ||
            minimumScore !== prevState.minimumScore ||
            numPredictionsToShow !== prevState.numPredictionsToShow ||
            rankFilter !== prevState.rankFilter;
        if (isRecomputeNeeded) {
            this.setupData(data.couplingScores !== prevProps.data.couplingScores);
        }
    };
    ContactMapContainerClass.prototype.render = function () {
        var _a = this.props, data = _a.data, style = _a.style, passThroughProps = tslib_1.__rest(_a, ["data", "style"]);
        var pointsToPlot = this.state.pointsToPlot;
        return (React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
            React.createElement("div", { className: "ContactMapContainer", style: style },
                React.createElement(component_1.ContactMapComponent, tslib_1.__assign({ configurations: this.getConfigs(), data: {
                        couplingScores: data.couplingScores,
                        pdbData: data.pdbData,
                        secondaryStructures: data.secondaryStructures,
                    }, formattedPoints: pointsToPlot }, passThroughProps)))));
    };
    /**
     * Setups up the prediction values for the data.
     *
     * @param isNewData Is this an entirely new dataset?
     */
    ContactMapContainerClass.prototype.setupData = function (isNewData) {
        var _a = this.props, agreementColor = _a.agreementColor, data = _a.data, allColor = _a.allColor;
        var _b = this.state, linearDistFilter = _b.linearDistFilter, numPredictionsToShow = _b.numPredictionsToShow;
        var couplingScores = data.couplingScores;
        var chainLength = couplingScores.chainLength;
        var newPoints = new Array();
        if (couplingScores.isDerivedFromCouplingScores) {
            var allPredictions = couplingScores.getPredictedContacts(numPredictionsToShow, linearDistFilter, this.getPredictedFilters());
            var correctPredictionPercent = ((allPredictions.correct.length / allPredictions.predicted.length) *
                100).toFixed(1);
            newPoints.push(component_1.generateChartDataEntry('text', allColor, 'Inferred Contact', "(N=" + numPredictionsToShow + ", L=" + chainLength + ")", 4, allPredictions.predicted, {
                text: allPredictions.predicted.map(helper_1.generateCouplingScoreHoverText),
            }), component_1.generateChartDataEntry('text', agreementColor, 'Inferred Contact Agrees with PDB Contact', "(N=" + allPredictions.correct.length + ", " + correctPredictionPercent + "%)", 6, allPredictions.correct, {
                text: allPredictions.correct.map(helper_1.generateCouplingScoreHoverText),
            }));
        }
        this.setState({
            numPredictionsToShow: isNewData ? Math.floor(chainLength / 2) : numPredictionsToShow,
            pointsToPlot: newPoints,
        });
    };
    ContactMapContainerClass.defaultProps = {
        addHoveredResidues: helper_1.EMPTY_FUNCTION,
        addHoveredSecondaryStructure: helper_1.EMPTY_FUNCTION,
        addSelectedSecondaryStructure: helper_1.EMPTY_FUNCTION,
        agreementColor: '#ff0000',
        allColor: '#000000',
        data: {
            couplingScores: new data_1.CouplingContainer(),
            secondaryStructures: new Array(),
        },
        filters: [],
        height: '100%',
        highlightColor: '#ff8800',
        isDataLoading: false,
        observedColor: '#0000ff',
        onBoxSelection: helper_1.EMPTY_FUNCTION,
        removeAllLockedResiduePairs: helper_1.EMPTY_FUNCTION,
        removeAllSelectedSecondaryStructures: helper_1.EMPTY_FUNCTION,
        removeHoveredResidues: helper_1.EMPTY_FUNCTION,
        removeHoveredSecondaryStructure: helper_1.EMPTY_FUNCTION,
        removeSecondaryStructure: helper_1.EMPTY_FUNCTION,
        toggleLockedResiduePair: helper_1.EMPTY_FUNCTION,
        width: '100%',
    };
    return ContactMapContainerClass;
}(React.Component));
exports.ContactMapContainerClass = ContactMapContainerClass;
var mapStateToProps = function (state) { return ({
    hoveredResidues: selector_1.getHovered(state).toArray(),
    hoveredSecondaryStructures: selector_1.selectCurrentItems(state, 'secondaryStructure/hovered').toArray(),
    lockedResiduePairs: selector_1.getLocked(state).toJS(),
    selectedSecondaryStructures: selector_1.selectCurrentItems(state, 'secondaryStructure/selected').toArray(),
}); };
var mapDispatchToProps = function (dispatch) {
    return redux_1.bindActionCreators({
        addHoveredResidues: action_1.createResiduePairActions().hovered.set,
        addHoveredSecondaryStructure: action_1.createContainerActions('secondaryStructure/hovered').add,
        addSelectedSecondaryStructure: action_1.createContainerActions('secondaryStructure/selected').add,
        removeAllLockedResiduePairs: action_1.createResiduePairActions().locked.clear,
        removeAllSelectedSecondaryStructures: action_1.createContainerActions('secondaryStructure/selected').clear,
        removeHoveredResidues: action_1.createResiduePairActions().hovered.clear,
        removeHoveredSecondaryStructure: action_1.createContainerActions('secondaryStructure/hovered').remove,
        removeSecondaryStructure: action_1.createContainerActions('secondaryStructure/selected').remove,
        toggleLockedResiduePair: action_1.createResiduePairActions().locked.toggle,
    }, dispatch);
};
exports.ContactMapContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ContactMapContainerClass);
//# sourceMappingURL=ContactMapContainer.js.map