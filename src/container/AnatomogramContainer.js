"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// tslint:disable-next-line:import-name
var anatomogram_1 = require("anatomogram");
var immutable_1 = require("immutable");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var action_1 = require("~bioblocks-viz~/action");
var component_1 = require("~bioblocks-viz~/component");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var reducer_1 = require("~bioblocks-viz~/reducer");
var selector_1 = require("~bioblocks-viz~/selector");
var AnatomogramContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(AnatomogramContainerClass, _super);
    function AnatomogramContainerClass(props) {
        var _this = _super.call(this, props) || this;
        _this.divRef = null;
        _this.onClick = function (ids) {
            // Anatomogram returns an array of strings for click events, but we only ever work with a single id.
            var id = ids[0];
            var _a = _this.props, addLabel = _a.onLabelAdd, removeLabel = _a.onLabelRemove, selectIds = _a.selectIds;
            if (selectIds.includes(id)) {
                removeLabel(id);
            }
            else {
                addLabel(id);
            }
        };
        _this.deriveIdsFromSpecies = function (species) { return Object.keys(data_1.AnatomogramMapping[species]); };
        _this.onMouseOut = function (id) {
            return;
        };
        _this.onMouseOver = function (id) {
            return;
        };
        _this.parseCategory = function (category) {
            var splitCategories = category.split(/-|_/);
            return splitCategories[0];
        };
        _this.resizeSVGElement = function (error, svgDomNode) {
            if (_this.divRef) {
                var isSvgHeightBigger = svgDomNode.height.baseVal.value > svgDomNode.width.baseVal.value;
                // The Anatomogram Component internally sets the svg height to 'auto'.
                // So, to allow more flexibility in sizing it, we have to manually override it here. Sorry.
                svgDomNode.style.height = isSvgHeightBigger ? "calc(" + _this.divRef.style.height + " - 50px)" : 'auto';
                svgDomNode.style.padding = '0';
                svgDomNode.style.width = isSvgHeightBigger ? 'auto' : "calc(" + _this.divRef.style.width + " - 75px)";
            }
        };
        _this.state = {
            ids: _this.deriveIdsFromSpecies(props.species),
        };
        return _this;
    }
    AnatomogramContainerClass.prototype.setupDataServices = function () {
        this.registerDataset('cells', []);
        this.registerDataset('labels', []);
        reducer_1.BioblocksMiddlewareTransformer.addTransform(this.getCellToLabelTransform());
        reducer_1.BioblocksMiddlewareTransformer.addTransform(this.getLabelToCellTransform());
    };
    AnatomogramContainerClass.prototype.componentDidUpdate = function (prevProps) {
        var species = this.props.species;
        if (species !== prevProps.species) {
            this.setState({
                ids: this.deriveIdsFromSpecies(species),
            });
        }
    };
    AnatomogramContainerClass.prototype.render = function () {
        var _this = this;
        var _a = this.props, iconSrc = _a.iconSrc, species = _a.species, selectIds = _a.selectIds;
        var ids = this.state.ids;
        return (React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
            React.createElement("div", { className: 'anatomogram-container', ref: function (node) {
                    if (node) {
                        _this.divRef = node.getElementsByTagName('div')[0];
                    }
                } },
                React.createElement(component_1.ComponentCard, { componentName: 'Anatomogram', iconSrc: iconSrc },
                    React.createElement(anatomogram_1.default, { atlasUrl: "", highlightColour: 'yellow', onClick: this.onClick, onInjected: this.resizeSVGElement, onMouseOut: this.onMouseOut, onMouseOver: this.onMouseOver, selectColour: 'ffaa00', selectIds: selectIds.toArray(), showIds: ids, species: species, selectedView: species === 'mus_musculus' ? 'female' : 'male' })))));
    };
    AnatomogramContainerClass.prototype.getCellToLabelTransform = function () {
        var _this = this;
        return {
            fn: function (state) {
                var e_1, _a, e_2, _b, e_3, _c;
                var species = _this.props.species;
                var currentCells = selector_1.selectCurrentItems(state, 'cells').toArray();
                var _d = selector_1.getSpring(state), category = _d.category, graphData = _d.graphData;
                var result = immutable_1.Set();
                try {
                    for (var currentCells_1 = tslib_1.__values(currentCells), currentCells_1_1 = currentCells_1.next(); !currentCells_1_1.done; currentCells_1_1 = currentCells_1.next()) {
                        var cellIndex = currentCells_1_1.value;
                        // Parse labels and categories from SPRING data.
                        var labelForCategory = graphData.nodes[cellIndex] ? graphData.nodes[cellIndex].labelForCategory : {};
                        var labels = data_1.AnatomogramMapping[species][labelForCategory[category]];
                        if (labels) {
                            labels.forEach(function (label) { return (result = result.add(label)); });
                        }
                        try {
                            for (var _e = (e_2 = void 0, tslib_1.__values(Object.keys(data_1.AnatomogramMapping[species]))), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var id = _f.value;
                                try {
                                    for (var _g = (e_3 = void 0, tslib_1.__values(Object.values(labelForCategory))), _h = _g.next(); !_h.done; _h = _g.next()) {
                                        var label = _h.value;
                                        if (data_1.AnatomogramMapping[species][id].includes(label)) {
                                            result = result.add(id);
                                        }
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (currentCells_1_1 && !currentCells_1_1.done && (_a = currentCells_1.return)) _a.call(currentCells_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return result;
            },
            fromState: { stateName: 'cells' },
            toState: { stateName: 'labels' },
        };
    };
    AnatomogramContainerClass.prototype.getLabelToCellTransform = function () {
        var _this = this;
        return {
            fn: function (state) {
                var _a = _this.props, species = _a.species, selectIds = _a.selectIds;
                var graphData = selector_1.getSpring(state).graphData;
                var anatomogramMap = data_1.AnatomogramMapping[species];
                var candidateLabels = immutable_1.Set();
                selectIds.forEach(function (id) {
                    candidateLabels = id && anatomogramMap[id] ? candidateLabels.merge(anatomogramMap[id]) : candidateLabels;
                });
                var cellIndices = immutable_1.Set();
                graphData.nodes.forEach(function (node) {
                    var labelsForNode = Object.values(node.labelForCategory);
                    candidateLabels.forEach(function (label) {
                        if (label && labelsForNode.includes(label)) {
                            cellIndices = cellIndices.add(node.number);
                            return;
                        }
                    });
                });
                return cellIndices;
            },
            fromState: 'bioblocks/labels',
            toState: 'bioblocks/cells',
        };
    };
    AnatomogramContainerClass.defaultProps = {
        iconSrc: '',
        onLabelAdd: helper_1.EMPTY_FUNCTION,
        onLabelRemove: helper_1.EMPTY_FUNCTION,
        selectIds: immutable_1.Set(),
        species: 'homo_sapiens',
    };
    AnatomogramContainerClass.displayName = 'Anatomogram';
    return AnatomogramContainerClass;
}(container_1.BioblocksVisualization));
exports.AnatomogramContainerClass = AnatomogramContainerClass;
var mapStateToProps = function (state) { return ({
    selectIds: selector_1.selectCurrentItems(state, 'labels'),
}); };
var mapDispatchToProps = function (dispatch) {
    return redux_1.bindActionCreators({
        onLabelAdd: action_1.createContainerActions('labels').add,
        onLabelRemove: action_1.createContainerActions('labels').remove,
    }, dispatch);
};
exports.AnatomogramContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(AnatomogramContainerClass);
//# sourceMappingURL=AnatomogramContainer.js.map