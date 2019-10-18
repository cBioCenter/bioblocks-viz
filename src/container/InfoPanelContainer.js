"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var react_redux_1 = require("react-redux");
var semantic_ui_react_1 = require("semantic-ui-react");
var data_1 = require("~bioblocks-viz~/data");
var selector_1 = require("~bioblocks-viz~/selector");
var InfoPanelContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(InfoPanelContainerClass, _super);
    function InfoPanelContainerClass(props) {
        return _super.call(this, props) || this;
    }
    InfoPanelContainerClass.prototype.render = function () {
        var _this = this;
        var _a = this.props, data = _a.data, height = _a.height, lockedResiduePairs = _a.lockedResiduePairs, selectedSecondaryStructures = _a.selectedSecondaryStructures, width = _a.width;
        var pdbData = data.pdbData;
        var unassignedResidues = pdbData && pdbData.experimental
            ? this.renderUnassignedResidues(pdbData.experimental)
            : [React.createElement(semantic_ui_react_1.Label, { key: 'unassigned-residues-none' })];
        return (React.createElement("div", { className: "InfoPanel", style: { height: height, width: width } },
            React.createElement(semantic_ui_react_1.Accordion, { exclusive: false, panels: [
                    pdbData &&
                        pdbData.experimental &&
                        pdbData.experimental.secondaryStructureSections.map(function (secondaryStructure) { return ({
                            content: _this.renderSecondaryStructures(secondaryStructure),
                            key: 'all-secondary-structures',
                            title: "All Secondary Structures (" + (pdbData.experimental ? pdbData.experimental.secondaryStructureSections.length : 0) + "):",
                        }); }),
                    {
                        content: unassignedResidues,
                        key: 'unassigned-residues',
                        title: "Unassigned Residues (" + unassignedResidues.length + "):",
                    },
                    {
                        content: this.renderSecondaryStructures(selectedSecondaryStructures),
                        key: 'selected-secondary-structures',
                        title: "Selected Secondary Structures (" + selectedSecondaryStructures.length + "):",
                    },
                    {
                        content: this.renderLockedResiduePairs(lockedResiduePairs),
                        key: 'selected-residue-pairs',
                        title: "Selected Residue Pairs (" + lockedResiduePairs.size + "):",
                    },
                ] })));
    };
    InfoPanelContainerClass.prototype.renderLockedResiduePairs = function (lockedResiduePairs) {
        return Object.keys(lockedResiduePairs).length === 0
            ? [React.createElement(semantic_ui_react_1.Label, { key: 'locked-residue-pair-none' }, "None")]
            : Array.from(Object.values(lockedResiduePairs)).map(function (pair, index) { return (React.createElement(semantic_ui_react_1.Label, { key: "locked-residue-pair-" + index }, pair.join(', '))); });
    };
    InfoPanelContainerClass.prototype.renderSecondaryStructures = function (selectedSecondaryStructures) {
        return selectedSecondaryStructures.length === 0
            ? [React.createElement(semantic_ui_react_1.Label, { key: 'sec-struct-none' }, "None")]
            : selectedSecondaryStructures.map(function (section, index) { return (React.createElement(semantic_ui_react_1.Label, { key: "sec-struct-" + index }, "[" + section.start + "-" + section.end + "]: " + section.label + " - " + data_1.SECONDARY_STRUCTURE_CODES[section.label])); });
    };
    InfoPanelContainerClass.prototype.renderUnassignedResidues = function (pdbData) {
        var result = new Array();
        pdbData.eachResidue(function (residue) {
            var e_1, _a, e_2, _b;
            if (residue.isProtein()) {
                var isUnassigned = true;
                try {
                    for (var _c = tslib_1.__values(pdbData.secondaryStructureSections), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var secondaryStructure = _d.value;
                        try {
                            for (var secondaryStructure_1 = (e_2 = void 0, tslib_1.__values(secondaryStructure)), secondaryStructure_1_1 = secondaryStructure_1.next(); !secondaryStructure_1_1.done; secondaryStructure_1_1 = secondaryStructure_1.next()) {
                                var section = secondaryStructure_1_1.value;
                                if (section.contains(residue.resno)) {
                                    isUnassigned = false;
                                    break;
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
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (isUnassigned) {
                    result.push(React.createElement(semantic_ui_react_1.Label, { key: "unassigned-residue-" + residue.resno }, "[" + residue.resno + ": isCg? " + residue.isCg() + ",               isDna? " + residue.isDna() + ",               isHelix? " + residue.isHelix() + ",               isNucleic? " + residue.isNucleic() + ",               isProtein? " + residue.isProtein() + ",               isPolymer? " + residue.isPolymer() + ",               isSaccharide? " + residue.isSaccharide() + ",               isSheet? " + residue.isSheet() + ",              isTurn? " + residue.isTurn(),
                        "}"));
                }
            }
        });
        return result;
    };
    InfoPanelContainerClass.defaultProps = {
        data: {
            couplingScores: new data_1.CouplingContainer(),
            pdbData: {},
            secondaryStructures: new Array(),
        },
        height: 400,
        lockedResiduePairs: {},
        selectedSecondaryStructures: [],
        width: 400,
    };
    return InfoPanelContainerClass;
}(React.Component));
exports.InfoPanelContainerClass = InfoPanelContainerClass;
var mapStateToProps = function (state) { return ({
    lockedResiduePairs: selector_1.getLocked(state).toJS(),
    selectedSecondaryStructures: selector_1.selectCurrentItems(state, 'secondaryStructure/selected').toArray(),
}); };
exports.InfoPanelContainer = react_redux_1.connect(mapStateToProps)(InfoPanelContainerClass);
//# sourceMappingURL=InfoPanelContainer.js.map