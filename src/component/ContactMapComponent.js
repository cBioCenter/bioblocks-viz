"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
exports.initialContactMapState = {
    pointsToPlot: new Array(),
};
/**
 * Presentational Component for the ContactMap.
 *
 * @extends {React.Component<IContactMapComponentProps, ContactMapComponentState>}
 */
var ContactMapComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ContactMapComponent, _super);
    function ContactMapComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = exports.initialContactMapState;
        _this.onNodeSelectionChange = function (index) { return function (event, data) {
            var pointsToPlot = _this.state.pointsToPlot;
            _this.setState({
                pointsToPlot: tslib_1.__spread(pointsToPlot.slice(0, index), [
                    tslib_1.__assign(tslib_1.__assign({}, pointsToPlot[index]), { hoverinfo: pointsToPlot[index].hoverinfo === 'skip' ? 'text' : 'skip' })
                ], pointsToPlot.slice(index + 1)),
            });
        }; };
        _this.onNodeSizeChange = function (index, nodeSizeMod) { return function (event, data) {
            var pointsToPlot = _this.state.pointsToPlot;
            _this.setState({
                pointsToPlot: tslib_1.__spread(pointsToPlot.slice(0, index), [
                    tslib_1.__assign(tslib_1.__assign({}, pointsToPlot[index]), { 
                        // This ensures a number in the range [1, 10]. 0 is an invalid point size in plotly.
                        nodeSize: Math.min(Math.max(Math.abs(pointsToPlot[index].nodeSize + nodeSizeMod), 1), 10) })
                ], pointsToPlot.slice(index + 1)),
            });
        }; };
        /**
         * Given a chart data entry, sets node options if one is already set for this point.
         *
         * @param chartDatum A single chart data entry.
         */
        _this.applySavedNodeOptions = function (chartDatum) {
            var pointsToPlot = _this.state.pointsToPlot;
            var index = pointsToPlot.findIndex(function (currentPoint) { return currentPoint.name === chartDatum.name; });
            if (index >= 0) {
                return tslib_1.__assign(tslib_1.__assign({}, chartDatum), { hoverinfo: pointsToPlot[index].hoverinfo, nodeSize: pointsToPlot[index].nodeSize });
            }
            else {
                return chartDatum;
            }
        };
        /**
         * Returns an {i, j} pair for a hovered residue. Handles case when a single residue is hovered.
         *
         * @param hoveredResidues Array of residues that are hovered.
         */
        _this.generateHoveredResiduePairs = function (hoveredResidues) {
            if (hoveredResidues.length >= 1) {
                return [
                    {
                        i: hoveredResidues[0],
                        j: hoveredResidues.length === 1 ? hoveredResidues[0] : hoveredResidues[1],
                    },
                ];
            }
            return [];
        };
        /**
         * Returns contact map points for locked residue pairs.
         *
         * @param hoveredResidues Array of residues that are hovered.
         */
        _this.generateLockedResiduePairs = function (lockedResiduePairs) {
            var lockedResiduePairKeys = Object.keys(lockedResiduePairs);
            return lockedResiduePairKeys.reduce(function (reduceResult, key) {
                var keyPair = lockedResiduePairs[key];
                if (keyPair && keyPair.length === 2) {
                    reduceResult.push({ i: keyPair[0], j: keyPair[1], dist: 0 });
                }
                return reduceResult;
            }, new Array());
        };
        _this.generateSelectedResiduesChartData = function (highlightColor, chartName, nodeSize, chartPoints) {
            return component_1.generateChartDataEntry('none', highlightColor, chartName, '', nodeSize, chartPoints, {
                marker: {
                    color: new Array(chartPoints.length * 2).fill(highlightColor),
                    line: {
                        color: highlightColor,
                        width: 3,
                    },
                    symbol: 'circle-open',
                },
            });
        };
        /**
         * Gets the color from the provided chart entry.
         *
         * The following are checked in order - the first one found is the color returned:
         * - Marker's line color.
         * - Marker's color.
         * - Marker's colorscale.
         * - Line color.
         */
        _this.getColorFromEntry = function (entry) {
            if (entry.marker) {
                if (entry.marker.line && entry.marker.line.color) {
                    return entry.marker.line.color;
                }
                if (entry.marker.color) {
                    return Array.isArray(entry.marker.color) ? entry.marker.color[0] : entry.marker.color;
                }
                if (entry.marker.colorscale) {
                    return Array.isArray(entry.marker.colorscale) ? entry.marker.colorscale[0][1] : entry.marker.colorscale;
                }
            }
            if (entry.line && entry.line.color) {
                return entry.line.color;
            }
        };
        _this.getDockConfigs = function () { return [
            {
                isVisibleCb: function () {
                    return _this.props.selectedSecondaryStructures.length >= 1 || Object.values(_this.props.lockedResiduePairs).length >= 1;
                },
                onClick: function () {
                    _this.props.removeAllLockedResiduePairs();
                    _this.props.removeAllSelectedSecondaryStructures();
                    _this.props.removeHoveredResidues();
                },
                text: 'Clear Selections',
            },
        ]; };
        _this.getMenuConfigs = function (Filters, pointsToPlot) { return [
            {
                component: {
                    configs: { Filters: Filters },
                    name: 'POPUP',
                },
                description: 'Filter',
                iconName: 'filter',
            },
            {
                component: {
                    configs: _this.getNodeOptionConfigs(pointsToPlot),
                    name: 'POPUP',
                },
                description: 'Settings',
            },
        ]; };
        _this.getNodeOptionConfigs = function (entries) { return ({
            'Node Options': new (Array.bind.apply(Array, tslib_1.__spread([void 0, {
                    id: 'stuff-1-2-3',
                    name: '',
                    // prettier-ignore
                    options: [(React.createElement(semantic_ui_react_1.Label, { basic: true, style: { border: 0 }, key: 'node-selection-label' }, "Selectable?"))],
                    style: { padding: 0 },
                    type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP,
                }], entries.map(function (entry, index) {
                var color = _this.getColorFromEntry(entry);
                // prettier-ignore
                var options = [(React.createElement(semantic_ui_react_1.Checkbox, { checked: _this.state.pointsToPlot[index].hoverinfo !== 'skip', key: "node-selection-checkbox-" + index, onClick: _this.onNodeSelectionChange(index) })),
                    (React.createElement(semantic_ui_react_1.Icon, { key: "node-size-slider-" + index + "-minus", name: 'minus', onClick: _this.onNodeSizeChange(index, -1), size: 'small', style: { color: color } })), (React.createElement(semantic_ui_react_1.Icon, { key: "node-size-slider-" + index + "-2", name: 'circle', size: 'small', style: { color: color } })), (React.createElement(semantic_ui_react_1.Icon, { key: "node-size-slider-" + index + "-plus", name: 'plus', onClick: _this.onNodeSizeChange(index, 1), size: 'small', style: { color: color } })),];
                return {
                    id: "node-option-config-" + index,
                    name: entry.name,
                    options: options,
                    style: { padding: '.5em' },
                    type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP,
                };
            }))))(),
        }); };
        _this.handleAxisClick = function (e) {
            var e_1, _a, e_2, _b;
            var _c = _this.props, addSelectedSecondaryStructure = _c.addSelectedSecondaryStructure, data = _c.data, removeSecondaryStructure = _c.removeSecondaryStructure, selectedSecondaryStructures = _c.selectedSecondaryStructures;
            try {
                for (var _d = tslib_1.__values(data.secondaryStructures), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var secondaryStructure = _e.value;
                    try {
                        for (var secondaryStructure_1 = (e_2 = void 0, tslib_1.__values(secondaryStructure)), secondaryStructure_1_1 = secondaryStructure_1.next(); !secondaryStructure_1_1.done; secondaryStructure_1_1 = secondaryStructure_1.next()) {
                            var section = secondaryStructure_1_1.value;
                            if (section.contains.apply(section, tslib_1.__spread(e.selectedPoints))) {
                                if (selectedSecondaryStructures.includes(section)) {
                                    removeSecondaryStructure(section);
                                }
                                else {
                                    addSelectedSecondaryStructure(section);
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (secondaryStructure_1_1 && !secondaryStructure_1_1.done && (_b = secondaryStructure_1.return)) _b.call(secondaryStructure_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        _this.handleAxisEnter = function (e) {
            var e_3, _a, e_4, _b;
            var _c = _this.props, addHoveredSecondaryStructure = _c.addHoveredSecondaryStructure, hoveredSecondaryStructures = _c.hoveredSecondaryStructures, data = _c.data;
            try {
                for (var _d = tslib_1.__values(data.secondaryStructures), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var secondaryStructure = _e.value;
                    var _loop_1 = function (section) {
                        if (section.contains.apply(section, tslib_1.__spread(e.selectedPoints)) &&
                            !hoveredSecondaryStructures.find(function (secStruct) { return section.isEqual(secStruct); })) {
                            addHoveredSecondaryStructure(section);
                        }
                    };
                    try {
                        for (var secondaryStructure_2 = (e_4 = void 0, tslib_1.__values(secondaryStructure)), secondaryStructure_2_1 = secondaryStructure_2.next(); !secondaryStructure_2_1.done; secondaryStructure_2_1 = secondaryStructure_2.next()) {
                            var section = secondaryStructure_2_1.value;
                            _loop_1(section);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (secondaryStructure_2_1 && !secondaryStructure_2_1.done && (_b = secondaryStructure_2.return)) _b.call(secondaryStructure_2);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        _this.handleAxisLeave = function (e) {
            var e_5, _a, e_6, _b;
            var _c = _this.props, data = _c.data, hoveredSecondaryStructures = _c.hoveredSecondaryStructures, removeHoveredSecondaryStructure = _c.removeHoveredSecondaryStructure;
            try {
                for (var _d = tslib_1.__values(data.secondaryStructures), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var secondaryStructure = _e.value;
                    var _loop_2 = function (section) {
                        var searchResult = hoveredSecondaryStructures.find(function (secStruct) { return section.isEqual(secStruct); });
                        if (section.contains.apply(section, tslib_1.__spread(e.selectedPoints)) && searchResult) {
                            removeHoveredSecondaryStructure(searchResult);
                        }
                    };
                    try {
                        for (var secondaryStructure_3 = (e_6 = void 0, tslib_1.__values(secondaryStructure)), secondaryStructure_3_1 = secondaryStructure_3.next(); !secondaryStructure_3_1.done; secondaryStructure_3_1 = secondaryStructure_3.next()) {
                            var section = secondaryStructure_3_1.value;
                            _loop_2(section);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (secondaryStructure_3_1 && !secondaryStructure_3_1.done && (_b = secondaryStructure_3.return)) _b.call(secondaryStructure_3);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        _this.onMouseClick = function (cb) { return function (e) {
            var _a;
            if (e.isAxis()) {
                _this.handleAxisClick(e);
            }
            else {
                cb((_a = {}, _a[e.selectedPoints.sort().toString()] = e.selectedPoints, _a));
            }
        }; };
        _this.onMouseEnter = function (cb) { return function (e) {
            if (e.isAxis()) {
                _this.handleAxisEnter(e);
            }
            else {
                cb(e.selectedPoints);
            }
        }; };
        _this.onMouseLeave = function (cb) { return function (e) {
            if (e.isAxis()) {
                _this.handleAxisLeave(e);
            }
            else if (cb) {
                cb(e.selectedPoints);
            }
        }; };
        _this.onMouseSelect = function (cb) { return function (e) {
            if (cb) {
                // For the contact map, all the x/y values are mirrored and correspond directly with i/j values.
                // Thus, all the residue numbers can be obtained by getting either all x or values from ths selected points.
                cb(e.selectedPoints.map(function (point) { return point; }));
            }
        }; };
        return _this;
    }
    ContactMapComponent.prototype.componentDidMount = function () {
        this.setupPointsToPlot(this.props.data.couplingScores);
    };
    ContactMapComponent.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, data = _a.data, lockedResiduePairs = _a.lockedResiduePairs;
        if (data !== prevProps.data || lockedResiduePairs !== prevProps.lockedResiduePairs) {
            this.setupPointsToPlot(data.couplingScores);
        }
    };
    ContactMapComponent.prototype.render = function () {
        var pointsToPlot = this.state.pointsToPlot;
        return this.renderContactMapChart(pointsToPlot);
    };
    ContactMapComponent.prototype.renderContactMapChart = function (pointsToPlot) {
        var _a = this.props, addHoveredResidues = _a.addHoveredResidues, configurations = _a.configurations, data = _a.data, height = _a.height, isDataLoading = _a.isDataLoading, onBoxSelection = _a.onBoxSelection, removeHoveredResidues = _a.removeHoveredResidues, secondaryStructureColors = _a.secondaryStructureColors, selectedSecondaryStructures = _a.selectedSecondaryStructures, showConfigurations = _a.showConfigurations, toggleLockedResiduePair = _a.toggleLockedResiduePair, width = _a.width;
        var range = data.couplingScores.totalContacts >= 1 ? data.couplingScores.residueIndexRange.max : undefined;
        return (React.createElement(component_1.ComponentCard, { componentName: 'Contact Map', dockItems: this.getDockConfigs(), isDataReady: data.couplingScores.allContacts.length >= 1, menuItems: this.getMenuConfigs(configurations, pointsToPlot) },
            React.createElement(component_1.ContactMapChart, { contactData: pointsToPlot, height: height, isDataLoading: isDataLoading, onClickCallback: this.onMouseClick(toggleLockedResiduePair), onHoverCallback: this.onMouseEnter(addHoveredResidues), onSelectedCallback: this.onMouseSelect(onBoxSelection), onUnHoverCallback: this.onMouseLeave(removeHoveredResidues), range: range, secondaryStructures: data.secondaryStructures ? data.secondaryStructures : [], secondaryStructureColors: secondaryStructureColors, selectedSecondaryStructures: [selectedSecondaryStructures], showConfigurations: showConfigurations, width: width })));
    };
    ContactMapComponent.prototype.setupPointsToPlot = function (couplingContainer) {
        var _a = this.props, data = _a.data, lockedResiduePairs = _a.lockedResiduePairs, hoveredResidues = _a.hoveredResidues, formattedPoints = _a.formattedPoints, observedColor = _a.observedColor, highlightColor = _a.highlightColor;
        var chartNames = {
            selected: 'Selected Residue Pair',
            structure: (data.pdbData ? (data.pdbData.experimental ? 'X-ray' : 'Inferred') : 'Unknown') + " Structure Contact",
        };
        var observedContactPoints = couplingContainer
            .getObservedContacts()
            .sort(function (pointA, pointB) { return (pointA.dist && pointB.dist ? pointB.dist - pointA.dist : 0); });
        var result = new (Array.bind.apply(Array, tslib_1.__spread([void 0, component_1.generateChartDataEntry('text', { start: observedColor, end: 'rgb(247,251,255)' }, "Structure Contact (" + (data.couplingScores.isDerivedFromCouplingScores ? 'Coupling Scores' : 'PDB') + ")", chartNames.structure, 4, observedContactPoints, {
                text: observedContactPoints.map(helper_1.generateCouplingScoreHoverText),
            })], formattedPoints)))();
        var chartPoints = new Array();
        chartPoints.push.apply(chartPoints, tslib_1.__spread(this.generateHoveredResiduePairs(hoveredResidues)));
        chartPoints.push.apply(chartPoints, tslib_1.__spread(this.generateLockedResiduePairs(lockedResiduePairs)));
        result.push(this.generateSelectedResiduesChartData(highlightColor, chartNames.selected, 4, chartPoints));
        this.setState(tslib_1.__assign(tslib_1.__assign({}, this.state), { pointsToPlot: result.map(this.applySavedNodeOptions) }));
    };
    ContactMapComponent.defaultProps = {
        addHoveredResidues: helper_1.EMPTY_FUNCTION,
        addHoveredSecondaryStructure: helper_1.EMPTY_FUNCTION,
        addSelectedSecondaryStructure: helper_1.EMPTY_FUNCTION,
        configurations: new Array(),
        data: {
            couplingScores: new data_1.CouplingContainer(),
            pdbData: { experimental: undefined, predicted: undefined },
            secondaryStructures: new Array(),
        },
        enableSliders: true,
        formattedPoints: new Array(),
        height: '100%',
        highlightColor: '#ff8800',
        hoveredResidues: [],
        hoveredSecondaryStructures: [],
        isDataLoading: false,
        lockedResiduePairs: {},
        observedColor: '#0000ff',
        removeAllLockedResiduePairs: helper_1.EMPTY_FUNCTION,
        removeAllSelectedSecondaryStructures: helper_1.EMPTY_FUNCTION,
        removeHoveredResidues: helper_1.EMPTY_FUNCTION,
        removeHoveredSecondaryStructure: helper_1.EMPTY_FUNCTION,
        removeSecondaryStructure: helper_1.EMPTY_FUNCTION,
        selectedSecondaryStructures: [],
        showConfigurations: true,
        toggleLockedResiduePair: helper_1.EMPTY_FUNCTION,
        width: '100%',
    };
    return ContactMapComponent;
}(React.Component));
exports.ContactMapComponent = ContactMapComponent;
//# sourceMappingURL=ContactMapComponent.js.map