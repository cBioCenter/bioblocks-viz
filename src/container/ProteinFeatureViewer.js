"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
exports.SAMPLE_PROTEIN_IDS = {
    '3Domains': 'Q8TDF5',
    '5Domains': 'Q96L73',
    DLL3_HUMAN: 'Q9NYJ7',
    SMAD4_HUMAN: 'Q13485',
};
var ProteinFeatureViewer = /** @class */ (function (_super) {
    tslib_1.__extends(ProteinFeatureViewer, _super);
    function ProteinFeatureViewer(props) {
        var _this = _super.call(this, props) || this;
        _this.getPFamFamilyLink = function (pFamRef) {
            return "<a href=\"http://pfam.xfam.org/family/" + pFamRef.id + "\">PFAM</a>";
        };
        _this.getPFamDomainLink = function (pFamRef) {
            return "<a href=\"http://mutationaligner.org/domains/" + pFamRef.id + "\">Mutagen Aligner</a>";
        };
        _this.getPFamLinks = function (pFamIds) {
            return _this.getPFamFamilyLink(pFamIds[0]) + " " + _this.getPFamDomainLink(pFamIds[0]);
        };
        _this.initializeProteinData = function (protein) {
            var domains = protein.features.filter(function (feature) { return feature.type === 'DOMAIN'; });
            var colorMapper = new helper_1.ColorMapper();
            var domainData = domains.map(function (domain, index) {
                var begin = domain.begin, _a = domain.description, description = _a === void 0 ? '' : _a, end = domain.end;
                // This matches domains that do and do not have other of the same domain in the protein.
                var domainName = description.split('-like')[0];
                return new data_1.TintedBioblocks1DSection(domainName, begin ? Number.parseInt(begin, 10) : -1, end ? Number.parseInt(end, 10) : -1, colorMapper.getColorFor(domainName));
            });
            _this.setState({
                domainData: domainData,
                protein: protein,
            });
        };
        _this.onProteinInputChange = function (event, data) {
            _this.setState({
                proteinId: data.value,
            });
        };
        _this.onProteinInputSubmit = function (event, data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deriveProteinData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onShowGroupedChange = function (event, data) {
            _this.setState({
                showGrouped: data.checked !== undefined ? data.checked : _this.state.showGrouped,
            });
        };
        _this.renderAnnotationText = function (proteinId, index) {
            var _a = _this.state, domainData = _a.domainData, protein = _a.protein;
            var pFamIds = protein
                ? protein.dbReferences
                    .filter(function (dbRef) { return dbRef.type === 'Pfam'; })
                    .filter(function (pFamRef) {
                    var properties = pFamRef.properties;
                    var entryName = properties ? properties['entry name'] : null;
                    return entryName && (entryName === proteinId || entryName.localeCompare(proteinId + "-like " + index));
                })
                : [];
            return pFamIds.length >= 1
                ? proteinId + ": " + proteinId + " domain (" + domainData[index].start + " - " + domainData[index].end + ")<br />" + _this.getPFamLinks(pFamIds)
                : '';
        };
        _this.renderProteinForm = function (proteinId) { return (React.createElement(semantic_ui_react_1.Form, { onSubmit: _this.onProteinInputSubmit },
            React.createElement(semantic_ui_react_1.Form.Input, { onChange: _this.onProteinInputChange, value: proteinId, fluid: false, width: 'three' }),
            React.createElement(semantic_ui_react_1.Form.Button, null, "Submit Protein ID"),
            React.createElement(semantic_ui_react_1.Form.Checkbox, { defaultChecked: true, label: 'Show grouped?', onChange: _this.onShowGroupedChange }))); };
        _this.state = {
            data: [],
            domainData: [],
            proteinId: props.initialProteinId,
            showGrouped: true,
        };
        return _this;
    }
    ProteinFeatureViewer.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deriveProteinData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProteinFeatureViewer.prototype.render = function () {
        var _a = this.state, domainData = _a.domainData, protein = _a.protein, proteinId = _a.proteinId, showGrouped = _a.showGrouped;
        return (React.createElement("div", { className: 'protein-feature-viewer' },
            React.createElement(semantic_ui_react_1.GridRow, { centered: true, stretched: false },
                React.createElement(semantic_ui_react_1.GridColumn, null,
                    React.createElement(component_1.FeatureViewer, { data: domainData, getTextForHover: this.renderAnnotationText, title: protein ? protein.id : '', showGrouped: showGrouped })),
                React.createElement(semantic_ui_react_1.GridColumn, null, this.renderProteinForm(proteinId)))));
    };
    ProteinFeatureViewer.prototype.deriveProteinData = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, protein, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch("https://www.ebi.ac.uk/proteins/api/proteins/" + this.state.proteinId)];
                    case 1:
                        result = _a.sent();
                        if (!(result && result.ok)) return [3 /*break*/, 3];
                        return [4 /*yield*/, result.json()];
                    case 2:
                        protein = (_a.sent());
                        this.initializeProteinData(protein);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProteinFeatureViewer.defaultProps = {
        initialProteinId: exports.SAMPLE_PROTEIN_IDS.DLL3_HUMAN,
    };
    return ProteinFeatureViewer;
}(React.Component));
exports.ProteinFeatureViewer = ProteinFeatureViewer;
//# sourceMappingURL=ProteinFeatureViewer.js.map