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
var CellContext_1 = require("../context/CellContext");
var ResContext = require("../context/ResidueContext");
exports.initialState = {
    cellContext: __assign({}, CellContext_1.initialCellContext),
    residueContext: __assign({}, ResContext.initialResidueContext),
};
var ChellContext = /** @class */ (function (_super) {
    __extends(ChellContext, _super);
    function ChellContext(props) {
        var _this = _super.call(this, props) || this;
        _this.state = exports.initialState;
        _this.onAddCells = function (cells) {
            _this.setState({
                cellContext: __assign({}, _this.state.cellContext, { currentCells: cells }),
            });
        };
        _this.onRemoveAllCells = function () {
            _this.setState({
                cellContext: __assign({}, _this.state.cellContext, { currentCells: [] }),
            });
        };
        _this.onRemoveCells = function (cellsToRemove) {
            var currentCells = _this.state.cellContext.currentCells;
            _this.setState({
                cellContext: __assign({}, _this.state.cellContext, { currentCells: currentCells.filter(function (cell) { return cellsToRemove.indexOf(cell) === -1; }) }),
            });
        };
        _this.onAddCandidateResidues = function (candidateResidues) {
            _this.setState({
                residueContext: __assign({}, _this.state.residueContext, { candidateResidues: candidateResidues.sort() }),
            });
        };
        _this.onAddHoveredResidues = function (hoveredResidues) {
            _this.setState({
                residueContext: __assign({}, _this.state.residueContext, { hoveredResidues: hoveredResidues.sort() }),
            });
        };
        _this.onRemoveAllResidues = function () {
            _this.setState({
                residueContext: __assign({}, _this.state.residueContext, { lockedResiduePairs: {} }),
            });
        };
        _this.onRemoveCandidateResidue = function () {
            _this.setState({
                residueContext: __assign({}, _this.state.residueContext, { candidateResidues: [] }),
            });
        };
        _this.onRemoveHoveredResidue = function () {
            _this.setState({
                residueContext: __assign({}, _this.state.residueContext, { hoveredResidues: [] }),
            });
        };
        _this.onRemoveResidues = function (residues) {
            var residueKey = residues.join(',');
            var lockedResiduePairs = _this.state.residueContext.lockedResiduePairs;
            if (lockedResiduePairs[residueKey]) {
                delete lockedResiduePairs[residueKey];
            }
        };
        _this.onResidueSelect = function (residues) {
            var lockedResiduePairs = _this.state.residueContext.lockedResiduePairs;
            var sortedResidues = residues.sort();
            var residuePairKey = sortedResidues.toString();
            if (!lockedResiduePairs[residuePairKey]) {
                _this.setState({
                    residueContext: __assign({}, _this.state.residueContext, { lockedResiduePairs: __assign({}, lockedResiduePairs, (_a = {}, _a[residuePairKey] = sortedResidues, _a)) }),
                });
            }
            var _a;
        };
        _this.state = __assign({}, _this.state, { cellContext: __assign({}, _this.state.cellContext, { addCells: _this.onAddCells, removeAllCells: _this.onRemoveAllCells, removeCells: _this.onRemoveCells }), residueContext: __assign({}, _this.state.residueContext, { addCandidateResidues: _this.onAddCandidateResidues, addHoveredResidues: _this.onAddHoveredResidues, addLockedResiduePair: _this.onResidueSelect, removeAllLockedResiduePairs: _this.onRemoveAllResidues, removeCandidateResidues: _this.onRemoveCandidateResidue, removeHoveredResidues: _this.onRemoveHoveredResidue, removeLockedResiduePair: _this.onRemoveResidues }) });
        return _this;
    }
    ChellContext.prototype.render = function () {
        return (React.createElement(CellContext_1.CellContext.Provider, { value: this.state.cellContext },
            React.createElement(ResContext.ResidueContext.Provider, { value: this.state.residueContext }, this.props.children)));
    };
    return ChellContext;
}(React.Component));
exports.ChellContext = ChellContext;
