"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ResidueContext_1 = require("../context/ResidueContext");
var PlotlyHelper_1 = require("../helper/PlotlyHelper");
var ReactHelper_1 = require("../helper/ReactHelper");
var ChellSlider_1 = require("./ChellSlider");
var defaultProps = {
    contactColor: '#009999',
    couplingColor: '#000000',
    data: {
        contactMonomer: [],
        couplingScore: [],
        distanceMapMonomer: [],
    },
    enableSliders: false,
    height: 400,
    highlightColor: '#0000ff',
    onClick: undefined,
    onMouseEnter: undefined,
    padding: 0,
    selectedData: undefined,
    width: 400,
};
var initialState = {
    contactPoints: new Float32Array(0),
    couplingPoints: new Float32Array(0),
    highlightedPoints: new Float32Array(0),
    nodeSize: 4,
    probabilityFilter: 0.99,
};
exports.ContactMap = ReactHelper_1.withDefaultProps(defaultProps, /** @class */ (function (_super) {
    __extends(ContactMapComponentClass, _super);
    function ContactMapComponentClass(props) {
        var _this = _super.call(this, props) || this;
        _this.state = initialState;
        _this.onClick = function () { return function (coupling) {
            if (_this.props.onClick) {
                _this.props.onClick(coupling);
            }
        }; };
        _this.onProbabilityChange = function () { return function (value) {
            _this.setState({
                probabilityFilter: value / 100,
            });
        }; };
        _this.onNodeSizeChange = function () { return function (value) {
            _this.setState({
                nodeSize: value,
            });
        }; };
        _this.onMouseEnter = function (cb) { return function (e) {
            var points = e.points;
            cb([points[0].x, points[0].y]);
        }; };
        _this.onMouseClick = function (cb) { return function (e) {
            var points = e.points;
            cb([points[0].x, points[0].y]);
        }; };
        _this.onMouseSelect = function () { return function (e) {
            console.log("onMouseSelect: " + e);
        }; };
        return _this;
    }
    ContactMapComponentClass.prototype.componentDidMount = function () {
        var data = this.props.data;
        if (data) {
            this.setupData(data);
        }
    };
    ContactMapComponentClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        var data = this.props.data;
        var isFreshDataView = data !== prevProps.data || this.state.probabilityFilter !== prevState.probabilityFilter;
        if (isFreshDataView) {
            this.setupData(data);
        }
    };
    ContactMapComponentClass.prototype.render = function () {
        var _this = this;
        var _a = this.props, contactColor = _a.contactColor, couplingColor = _a.couplingColor, height = _a.height, highlightColor = _a.highlightColor, padding = _a.padding, width = _a.width;
        var _b = this.state, contactPoints = _b.contactPoints, couplingPoints = _b.couplingPoints;
        return (React.createElement(ResidueContext_1.ResidueContext.Consumer, null, function (_a) {
            var addLockedResiduePair = _a.addLockedResiduePair, addHoveredResidues = _a.addHoveredResidues, candidateResidues = _a.candidateResidues, hoveredResidues = _a.hoveredResidues, lockedResiduePairs = _a.lockedResiduePairs, removeLockedResiduePair = _a.removeLockedResiduePair;
            return (React.createElement("div", { id: "ContactMapComponent", style: { padding: padding } },
                React.createElement(PlotlyHelper_1.PlotlyChart, { config: __assign({}, PlotlyHelper_1.defaultConfig), data: [
                        PlotlyHelper_1.generatePointCloudData(contactPoints, contactColor, _this.state.nodeSize),
                        PlotlyHelper_1.generatePointCloudData(couplingPoints, couplingColor, _this.state.nodeSize),
                        PlotlyHelper_1.generatePointCloudData(_this.getHighlightedResidues(lockedResiduePairs), highlightColor, _this.state.nodeSize),
                    ], layout: __assign({}, PlotlyHelper_1.defaultLayout, { height: height,
                        width: width, xaxis: __assign({}, PlotlyHelper_1.defaultLayout.xaxis, { gridcolor: '#ff0000', gridwidth: _this.state.nodeSize, showticklabels: false, tickvals: candidateResidues.concat(hoveredResidues) }), yaxis: __assign({}, PlotlyHelper_1.defaultLayout.yaxis, { gridcolor: '#ff0000', gridwidth: _this.state.nodeSize, showticklabels: false, tickvals: candidateResidues.concat(hoveredResidues) }) }), onHoverCallback: _this.onMouseEnter(addHoveredResidues), onClickCallback: _this.onMouseClick(addLockedResiduePair), onSelectedCallback: _this.onMouseSelect() }),
                _this.props.enableSliders && _this.renderSliders()));
        }));
    };
    ContactMapComponentClass.prototype.renderSliders = function () {
        var width = this.props.width;
        var sliderStyle = { width: width };
        return (React.createElement("div", null,
            React.createElement(ChellSlider_1.ChellSlider, { max: 100, min: 0, label: 'Probability', defaultValue: 99, onChange: this.onProbabilityChange(), style: sliderStyle }),
            React.createElement(ChellSlider_1.ChellSlider, { max: 5, min: 1, label: 'Node Size', defaultValue: this.state.nodeSize, onChange: this.onNodeSizeChange(), style: sliderStyle })));
    };
    ContactMapComponentClass.prototype.setupData = function (data) {
        var _this = this;
        var blackDots = new Array();
        data.couplingScore.filter(function (coupling) { return coupling.probability >= _this.state.probabilityFilter; }).forEach(function (coupling) {
            blackDots.push(coupling);
            blackDots.push(__assign({}, coupling, { i: coupling.j, 
                // tslint:disable-next-line:object-literal-sort-keys
                A_i: coupling.A_j, j: coupling.i, A_j: coupling.A_i }));
        });
        var contactPoints = new Float32Array(data.contactMonomer.length * 2);
        data.contactMonomer.forEach(function (contact, index) {
            contactPoints[index * 2] = contact.i;
            contactPoints[index * 2 + 1] = contact.j;
        });
        var couplingPoints = new Float32Array(blackDots.length * 2);
        blackDots.forEach(function (coupling, index) {
            couplingPoints[index * 2] = coupling.i;
            couplingPoints[index * 2 + 1] = coupling.j;
        });
        this.setState({
            contactPoints: contactPoints,
            couplingPoints: couplingPoints,
        });
    };
    ContactMapComponentClass.prototype.getHighlightedResidues = function (pairs) {
        var pairKeys = Object.keys(pairs);
        var highlightedPoints = [];
        for (var _i = 0, pairKeys_1 = pairKeys; _i < pairKeys_1.length; _i++) {
            var key = pairKeys_1[_i];
            for (var _a = 0, _b = pairs[key]; _a < _b.length; _a++) {
                var residue = _b[_a];
                highlightedPoints.push(residue);
            }
        }
        return new Float32Array(highlightedPoints.concat(highlightedPoints.slice().reverse()));
    };
    return ContactMapComponentClass;
}(React.Component)));
