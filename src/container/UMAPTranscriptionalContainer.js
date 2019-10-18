"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var immutable_1 = require("immutable");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var action_1 = require("~bioblocks-viz~/action");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var selector_1 = require("~bioblocks-viz~/selector");
var UMAPTranscriptionalContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(UMAPTranscriptionalContainerClass, _super);
    function UMAPTranscriptionalContainerClass(props) {
        var _this = _super.call(this, props) || this;
        _this.subsampledIndices = new Array();
        _this.getAnnotations = function () {
            var categoricalAnnotations = _this.props.categoricalAnnotations;
            var annotations = {};
            if (categoricalAnnotations) {
                Object.keys(categoricalAnnotations).forEach(function (catName) {
                    // build the annotations state object from the prop
                    var propLabelList = categoricalAnnotations[catName].label_list;
                    var propLabelColors = categoricalAnnotations[catName].label_colors;
                    var stateLabelStyles;
                    if (!propLabelColors || Object.keys(propLabelColors).length === 0) {
                        // auto generate styles for the labels
                        stateLabelStyles = data_1.Marker.colors.autoColorFromStates(propLabelList);
                    }
                    else {
                        stateLabelStyles = propLabelList.map(function (labelName) {
                            if (propLabelColors[labelName]) {
                                return {
                                    color: propLabelColors[labelName],
                                    name: labelName,
                                };
                            }
                            return undefined;
                        });
                    }
                    annotations[catName] = stateLabelStyles;
                });
            }
            return annotations;
        };
        _this.getErrorMessages = function (annotationsUnchanged) {
            var _a = _this.props, categoricalAnnotations = _a.categoricalAnnotations, dataMatrix = _a.dataMatrix, sampleNames = _a.sampleNames;
            // rudimentary error checking
            var errorMessages = new Array();
            if (sampleNames && dataMatrix.length !== sampleNames.length) {
                errorMessages.push("The " + sampleNames.length + " sample names provided do not account for all " + dataMatrix.length + " data matrix rows.");
            }
            if (annotationsUnchanged === false && categoricalAnnotations) {
                Object.keys(categoricalAnnotations).forEach(function (labelCategory) {
                    var category = categoricalAnnotations[labelCategory];
                    if (category.label_list.length !== dataMatrix.length) {
                        errorMessages.push("Label category " + labelCategory + " does not provide labels for all " + dataMatrix.length + " samples in the data matrix.");
                    }
                });
            }
            return errorMessages;
        };
        _this.state = {
            completeSampleAnnotations: {},
            errorMessages: [],
        };
        return _this;
    }
    UMAPTranscriptionalContainerClass.prototype.componentDidMount = function () {
        this.prepareData();
    };
    UMAPTranscriptionalContainerClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (prevProps.dataMatrix !== this.props.dataMatrix ||
            prevProps.numSamplesToShow !== this.props.numSamplesToShow ||
            prevProps.sampleNames !== this.props.sampleNames ||
            prevProps.categoricalAnnotations !== this.props.categoricalAnnotations ||
            prevProps.labelCategory !== this.props.labelCategory) {
            this.prepareData(prevProps.categoricalAnnotations === this.props.categoricalAnnotations);
        }
    };
    UMAPTranscriptionalContainerClass.prototype.render = function () {
        var _a = this.props, dataMatrix = _a.dataMatrix, labelCategory = _a.labelCategory, numIterationsBeforeReRender = _a.numIterationsBeforeReRender, numSamplesToShow = _a.numSamplesToShow, rest = tslib_1.__rest(_a, ["dataMatrix", "labelCategory", "numIterationsBeforeReRender", "numSamplesToShow"]);
        var _b = this.state, completeSampleAnnotations = _b.completeSampleAnnotations, errorMessages = _b.errorMessages;
        var dataLabels = new Array();
        var subsampledSampleNames = new Array();
        var subsampledData = new Array(new Array());
        if (this.subsampledIndices.length > 0) {
            subsampledData = this.subsampledIndices.map(function (idx) { return dataMatrix[idx]; });
            if (labelCategory && completeSampleAnnotations && completeSampleAnnotations[labelCategory]) {
                var labelAnnotations_1 = completeSampleAnnotations[labelCategory];
                dataLabels = this.subsampledIndices.map(function (idx) {
                    return labelAnnotations_1[idx];
                });
                subsampledSampleNames = this.subsampledIndices.map(function (idx) {
                    var sampleLabel = labelAnnotations_1[idx];
                    return sampleLabel ? sampleLabel.name : 'unannotated';
                });
            }
        }
        return (React.createElement(component_1.UMAPVisualization, tslib_1.__assign({ dataLabels: dataLabels, dataMatrix: subsampledData, errorMessages: errorMessages, tooltipNames: subsampledSampleNames, numIterationsBeforeReRender: numIterationsBeforeReRender }, rest)));
    };
    UMAPTranscriptionalContainerClass.prototype.prepareData = function (annotationsUnchanged) {
        if (annotationsUnchanged === void 0) { annotationsUnchanged = false; }
        var numSamplesToShow = this.props.numSamplesToShow;
        var errorMessages = this.getErrorMessages(annotationsUnchanged);
        // auto generate marker properties if they are not explicitly set
        var annotations = this.state.completeSampleAnnotations;
        if (annotationsUnchanged === false) {
            annotations = this.getAnnotations();
        }
        // subsample data if needed
        if (!this.subsampledIndices || this.subsampledIndices.length !== numSamplesToShow) {
            this.subsampledIndices = helper_1.subsample(this.props.dataMatrix, numSamplesToShow, true);
        }
        this.setState({
            completeSampleAnnotations: annotations,
            errorMessages: errorMessages,
        });
    };
    UMAPTranscriptionalContainerClass.defaultProps = {
        currentCells: immutable_1.Set(),
        numIterationsBeforeReRender: 1,
        numSamplesToShow: 4000,
        setCurrentCells: helper_1.EMPTY_FUNCTION,
    };
    return UMAPTranscriptionalContainerClass;
}(React.Component));
exports.UMAPTranscriptionalContainerClass = UMAPTranscriptionalContainerClass;
var mapStateToProps = function (state) { return ({
    currentCells: selector_1.selectCurrentItems(state, 'cells'),
}); };
var mapDispatchToProps = function (dispatch) {
    return redux_1.bindActionCreators({
        setCurrentCells: action_1.createContainerActions('cells').set,
    }, dispatch);
};
exports.UMAPTranscriptionalContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(UMAPTranscriptionalContainerClass);
//# sourceMappingURL=UMAPTranscriptionalContainer.js.map