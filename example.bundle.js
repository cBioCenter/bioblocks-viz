(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["example"],{

/***/ "./examples/example.tsx":
/*!******************************!*\
  !*** ./examples/example.tsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var ReactDOM = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
var semantic_ui_react_1 = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
var _chell_viz_1 = __webpack_require__(/*! ~chell-viz~ */ "./src/index.ts");
var ExampleApp = /** @class */ (function (_super) {
    __extends(ExampleApp, _super);
    function ExampleApp(props) {
        var _this = _super.call(this, props) || this;
        _this.renderCouplingComponents = function (_a, _b) {
            var style = (_a === void 0 ? _this.props : _a).style;
            var _c = _b === void 0 ? _this
                .state : _b, arePredictionsAvailable = _c.arePredictionsAvailable, couplingScores = _c.couplingScores, errorMsg = _c.errorMsg, isResidueMappingNeeded = _c.isResidueMappingNeeded, measuredProximity = _c.measuredProximity, pdbData = _c.pdbData;
            return (React.createElement("div", null,
                React.createElement(semantic_ui_react_1.Header, { as: 'h1', attached: 'top' }, "ContactMap.org: 2D and 3D Visualization"),
                errorMsg.length > 1 && _this.renderErrorMessage(),
                !pdbData && couplingScores.length === 0 && _this.renderStartMessage(),
                React.createElement(semantic_ui_react_1.Segment, { attached: true, raised: true },
                    React.createElement(_chell_viz_1.CouplingContextProvider, null,
                        React.createElement(_chell_viz_1.SecondaryStructureContextConsumer, null, function (secondaryStructureContext) { return (React.createElement(_chell_viz_1.ResidueContextConsumer, null, function (residueContext) { return (React.createElement(semantic_ui_react_1.Grid, { centered: true },
                            _this.renderUploadButtonsRow(isResidueMappingNeeded, residueContext, secondaryStructureContext),
                            _this.renderChellComponents(style, arePredictionsAvailable, measuredProximity, pdbData))); })); }))),
                _this.renderFooter()));
        };
        _this.renderErrorMessage = function (_a) {
            var _b = _a === void 0 ? _this.state : _a, errorMsg = _b.errorMsg, isResidueMappingNeeded = _b.isResidueMappingNeeded, mismatches = _b.mismatches, pdbData = _b.pdbData;
            return (React.createElement(semantic_ui_react_1.Message, { warning: true }, isResidueMappingNeeded && pdbData ? (React.createElement("div", null,
                React.createElement(semantic_ui_react_1.Message.Header, null, "Residue numbering mismatch detected. Please upload a file to correct the position numbering differences.",
                    React.createElement("br", null), "EVCouplings and EVFold outputs this file in the ",
                    React.createElement("strong", null, "OUTPUT"), " directory.\n                This file might be named similar to\n                '" + pdbData.name + ".csv' or '" + pdbData.name + ".indextableplus'"),
                React.createElement(semantic_ui_react_1.Message.List, null, errorMsg),
                React.createElement(semantic_ui_react_1.Message.Content, null,
                    React.createElement(semantic_ui_react_1.Accordion, { fluid: true, exclusive: false, defaultActiveIndex: [], panels: [
                            _this.renderSequenceAccordionMessage('PDB sequence', pdbData.sequence, mismatches),
                            _this.renderSequenceAccordionMessage('Couplings Score sequence', _this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].couplingScores.sequence, mismatches),
                        ] })))) : (errorMsg)));
        };
        _this.renderFooter = function () {
            var chell = React.createElement("a", { href: "https://github.com/cBioCenter/chell-viz" }, "Chell");
            // prettier-ignore
            var sayings = [
                React.createElement(React.Fragment, null,
                    "Powered by ",
                    chell,
                    "!"),
                React.createElement(React.Fragment, null,
                    "They love me at the ",
                    chell,
                    "sea."),
                React.createElement(React.Fragment, null,
                    "Today's visualization has been brought to you by ",
                    chell,
                    "."),
                React.createElement(React.Fragment, null,
                    chell,
                    "sea, ",
                    chell,
                    "sea, I believe..."),
                React.createElement(React.Fragment, null,
                    "Now you're thinking with ",
                    chell,
                    "!"),
                React.createElement(React.Fragment, null,
                    "And ",
                    chell,
                    "sea says she's got nowhere to go..."),
            ].map(function (saying) { return React.createElement(React.Fragment, { key: 'random-chell-saying' }, saying); });
            // tslint:disable-next-line:insecure-random
            var randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
            return React.createElement("footer", { style: { padding: '25vh 0 25px 25px' } }, randomSaying);
        };
        _this.renderSequenceAccordionMessage = function (title, sequence, mismatches) {
            var e_1, _a;
            var startIndex = 0;
            var result = new Array();
            try {
                for (var mismatches_1 = __values(mismatches), mismatches_1_1 = mismatches_1.next(); !mismatches_1_1.done; mismatches_1_1 = mismatches_1.next()) {
                    var mismatch = mismatches_1_1.value;
                    result.push(React.createElement(React.Fragment, { key: "mismatch-" + mismatch.resno },
                        React.createElement("span", { style: { color: 'black', fontSize: '12px' } }, sequence.substr(startIndex, mismatch.resno)),
                        React.createElement("span", { style: { color: 'red', fontSize: '16px', textDecoration: 'underline' } }, sequence.charAt(mismatch.resno))));
                    startIndex = mismatch.resno + 2;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (mismatches_1_1 && !mismatches_1_1.done && (_a = mismatches_1.return)) _a.call(mismatches_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            result.push(React.createElement("span", { key: 'mismatch-final', style: { color: 'black', fontSize: '12px' } }, sequence.substr(startIndex)));
            return {
                content: {
                    content: React.createElement("p", { style: { width: '80%', wordBreak: 'break-word' } }, result),
                },
                key: "panel-" + title,
                title: {
                    content: title + " (" + sequence.length + " Amino Acids)",
                },
            };
        };
        _this.renderStartMessage = function () { return (React.createElement(semantic_ui_react_1.Message, null, "To get started, please upload either a PDB (.pdb) or EVCouplings score (.csv) file!",
            " ",
            React.createElement("br", null),
            " Check out the",
            React.createElement("a", { href: "http://evfold.org" }, " EVFold"),
            ", ",
            React.createElement("a", { href: "http://sanderlab.org/contact-maps/" }, "Sander Lab"),
            ", or",
            React.createElement("a", { href: "https://evcouplings.org/" }, " EVCouplings "),
            " website to get these files.")); };
        _this.renderUploadForm = function (onChange, id, content, disabled, accepts) {
            if (accepts === void 0) { accepts = []; }
            return (React.createElement(semantic_ui_react_1.GridColumn, null,
                React.createElement(semantic_ui_react_1.Label, { as: "label", basic: true, htmlFor: id },
                    React.createElement(semantic_ui_react_1.Button, { disabled: disabled, icon: 'upload', label: {
                            basic: true,
                            content: content,
                        }, labelPosition: 'right' }),
                    React.createElement("input", { accept: "." + accepts.join(',.'), disabled: disabled, id: id, onChange: onChange, hidden: true, type: 'file', required: true, multiple: false }))));
        };
        _this.renderUploadLabel = function (label) {
            return label ? (React.createElement(semantic_ui_react_1.GridColumn, { verticalAlign: 'middle', textAlign: 'justified' },
                React.createElement(semantic_ui_react_1.Label, null, label))) : null;
        };
        _this.renderCouplingScoresUploadForm = function (_a) {
            var _b = _a === void 0 ? _this.state : _a, couplingScores = _b.couplingScores, filenames = _b.filenames;
            return (React.createElement(semantic_ui_react_1.GridRow, null,
                _this.renderUploadLabel(filenames.couplings),
                _this.renderUploadForm(_this.onCouplingScoreUpload, 'coupling-score', 'Coupling Scores', couplingScores.length > 0, ['csv'])));
        };
        _this.renderChellComponents = function (style, arePredictionsAvailable, measuredProximity, pdbData, size) {
            if (size === void 0) { size = '550px'; }
            return (React.createElement(semantic_ui_react_1.GridRow, { verticalAlign: 'middle' },
                React.createElement(semantic_ui_react_1.GridColumn, { width: 6 }, _this.renderContactMapCard(arePredictionsAvailable, size, style, pdbData)),
                React.createElement(semantic_ui_react_1.GridColumn, { width: 6 }, _this.renderNGLCard(measuredProximity, size, style))));
        };
        _this.renderNGLCard = function (measuredProximity, size, style) { return (React.createElement(semantic_ui_react_1.Card, { raised: true, style: { height: '615px', padding: '15px 15px 0 15px', width: '600px' } },
            React.createElement(_chell_viz_1.NGLComponent, { data: _this.state[_chell_viz_1.VIZ_TYPE.NGL].pdbData, height: size, isDataLoading: _this.state[_chell_viz_1.VIZ_TYPE.NGL].isLoading, measuredProximity: measuredProximity, onMeasuredProximityChange: _this.onMeasuredProximityChange(), style: style, width: size }))); };
        _this.renderContactMapCard = function (arePredictionsAvailable, size, style, pdbData) { return (React.createElement(semantic_ui_react_1.Card, { raised: true, style: { height: '615px', padding: '15px 15px 0 15px', width: '600px' } }, arePredictionsAvailable ? (React.createElement(_chell_viz_1.PredictedContactMap, { data: {
                couplingScores: _this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].couplingScores,
                pdbData: pdbData,
                secondaryStructures: _this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].secondaryStructures,
            }, height: size, isDataLoading: _this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].isLoading, style: style, width: size })) : (React.createElement(_chell_viz_1.ContactMap, { data: {
                couplingScores: _this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].couplingScores,
                pdbData: pdbData,
                secondaryStructures: _this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].secondaryStructures,
            }, height: size, isDataLoading: _this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].isLoading, style: style, width: size })))); };
        _this.renderUploadButtonsRow = function (isResidueMappingNeeded, residueContext, secondaryStructureContext) { return (React.createElement(semantic_ui_react_1.GridRow, { columns: 4, centered: true, textAlign: 'center', verticalAlign: 'bottom' },
            React.createElement(semantic_ui_react_1.GridColumn, null, _this.renderCouplingScoresUploadForm()),
            React.createElement(semantic_ui_react_1.GridColumn, null, _this.renderPDBUploadForm()),
            isResidueMappingNeeded && React.createElement(semantic_ui_react_1.GridColumn, null, _this.renderResidueMappingUploadForm()),
            React.createElement(semantic_ui_react_1.GridColumn, null, _this.renderClearAllButton(residueContext, secondaryStructureContext)))); };
        _this.renderPDBUploadForm = function (_a) {
            var _b = _a === void 0 ? _this.state : _a, filenames = _b.filenames, pdbData = _b.pdbData;
            return (React.createElement(semantic_ui_react_1.GridRow, null,
                _this.renderUploadLabel(filenames.pdb),
                _this.renderUploadForm(_this.onPDBUpload, 'pdb', 'PDB', pdbData !== undefined, ['pdb'])));
        };
        _this.renderResidueMappingUploadForm = function (_a) {
            var filenames = (_a === void 0 ? _this.state : _a).filenames;
            return (React.createElement(semantic_ui_react_1.GridRow, { verticalAlign: 'middle', columns: 1, centered: true },
                _this.renderUploadLabel(filenames.residue_mapper),
                _this.renderUploadForm(_this.onResidueMappingUpload, 'residue-mapping', 'Residue Mapping', false, [
                    'csv',
                    'indextable',
                    'indextableplus',
                ])));
        };
        _this.renderClearAllButton = function (residueContext, secondaryStructureContext) { return (React.createElement(semantic_ui_react_1.GridRow, { verticalAlign: 'middle', columns: 1, centered: true },
            React.createElement(semantic_ui_react_1.GridColumn, null,
                React.createElement(semantic_ui_react_1.Label, { as: "label", basic: true, htmlFor: 'clear-data' },
                    React.createElement(semantic_ui_react_1.Button, { icon: 'trash', label: {
                            basic: true,
                            content: 'Clean View',
                        }, labelPosition: 'right', onClick: _this.onClearAll(residueContext, secondaryStructureContext) }))))); };
        _this.onClearAll = function (residueContext, secondaryStructureContext) { return function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.setState(ExampleApp.initialState);
                residueContext.clearAllResidues();
                secondaryStructureContext.clearAllSecondaryStructures();
                this.forceUpdate();
                return [2 /*return*/];
            });
        }); }; };
        _this.onCouplingScoreUpload = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, measuredProximity, pdbData, files, file, parsedFile, couplingScores, mismatches, isResidueMappingNeeded, e_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        e.persist();
                        _c = this.state, measuredProximity = _c.measuredProximity, pdbData = _c.pdbData;
                        files = e.target.files;
                        file = files ? files.item(0) : null;
                        if (!(file !== null)) return [3 /*break*/, 6];
                        if (!file.name.endsWith('.csv')) return [3 /*break*/, 5];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        this.setState((_a = {},
                            _a[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = __assign({}, this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP], { isLoading: true }),
                            _a));
                        return [4 /*yield*/, _chell_viz_1.readFileAsText(file)];
                    case 2:
                        parsedFile = _d.sent();
                        couplingScores = _chell_viz_1.getCouplingScoresData(parsedFile, this.state.residueMapping);
                        mismatches = pdbData ? pdbData.getResidueNumberingMismatches(couplingScores) : [];
                        isResidueMappingNeeded = mismatches.length > 0;
                        this.setState((_b = {},
                            _b[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = {
                                couplingScores: pdbData
                                    ? pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity)
                                    : couplingScores,
                                isLoading: false,
                                pdbData: this.state.pdbData,
                                secondaryStructures: [],
                            },
                            _b.arePredictionsAvailable = true,
                            _b.couplingScores = parsedFile,
                            _b.errorMsg = '',
                            _b.filenames = __assign({}, this.state.filenames, { couplings: file.name }),
                            _b.isResidueMappingNeeded = isResidueMappingNeeded,
                            _b));
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _d.sent();
                        console.log(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.setState({
                            errorMsg: "Unable to load Coupling Score file '" + file.name + "' - Make sure the file ends in '.csv'!",
                        });
                        _d.label = 6;
                    case 6:
                        // !IMPORTANT! Allows same user to clear data and then re-upload same file!
                        e.target.value = '';
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onPDBUpload = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, measuredProximity, files, file, pdbData, couplingScores;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        e.persist();
                        measuredProximity = this.state.measuredProximity;
                        files = e.target.files;
                        file = files ? files.item(0) : null;
                        if (!(file !== null)) return [3 /*break*/, 3];
                        if (!file.name.endsWith('.pdb')) return [3 /*break*/, 2];
                        this.setState((_a = {},
                            _a[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = __assign({}, this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP], { isLoading: true }),
                            _a[_chell_viz_1.VIZ_TYPE.NGL] = __assign({}, this.state[_chell_viz_1.VIZ_TYPE.NGL], { isLoading: true }),
                            _a));
                        return [4 /*yield*/, _chell_viz_1.ChellPDB.createPDB(file)];
                    case 1:
                        pdbData = _c.sent();
                        couplingScores = pdbData.amendPDBWithCouplingScores(this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].couplingScores.rankedContacts, measuredProximity);
                        this.setState((_b = {},
                            _b[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = {
                                couplingScores: couplingScores,
                                isLoading: false,
                                pdbData: pdbData,
                                secondaryStructures: pdbData.secondaryStructureSections,
                            },
                            _b[_chell_viz_1.VIZ_TYPE.NGL] = {
                                isLoading: false,
                                pdbData: pdbData.nglStructure,
                            },
                            _b.errorMsg = '',
                            _b.filenames = __assign({}, this.state.filenames, { pdb: file.name }),
                            _b.pdbData = pdbData,
                            _b));
                        return [3 /*break*/, 3];
                    case 2:
                        this.setState({
                            errorMsg: "Unable to load PDB file '" + file.name + "' - Make sure the file ends in '.pdb'!",
                        });
                        _c.label = 3;
                    case 3:
                        // !IMPORTANT! Allows same user to clear data and then re-upload same file!
                        e.target.value = '';
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onMeasuredProximityChange = function () { return function (value) {
            _this.setState({
                measuredProximity: Object.values(_chell_viz_1.CONTACT_DISTANCE_PROXIMITY)[value],
            });
        }; };
        _this.onResidueMappingUpload = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, measuredProximity, pdbData, files, file, validFileExtensions, isValidFile, parsedFile, residueMapping, couplingScores, e_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        e.persist();
                        _c = this.state, measuredProximity = _c.measuredProximity, pdbData = _c.pdbData;
                        files = e.target.files;
                        file = files ? files.item(0) : null;
                        validFileExtensions = ['csv', 'indextable', 'indextableplus'];
                        if (!(file !== null)) return [3 /*break*/, 6];
                        isValidFile = validFileExtensions.reduce(function (prev, ext) { return prev || file.name.endsWith("." + ext); }, false);
                        if (!isValidFile) return [3 /*break*/, 5];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        this.setState((_a = {},
                            _a[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = __assign({}, this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP], { isLoading: true }),
                            _a));
                        return [4 /*yield*/, _chell_viz_1.readFileAsText(file)];
                    case 2:
                        parsedFile = _d.sent();
                        residueMapping = _chell_viz_1.generateResidueMapping(parsedFile);
                        couplingScores = _chell_viz_1.getCouplingScoresData(this.state.couplingScores, residueMapping);
                        this.setState((_b = {},
                            _b[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = {
                                couplingScores: pdbData
                                    ? pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity)
                                    : couplingScores,
                                isLoading: false,
                                secondaryStructures: [],
                            },
                            _b.errorMsg = '',
                            _b.filenames = __assign({}, this.state.filenames, { residue_mapper: file.name }),
                            _b.residueMapping = residueMapping,
                            _b));
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _d.sent();
                        console.log(e_3);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.setState({
                            errorMsg: "Unable to load Residue Mapping file '" + file.name + "' - Make sure the file ends in one of the following: '" + validFileExtensions.join("', '") + "'",
                        });
                        _d.label = 6;
                    case 6:
                        // !IMPORTANT! Allows same user to clear data and then re-upload same file!
                        e.target.value = '';
                        return [2 /*return*/];
                }
            });
        }); };
        _this.state = ExampleApp.initialState;
        return _this;
    }
    ExampleApp.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a;
        var _b = this.state, measuredProximity = _b.measuredProximity, pdbData = _b.pdbData;
        var couplingScores = this.state[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].couplingScores;
        var errorMsg = '';
        var newMismatches = this.state.mismatches;
        var isResidueMappingNeeded = this.state.isResidueMappingNeeded;
        if (pdbData &&
            (couplingScores !== prevState[_chell_viz_1.VIZ_TYPE.CONTACT_MAP].couplingScores || pdbData !== prevState.pdbData)) {
            newMismatches = _chell_viz_1.getPDBAndCouplingMismatch(pdbData, couplingScores);
            if (newMismatches.length >= 1) {
                errorMsg = "Error details: " + newMismatches.length + " mismatch(es) detected between coupling scores and PDB!        For example, residue number " + newMismatches[0].resno + " is '" + newMismatches[0].secondAminoAcid.threeLetterCode + "' in the PDB but '" + newMismatches[0].firstAminoAcid.threeLetterCode + "' in the coupling scores file.";
                isResidueMappingNeeded = true;
            }
        }
        if (pdbData && measuredProximity !== prevState.measuredProximity) {
            this.setState((_a = {},
                _a[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = {
                    couplingScores: pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity),
                    isLoading: false,
                    pdbData: this.state.pdbData,
                    secondaryStructures: [],
                },
                _a.errorMsg = errorMsg,
                _a.isResidueMappingNeeded = isResidueMappingNeeded,
                _a.mismatches = newMismatches,
                _a));
        }
        else if (errorMsg.length >= 1) {
            this.setState({
                errorMsg: errorMsg,
                isResidueMappingNeeded: isResidueMappingNeeded,
                mismatches: newMismatches,
            });
        }
    };
    ExampleApp.prototype.render = function (_a) {
        var style = (_a === void 0 ? this.props : _a).style;
        return (React.createElement("div", { id: "ChellVizApp", style: __assign({}, style, { height: '1000px' }) },
            this.renderCouplingComponents(),
            React.createElement(_chell_viz_1.ProteinFeatureViewer, null)));
    };
    ExampleApp.defaultProps = {
        style: {
            backgroundColor: '#ffffff',
        },
    };
    ExampleApp.initialState = (_a = {},
        _a[_chell_viz_1.VIZ_TYPE.CONTACT_MAP] = {
            couplingScores: new _chell_viz_1.CouplingContainer(),
            isLoading: false,
            pdbData: undefined,
            secondaryStructures: [],
        },
        _a[_chell_viz_1.VIZ_TYPE.NGL] = {
            isLoading: false,
            pdbData: undefined,
        },
        _a.arePredictionsAvailable = false,
        _a.couplingScores = '',
        _a.errorMsg = '',
        _a.filenames = {},
        _a.isResidueMappingNeeded = false,
        _a.measuredProximity = _chell_viz_1.CONTACT_DISTANCE_PROXIMITY.CLOSEST,
        _a.mismatches = [],
        _a.pdbData = undefined,
        _a.residueMapping = [],
        _a);
    return ExampleApp;
}(React.Component));
ReactDOM.render(React.createElement(ExampleApp, null), document.getElementById('example-root'));
if (true) {
    module.hot.accept();
}


/***/ })

},[["./examples/example.tsx","runtime~example","vendors~app~beta~example","default~app~beta~example"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9leGFtcGxlcy9leGFtcGxlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOEVBQStCO0FBQy9CLHlGQUFzQztBQUN0Qyw0SEFBd0g7QUFFeEgsNEVBc0JxQjtBQTJCckI7SUFBeUIsOEJBQW1EO0lBNkIxRSxvQkFBbUIsS0FBdUI7UUFBMUMsWUFDRSxrQkFBTSxLQUFLLENBQUMsU0FFYjtRQXdEUyw4QkFBd0IsR0FBRyxVQUNuQyxFQUFzQixFQUN0QixFQUNRO2dCQUZOLGdEQUFLO2dCQUNQOzJCQUNRLEVBRE4sb0RBQXVCLEVBQUUsa0NBQWMsRUFBRSxzQkFBUSxFQUFFLGtEQUFzQixFQUFFLHdDQUFpQixFQUFFLG9CQUFPO1lBRXBHLFFBQ0g7Z0JBQ0Usb0JBQUMsMEJBQU0sSUFBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLDhDQUV4QjtnQkFDUixRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ2hELENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEtBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFFckUsb0JBQUMsMkJBQU8sSUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJO29CQUNuQyxvQkFBQyxvQ0FBdUI7d0JBQ3RCLG9CQUFDLDhDQUFpQyxRQUMvQixtQ0FBeUIsSUFBSSxRQUM1QixvQkFBQyxtQ0FBc0IsUUFDcEIsd0JBQWMsSUFBSSxRQUNqQixvQkFBQyx3QkFBSSxJQUFDLFFBQVEsRUFBRSxJQUFJOzRCQUNqQixLQUFJLENBQUMsc0JBQXNCLENBQUMsc0JBQXNCLEVBQUUsY0FBYyxFQUFFLHlCQUF5QixDQUFDOzRCQUM5RixLQUFJLENB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QWpqQndCLEtBQUssQ0FBQyxTQUFTLEdBaWpCdkM7QUFFRCxRQUFRLENBQUMsTUFBTSxDQUFDLG9CQUFDLFVBQVUsT0FBRyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUV6RSxJQUFJLElBQVUsRUFBRTtJQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7Q0FDckIiLCJmaWxlIjoiZXhhbXBsZS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgKiBhcyBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgQWNjb3JkaW9uLCBCdXR0b24sIENhcmQsIEdyaWQsIEdyaWRDb2x1bW4sIEdyaWRSb3csIEhlYWRlciwgTGFiZWwsIE1lc3NhZ2UsIFNlZ21lbnQgfSBmcm9tICdzZW1hbnRpYy11aS1yZWFjdCc7XG5cbmltcG9ydCB7XG4gIENoZWxsUERCLFxuICBDT05UQUNUX0RJU1RBTkNFX1BST1hJTUlUWSxcbiAgQ09OVEFDVF9NQVBfREFUQV9UWVBFLFxuICBDb250YWN0TWFwLFxuICBDb3VwbGluZ0NvbnRhaW5lcixcbiAgQ291cGxpbmdDb250ZXh0UHJvdmlkZXIsXG4gIGdlbmVyYXRlUmVzaWR1ZU1hcHBpbmcsXG4gIGdldENvdXBsaW5nU2NvcmVzRGF0YSxcbiAgZ2V0UERCQW5kQ291cGxpbmdNaXNtYXRjaCxcbiAgSVJlc2lkdWVDb250ZXh0LFxuICBJUmVzaWR1ZU1hcHBpbmcsXG4gIElSZXNpZHVlTWlzbWF0Y2hSZXN1bHQsXG4gIElTZWNvbmRhcnlTdHJ1Y3R1cmVDb250ZXh0LFxuICBOR0xfREFUQV9UWVBFLFxuICBOR0xDb21wb25lbnQsXG4gIFByZWRpY3RlZENvbnRhY3RNYXAsXG4gIFByb3RlaW5GZWF0dXJlVmlld2VyLFxuICByZWFkRmlsZUFzVGV4dCxcbiAgUmVzaWR1ZUNvbnRleHRDb25zdW1lcixcbiAgU2Vjb25kYXJ5U3RydWN0dXJlQ29udGV4dENvbnN1bWVyLFxuICBWSVpfVFlQRSxcbn0gZnJvbSAnfmNoZWxsLXZpen4nO1xuXG5leHBvcnQgaW50ZXJmYWNlIElFeGFtcGxlQXBwUHJvcHMge1xuICBzdHlsZTogUmVhY3QuQ1NTUHJvcGVydGllcztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRXhhbXBsZUFwcFN0YXRlIHtcbiAgW1ZJWl9UWVBFLkNPTlRBQ1RfTUFQXTogQ09OVEFDVF9NQVBfREFUQV9UWVBFICYgeyBpc0xvYWRpbmc6IGJvb2xlYW4gfTtcbiAgW1ZJWl9UWVBFLk5HTF06IHtcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gICAgcGRiRGF0YT86IE5HTF9EQVRBX1RZUEU7XG4gIH07XG4gIGFyZVByZWRpY3Rpb25zQXZhaWxhYmxlOiBib29sZWFuO1xuICBjb3VwbGluZ1Njb3Jlczogc3RyaW5nO1xuICBlcnJvck1zZzogc3RyaW5nO1xuICBmaWxlbmFtZXM6IFBhcnRpYWw8e1xuICAgIGNvdXBsaW5nczogc3RyaW5nO1xuICAgIHBkYjogc3RyaW5nO1xuICAgIHJlc2lkdWVfbWFwcGVyOiBzdHJpbmc7XG4gIH0+O1xuICBtZWFzdXJlZFByb3hpbWl0eTogQ09OVEFDVF9ESVNUQU5DRV9QUk9YSU1JVFk7XG4gIG1pc21hdGNoZXM6IElSZXNpZHVlTWlzbWF0Y2hSZXN1bHRbXTtcbiAgaXNSZXNpZHVlTWFwcGluZ05lZWRlZDogYm9vbGVhbjtcbiAgcGRiRGF0YT86IENoZWxsUERCO1xuICByZXNpZHVlTWFwcGluZzogSVJlc2lkdWVNYXBwaW5nW107XG59XG5cbmNsYXNzIEV4YW1wbGVBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8SUV4YW1wbGVBcHBQcm9wcywgSUV4YW1wbGVBcHBTdGF0ZT4ge1xuICBwdWJsaWMgc3RhdGljIGRlZmF1bHRQcm9wczogSUV4YW1wbGVBcHBQcm9wcyA9IHtcbiAgICBzdHlsZToge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgfSxcbiAgfTtcblxuICBwcm90ZWN0ZWQgc3RhdGljIGluaXRpYWxTdGF0ZTogSUV4YW1wbGVBcHBTdGF0ZSA9IHtcbiAgICBbVklaX1RZUEUuQ09OVEFDVF9NQVBdOiB7XG4gICAgICBjb3VwbGluZ1Njb3JlczogbmV3IENvdXBsaW5nQ29udGFpbmVyKCksXG4gICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgcGRiRGF0YTogdW5kZWZpbmVkLFxuICAgICAgc2Vjb25kYXJ5U3RydWN0dXJlczogW10sXG4gICAgfSxcbiAgICBbVklaX1RZUEUuTkdMXToge1xuICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIHBkYkRhdGE6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGFyZVByZWRpY3Rpb25zQXZhaWxhYmxlOiBmYWxzZSxcbiAgICBjb3VwbGluZ1Njb3JlczogJycsXG4gICAgZXJyb3JNc2c6ICcnLFxuICAgIGZpbGVuYW1lczoge30sXG4gICAgaXNSZXNpZHVlTWFwcGluZ05lZWRlZDogZmFsc2UsXG4gICAgbWVhc3VyZWRQcm94aW1pdHk6IENPTlRBQ1RfRElTVEFOQ0VfUFJPWElNSVRZLkNMT1NFU1QsXG4gICAgbWlzbWF0Y2hlczogW10sXG4gICAgcGRiRGF0YTogdW5kZWZpbmVkLFxuICAgIHJlc2lkdWVNYXBwaW5nOiBbXSxcbiAgfTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHJvcHM6IElFeGFtcGxlQXBwUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IEV4YW1wbGVBcHAuaW5pdGlhbFN0YXRlO1xuICB9XG5cbiAgcHVibGljIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHM6IElFeGFtcGxlQXBwUHJvcHMsIHByZXZTdGF0ZTogSUV4YW1wbGVBcHBTdGF0ZSkge1xuICAgIGNvbnN0IHsgbWVhc3VyZWRQcm94aW1pdHksIHBkYkRhdGEgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBjb3VwbGluZ1Njb3JlcyB9ID0gdGhpcy5zdGF0ZVtWSVpfVFlQRS5DT05UQUNUX01BUF07XG5cbiAgICBsZXQgZXJyb3JNc2cgPSAnJztcblxuICAgIGxldCBuZXdNaXNtYXRjaGVzID0gdGhpcy5zdGF0ZS5taXNtYXRjaGVzO1xuICAgIGxldCBpc1Jlc2lkdWVNYXBwaW5nTmVlZGVkID0gdGhpcy5zdGF0ZS5pc1Jlc2lkdWVNYXBwaW5nTmVlZGVkO1xuXG4gICAgaWYgKFxuICAgICAgcGRiRGF0YSAmJlxuICAgICAgKGNvdXBsaW5nU2NvcmVzICE9PSBwcmV2U3RhdGVbVklaX1RZUEUuQ09OVEFDVF9NQVBdLmNvdXBsaW5nU2NvcmVzIHx8IHBkYkRhdGEgIT09IHByZXZTdGF0ZS5wZGJEYXRhKVxuICAgICkge1xuICAgICAgbmV3TWlzbWF0Y2hlcyA9IGdldFBEQkFuZENvdXBsaW5nTWlzbWF0Y2gocGRiRGF0YSwgY291cGxpbmdTY29yZXMpO1xuXG4gICAgICBpZiAobmV3TWlzbWF0Y2hlcy5sZW5ndGggPj0gMSkge1xuICAgICAgICBlcnJvck1zZyA9IGBFcnJvciBkZXRhaWxzOiAke25ld01pc21hdGNoZXMubGVuZ3RofSBtaXNtYXRjaChlcykgZGV0ZWN0ZWQgYmV0d2VlbiBjb3VwbGluZyBzY29yZXMgYW5kIFBEQiFcXFxuICAgICAgICBGb3IgZXhhbXBsZSwgcmVzaWR1ZSBudW1iZXIgJHtuZXdNaXNtYXRjaGVzWzBdLnJlc25vfSBpcyAnJHtcbiAgICAgICAgICBuZXdNaXNtYXRjaGVzWzBdLnNlY29uZEFtaW5vQWNpZC50aHJlZUxldHRlckNvZGVcbiAgICAgICAgfScgaW4gdGhlIFBEQiBidXQgJyR7bmV3TWlzbWF0Y2hlc1swXS5maXJzdEFtaW5vQWNpZC50aHJlZUxldHRlckNvZGV9JyBpbiB0aGUgY291cGxpbmcgc2NvcmVzIGZpbGUuYDtcbiAgICAgICAgaXNSZXNpZHVlTWFwcGluZ05lZWRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBkYkRhdGEgJiYgbWVhc3VyZWRQcm94aW1pdHkgIT09IHByZXZTdGF0ZS5tZWFzdXJlZFByb3hpbWl0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIFtWSVpfVFlQRS5DT05UQUNUX01BUF06IHtcbiAgICAgICAgICBjb3VwbGluZ1Njb3JlczogcGRiRGF0YS5hbWVuZFBEQldpdGhDb3VwbGluZ1Njb3Jlcyhjb3VwbGluZ1Njb3Jlcy5yYW5rZWRDb250YWN0cywgbWVhc3VyZWRQcm94aW1pdHkpLFxuICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgcGRiRGF0YTogdGhpcy5zdGF0ZS5wZGJEYXRhLFxuICAgICAgICAgIHNlY29uZGFyeVN0cnVjdHVyZXM6IFtdLFxuICAgICAgICB9LFxuICAgICAgICBlcnJvck1zZyxcbiAgICAgICAgaXNSZXNpZHVlTWFwcGluZ05lZWRlZCxcbiAgICAgICAgbWlzbWF0Y2hlczogbmV3TWlzbWF0Y2hlcyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZXJyb3JNc2cubGVuZ3RoID49IDEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvck1zZyxcbiAgICAgICAgaXNSZXNpZHVlTWFwcGluZ05lZWRlZCxcbiAgICAgICAgbWlzbWF0Y2hlczogbmV3TWlzbWF0Y2hlcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoeyBzdHlsZSB9ID0gdGhpcy5wcm9wcykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwiQ2hlbGxWaXpBcHBcIiBzdHlsZT17eyAuLi5zdHlsZSwgaGVpZ2h0OiAnMTAwMHB4JyB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyQ291cGxpbmdDb21wb25lbnRzKCl9XG4gICAgICAgIDxQcm90ZWluRmVhdHVyZVZpZXdlciAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW5kZXJDb3VwbGluZ0NvbXBvbmVudHMgPSAoXG4gICAgeyBzdHlsZSB9ID0gdGhpcy5wcm9wcyxcbiAgICB7IGFyZVByZWRpY3Rpb25zQXZhaWxhYmxlLCBjb3VwbGluZ1Njb3JlcywgZXJyb3JNc2csIGlzUmVzaWR1ZU1hcHBpbmdOZWVkZWQsIG1lYXN1cmVkUHJveGltaXR5LCBwZGJEYXRhIH0gPSB0aGlzXG4gICAgICAuc3RhdGUsXG4gICkgPT4gKFxuICAgIDxkaXY+XG4gICAgICA8SGVhZGVyIGFzPXsnaDEnfSBhdHRhY2hlZD17J3RvcCd9PlxuICAgICAgICBDb250YWN0TWFwLm9yZzogMkQgYW5kIDNEIFZpc3VhbGl6YXRpb25cbiAgICAgIDwvSGVhZGVyPlxuICAgICAge2Vycm9yTXNnLmxlbmd0aCA+IDEgJiYgdGhpcy5yZW5kZXJFcnJvck1lc3NhZ2UoKX1cbiAgICAgIHshcGRiRGF0YSAmJiBjb3VwbGluZ1Njb3Jlcy5sZW5ndGggPT09IDAgJiYgdGhpcy5yZW5kZXJTdGFydE1lc3NhZ2UoKX1cblxuICAgICAgPFNlZ21lbnQgYXR0YWNoZWQ9e3RydWV9IHJhaXNlZD17dHJ1ZX0+XG4gICAgICAgIDxDb3VwbGluZ0NvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICA8U2Vjb25kYXJ5U3RydWN0dXJlQ29udGV4dENvbnN1bWVyPlxuICAgICAgICAgICAge3NlY29uZGFyeVN0cnVjdHVyZUNvbnRleHQgPT4gKFxuICAgICAgICAgICAgICA8UmVzaWR1ZUNvbnRleHRDb25zdW1lcj5cbiAgICAgICAgICAgICAgICB7cmVzaWR1ZUNvbnRleHQgPT4gKFxuICAgICAgICAgICAgICAgICAgPEdyaWQgY2VudGVyZWQ9e3RydWV9PlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJVcGxvYWRCdXR0b25zUm93KGlzUmVzaWR1ZU1hcHBpbmdOZWVkZWQsIHJlc2lkdWVDb250ZXh0LCBzZWNvbmRhcnlTdHJ1Y3R1cmVDb250ZXh0KX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyQ2hlbGxDb21wb25lbnRzKHN0eWxlLCBhcmVQcmVkaWN0aW9uc0F2YWlsYWJsZSwgbWVhc3VyZWRQcm94aW1pdHksIHBkYkRhdGEpfVxuICAgICAgICAgICAgICAgICAgPC9HcmlkPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvUmVzaWR1ZUNvbnRleHRDb25zdW1lcj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TZWNvbmRhcnlTdHJ1Y3R1cmVDb250ZXh0Q29uc3VtZXI+XG4gICAgICAgIDwvQ291cGxpbmdDb250ZXh0UHJvdmlkZXI+XG4gICAgICA8L1NlZ21lbnQ+XG4gICAgICB7dGhpcy5yZW5kZXJGb290ZXIoKX1cbiAgICA8L2Rpdj5cbiAgKTtcblxuICBwcm90ZWN0ZWQgcmVuZGVyRXJyb3JNZXNzYWdlID0gKHsgZXJyb3JNc2csIGlzUmVzaWR1ZU1hcHBpbmdOZWVkZWQsIG1pc21hdGNoZXMsIHBkYkRhdGEgfSA9IHRoaXMuc3RhdGUpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1lc3NhZ2Ugd2FybmluZz17dHJ1ZX0+XG4gICAgICAgIHtpc1Jlc2lkdWVNYXBwaW5nTmVlZGVkICYmIHBkYkRhdGEgPyAoXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxNZXNzYWdlLkhlYWRlcj5cbiAgICAgICAgICAgICAge2BSZXNpZHVlIG51bWJlcmluZyBtaXNtYXRjaCBkZXRlY3RlZC4gUGxlYXNlIHVwbG9hZCBhIGZpbGUgdG8gY29ycmVjdCB0aGUgcG9zaXRpb24gbnVtYmVyaW5nIGRpZmZlcmVuY2VzLmB9XG4gICAgICAgICAgICAgIHs8YnIgLz59XG4gICAgICAgICAgICAgIHtgRVZDb3VwbGluZ3MgYW5kIEVWRm9sZCBvdXRwdXRzIHRoaXMgZmlsZSBpbiB0aGUgYH1cbiAgICAgICAgICAgICAgPHN0cm9uZz5PVVRQVVQ8L3N0cm9uZz5cbiAgICAgICAgICAgICAge2AgZGlyZWN0b3J5LlxuICAgICAgICAgICAgICAgIFRoaXMgZmlsZSBtaWdodCBiZSBuYW1lZCBzaW1pbGFyIHRvXG4gICAgICAgICAgICAgICAgJyR7cGRiRGF0YS5uYW1lfS5jc3YnIG9yICcke3BkYkRhdGEubmFtZX0uaW5kZXh0YWJsZXBsdXMnYH1cbiAgICAgICAgICAgIDwvTWVzc2FnZS5IZWFkZXI+XG4gICAgICAgICAgICA8TWVzc2FnZS5MaXN0PntlcnJvck1zZ308L01lc3NhZ2UuTGlzdD5cbiAgICAgICAgICAgIDxNZXNzYWdlLkNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxBY2NvcmRpb25cbiAgICAgICAgICAgICAgICBmbHVpZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICBleGNsdXNpdmU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIGRlZmF1bHRBY3RpdmVJbmRleD17W119XG4gICAgICAgICAgICAgICAgcGFuZWxzPXtbXG4gICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNlcXVlbmNlQWNjb3JkaW9uTWVzc2FnZSgnUERCIHNlcXVlbmNlJywgcGRiRGF0YS5zZXF1ZW5jZSwgbWlzbWF0Y2hlcyksXG4gICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNlcXVlbmNlQWNjb3JkaW9uTWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgJ0NvdXBsaW5ncyBTY29yZSBzZXF1ZW5jZScsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbVklaX1RZUEUuQ09OVEFDVF9NQVBdLmNvdXBsaW5nU2NvcmVzLnNlcXVlbmNlLFxuICAgICAgICAgICAgICAgICAgICBtaXNtYXRjaGVzLFxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9NZXNzYWdlLkNvbnRlbnQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgZXJyb3JNc2dcbiAgICAgICAgKX1cbiAgICAgIDwvTWVzc2FnZT5cbiAgICApO1xuICB9O1xuXG4gIHByb3RlY3RlZCByZW5kZXJGb290ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgY2hlbGwgPSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2NCaW9DZW50ZXIvY2hlbGwtdml6XCI+Q2hlbGw8L2E+O1xuXG4gICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgY29uc3Qgc2F5aW5ncyA9IFtcbiAgICAgIDw+UG93ZXJlZCBieSB7Y2hlbGx9ITwvPixcbiAgICAgIDw+VGhleSBsb3ZlIG1lIGF0IHRoZSB7Y2hlbGx9c2VhLjwvPixcbiAgICAgIDw+VG9kYXkncyB2aXN1YWxpemF0aW9uIGhhcyBiZWVuIGJyb3VnaHQgdG8geW91IGJ5IHtjaGVsbH0uPC8+LFxuICAgICAgPD57Y2hlbGx9c2VhLCB7Y2hlbGx9c2VhLCBJIGJlbGlldmUuLi48Lz4sXG4gICAgICA8Pk5vdyB5b3UncmUgdGhpbmtpbmcgd2l0aCB7Y2hlbGx9ITwvPixcbiAgICAgIDw+QW5kIHtjaGVsbH1zZWEgc2F5cyBzaGUncyBnb3Qgbm93aGVyZSB0byBnby4uLjwvPixcbiAgICBdLm1hcChzYXlpbmcgPT4gPFJlYWN0LkZyYWdtZW50IGtleT17J3JhbmRvbS1jaGVsbC1zYXlpbmcnfT57c2F5aW5nfTwvUmVhY3QuRnJhZ21lbnQ+KTtcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnNlY3VyZS1yYW5kb21cbiAgICBjb25zdCByYW5kb21TYXlpbmcgPSBzYXlpbmdzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNheWluZ3MubGVuZ3RoKV07XG5cbiAgICByZXR1cm4gPGZvb3RlciBzdHlsZT17eyBwYWRkaW5nOiAnMjV2aCAwIDI1cHggMjVweCcgfX0+e3JhbmRvbVNheWluZ308L2Zvb3Rlcj47XG4gIH07XG5cbiAgcHJvdGVjdGVkIHJlbmRlclNlcXVlbmNlQWNjb3JkaW9uTWVzc2FnZSA9IChcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIHNlcXVlbmNlOiBzdHJpbmcsXG4gICAgbWlzbWF0Y2hlczogSVJlc2lkdWVNaXNtYXRjaFJlc3VsdFtdLFxuICApID0+IHtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PEpTWC5FbGVtZW50PigpO1xuXG4gICAgZm9yIChjb25zdCBtaXNtYXRjaCBvZiBtaXNtYXRjaGVzKSB7XG4gICAgICByZXN1bHQucHVzaChcbiAgICAgICAgPFJlYWN0LkZyYWdtZW50IGtleT17YG1pc21hdGNoLSR7bWlzbWF0Y2gucmVzbm99YH0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICdibGFjaycsIGZvbnRTaXplOiAnMTJweCcgfX0+e3NlcXVlbmNlLnN1YnN0cihzdGFydEluZGV4LCBtaXNtYXRjaC5yZXNubyl9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAncmVkJywgZm9udFNpemU6ICcxNnB4JywgdGV4dERlY29yYXRpb246ICd1bmRlcmxpbmUnIH19PlxuICAgICAgICAgICAge3NlcXVlbmNlLmNoYXJBdChtaXNtYXRjaC5yZXNubyl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L1JlYWN0LkZyYWdtZW50PixcbiAgICAgICk7XG5cbiAgICAgIHN0YXJ0SW5kZXggPSBtaXNtYXRjaC5yZXNubyArIDI7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKFxuICAgICAgPHNwYW4ga2V5PXsnbWlzbWF0Y2gtZmluYWwnfSBzdHlsZT17eyBjb2xvcjogJ2JsYWNrJywgZm9udFNpemU6ICcxMnB4JyB9fT5cbiAgICAgICAge3NlcXVlbmNlLnN1YnN0cihzdGFydEluZGV4KX1cbiAgICAgIDwvc3Bhbj4sXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIGNvbnRlbnQ6IDxwIHN0eWxlPXt7IHdpZHRoOiAnODAlJywgd29yZEJyZWFrOiAnYnJlYWstd29yZCcgfX0+e3Jlc3VsdH08L3A+LFxuICAgICAgfSxcbiAgICAgIGtleTogYHBhbmVsLSR7dGl0bGV9YCxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIGNvbnRlbnQ6IGAke3RpdGxlfSAoJHtzZXF1ZW5jZS5sZW5ndGh9IEFtaW5vIEFjaWRzKWAsXG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgcHJvdGVjdGVkIHJlbmRlclN0YXJ0TWVzc2FnZSA9ICgpID0+IChcbiAgICA8TWVzc2FnZT5cbiAgICAgIHtgVG8gZ2V0IHN0YXJ0ZWQsIHBsZWFzZSB1cGxvYWQgZWl0aGVyIGEgUERCICgucGRiKSBvciBFVkNvdXBsaW5ncyBzY29yZSAoLmNzdikgZmlsZSFgfSB7PGJyIC8+fSBDaGVjayBvdXQgdGhlXG4gICAgICB7LyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWh0dHAtc3RyaW5nICovfVxuICAgICAgezxhIGhyZWY9XCJodHRwOi8vZXZmb2xkLm9yZ1wiPiBFVkZvbGQ8L2E+fSwgezxhIGhyZWY9XCJodHRwOi8vc2FuZGVybGFiLm9yZy9jb250YWN0LW1hcHMvXCI+U2FuZGVyIExhYjwvYT59LCBvclxuICAgICAgezxhIGhyZWY9XCJodHRwczovL2V2Y291cGxpbmdzLm9yZy9cIj4gRVZDb3VwbGluZ3MgPC9hPn0gd2Vic2l0ZSB0byBnZXQgdGhlc2UgZmlsZXMuXG4gICAgPC9NZXNzYWdlPlxuICApO1xuXG4gIHByb3RlY3RlZCByZW5kZXJVcGxvYWRGb3JtID0gKFxuICAgIG9uQ2hhbmdlOiAoZTogUmVhY3QuQ2hhbmdlRXZlbnQpID0+IHZvaWQsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBjb250ZW50OiBzdHJpbmcsXG4gICAgZGlzYWJsZWQ/OiBib29sZWFuLFxuICAgIGFjY2VwdHM6IHN0cmluZ1tdID0gW10sXG4gICkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENvbHVtbj5cbiAgICAgICAgPExhYmVsIGFzPVwibGFiZWxcIiBiYXNpYz17dHJ1ZX0gaHRtbEZvcj17aWR9PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIGljb249eyd1cGxvYWQnfVxuICAgICAgICAgICAgbGFiZWw9e3tcbiAgICAgICAgICAgICAgYmFzaWM6IHRydWUsXG4gICAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgbGFiZWxQb3NpdGlvbj17J3JpZ2h0J31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgYWNjZXB0PXtgLiR7YWNjZXB0cy5qb2luKCcsLicpfWB9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICBoaWRkZW49e3RydWV9XG4gICAgICAgICAgICB0eXBlPXsnZmlsZSd9XG4gICAgICAgICAgICByZXF1aXJlZD17dHJ1ZX1cbiAgICAgICAgICAgIG11bHRpcGxlPXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xhYmVsPlxuICAgICAgPC9HcmlkQ29sdW1uPlxuICAgICk7XG4gIH07XG5cbiAgcHJvdGVjdGVkIHJlbmRlclVwbG9hZExhYmVsID0gKGxhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQpID0+XG4gICAgbGFiZWwgPyAoXG4gICAgICA8R3JpZENvbHVtbiB2ZXJ0aWNhbEFsaWduPXsnbWlkZGxlJ30gdGV4dEFsaWduPXsnanVzdGlmaWVkJ30+XG4gICAgICAgIDxMYWJlbD57bGFiZWx9PC9MYWJlbD5cbiAgICAgIDwvR3JpZENvbHVtbj5cbiAgICApIDogbnVsbDtcblxuICBwcm90ZWN0ZWQgcmVuZGVyQ291cGxpbmdTY29yZXNVcGxvYWRGb3JtID0gKHsgY291cGxpbmdTY29yZXMsIGZpbGVuYW1lcyB9ID0gdGhpcy5zdGF0ZSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8R3JpZFJvdz5cbiAgICAgICAge3RoaXMucmVuZGVyVXBsb2FkTGFiZWwoZmlsZW5hbWVzLmNvdXBsaW5ncyl9XG4gICAgICAgIHt0aGlzLnJlbmRlclVwbG9hZEZvcm0oXG4gICAgICAgICAgdGhpcy5vbkNvdXBsaW5nU2NvcmVVcGxvYWQsXG4gICAgICAgICAgJ2NvdXBsaW5nLXNjb3JlJyxcbiAgICAgICAgICAnQ291cGxpbmcgU2NvcmVzJyxcbiAgICAgICAgICBjb3VwbGluZ1Njb3Jlcy5sZW5ndGggPiAwLFxuICAgICAgICAgIFsnY3N2J10sXG4gICAgICAgICl9XG4gICAgICA8L0dyaWRSb3c+XG4gICAgKTtcbiAgfTtcblxuICBwcm90ZWN0ZWQgcmVuZGVyQ2hlbGxDb21wb25lbnRzID0gKFxuICAgIHN0eWxlOiBSZWFjdC5DU1NQcm9wZXJ0aWVzLFxuICAgIGFyZVByZWRpY3Rpb25zQXZhaWxhYmxlOiBib29sZWFuLFxuICAgIG1lYXN1cmVkUHJveGltaXR5OiBDT05UQUNUX0RJU1RBTkNFX1BST1hJTUlUWSxcbiAgICBwZGJEYXRhPzogQ2hlbGxQREIsXG4gICAgc2l6ZTogbnVtYmVyIHwgc3RyaW5nID0gJzU1MHB4JyxcbiAgKSA9PiAoXG4gICAgPEdyaWRSb3cgdmVydGljYWxBbGlnbj17J21pZGRsZSd9PlxuICAgICAgPEdyaWRDb2x1bW4gd2lkdGg9ezZ9Pnt0aGlzLnJlbmRlckNvbnRhY3RNYXBDYXJkKGFyZVByZWRpY3Rpb25zQXZhaWxhYmxlLCBzaXplLCBzdHlsZSwgcGRiRGF0YSl9PC9HcmlkQ29sdW1uPlxuICAgICAgPEdyaWRDb2x1bW4gd2lkdGg9ezZ9Pnt0aGlzLnJlbmRlck5HTENhcmQobWVhc3VyZWRQcm94aW1pdHksIHNpemUsIHN0eWxlKX08L0dyaWRDb2x1bW4+XG4gICAgPC9HcmlkUm93PlxuICApO1xuXG4gIHByb3RlY3RlZCByZW5kZXJOR0xDYXJkID0gKFxuICAgIG1lYXN1cmVkUHJveGltaXR5OiBDT05UQUNUX0RJU1RBTkNFX1BST1hJTUlUWSxcbiAgICBzaXplOiBudW1iZXIgfCBzdHJpbmcsXG4gICAgc3R5bGU6IFJlYWN0LkNTU1Byb3BlcnRpZXMsXG4gICkgPT4gKFxuICAgIDxDYXJkIHJhaXNlZD17dHJ1ZX0gc3R5bGU9e3sgaGVpZ2h0OiAnNjE1cHgnLCBwYWRkaW5nOiAnMTVweCAxNXB4IDAgMTVweCcsIHdpZHRoOiAnNjAwcHgnIH19PlxuICAgICAgPE5HTENvbXBvbmVudFxuICAgICAgICBkYXRhPXt0aGlzLnN0YXRlW1ZJWl9UWVBFLk5HTF0ucGRiRGF0YX1cbiAgICAgICAgaGVpZ2h0PXtzaXplfVxuICAgICAgICBpc0RhdGFMb2FkaW5nPXt0aGlzLnN0YXRlW1ZJWl9UWVBFLk5HTF0uaXNMb2FkaW5nfVxuICAgICAgICBtZWFzdXJlZFByb3hpbWl0eT17bWVhc3VyZWRQcm94aW1pdHl9XG4gICAgICAgIG9uTWVhc3VyZWRQcm94aW1pdHlDaGFuZ2U9e3RoaXMub25NZWFzdXJlZFByb3hpbWl0eUNoYW5nZSgpfVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgIHdpZHRoPXtzaXplfVxuICAgICAgLz5cbiAgICA8L0NhcmQ+XG4gICk7XG5cbiAgcHJvdGVjdGVkIHJlbmRlckNvbnRhY3RNYXBDYXJkID0gKFxuICAgIGFyZVByZWRpY3Rpb25zQXZhaWxhYmxlOiBib29sZWFuLFxuICAgIHNpemU6IG51bWJlciB8IHN0cmluZyxcbiAgICBzdHlsZTogUmVhY3QuQ1NTUHJvcGVydGllcyxcbiAgICBwZGJEYXRhPzogQ2hlbGxQREIsXG4gICkgPT4gKFxuICAgIDxDYXJkIHJhaXNlZD17dHJ1ZX0gc3R5bGU9e3sgaGVpZ2h0OiAnNjE1cHgnLCBwYWRkaW5nOiAnMTVweCAxNXB4IDAgMTVweCcsIHdpZHRoOiAnNjAwcHgnIH19PlxuICAgICAge2FyZVByZWRpY3Rpb25zQXZhaWxhYmxlID8gKFxuICAgICAgICA8UHJlZGljdGVkQ29udGFjdE1hcFxuICAgICAgICAgIGRhdGE9e3tcbiAgICAgICAgICAgIGNvdXBsaW5nU2NvcmVzOiB0aGlzLnN0YXRlW1ZJWl9UWVBFLkNPTlRBQ1RfTUFQXS5jb3VwbGluZ1Njb3JlcyxcbiAgICAgICAgICAgIHBkYkRhdGEsXG4gICAgICAgICAgICBzZWNvbmRhcnlTdHJ1Y3R1cmVzOiB0aGlzLnN0YXRlW1ZJWl9UWVBFLkNPTlRBQ1RfTUFQXS5zZWNvbmRhcnlTdHJ1Y3R1cmVzLFxuICAgICAgICAgIH19XG4gICAgICAgICAgaGVpZ2h0PXtzaXplfVxuICAgICAgICAgIGlzRGF0YUxvYWRpbmc9e3RoaXMuc3RhdGVbVklaX1RZUEUuQ09OVEFDVF9NQVBdLmlzTG9hZGluZ31cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgd2lkdGg9e3NpemV9XG4gICAgICAgIC8+XG4gICAgICApIDogKFxuICAgICAgICA8Q29udGFjdE1hcFxuICAgICAgICAgIGRhdGE9e3tcbiAgICAgICAgICAgIGNvdXBsaW5nU2NvcmVzOiB0aGlzLnN0YXRlW1ZJWl9UWVBFLkNPTlRBQ1RfTUFQXS5jb3VwbGluZ1Njb3JlcyxcbiAgICAgICAgICAgIHBkYkRhdGEsXG4gICAgICAgICAgICBzZWNvbmRhcnlTdHJ1Y3R1cmVzOiB0aGlzLnN0YXRlW1ZJWl9UWVBFLkNPTlRBQ1RfTUFQXS5zZWNvbmRhcnlTdHJ1Y3R1cmVzLFxuICAgICAgICAgIH19XG4gICAgICAgICAgaGVpZ2h0PXtzaXplfVxuICAgICAgICAgIGlzRGF0YUxvYWRpbmc9e3RoaXMuc3RhdGVbVklaX1RZUEUuQ09OVEFDVF9NQVBdLmlzTG9hZGluZ31cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgd2lkdGg9e3NpemV9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvQ2FyZD5cbiAgKTtcblxuICBwcm90ZWN0ZWQgcmVuZGVyVXBsb2FkQnV0dG9uc1JvdyA9IChcbiAgICBpc1Jlc2lkdWVNYXBwaW5nTmVlZGVkOiBib29sZWFuLFxuICAgIHJlc2lkdWVDb250ZXh0OiBJUmVzaWR1ZUNvbnRleHQsXG4gICAgc2Vjb25kYXJ5U3RydWN0dXJlQ29udGV4dDogSVNlY29uZGFyeVN0cnVjdHVyZUNvbnRleHQsXG4gICkgPT4gKFxuICAgIDxHcmlkUm93IGNvbHVtbnM9ezR9IGNlbnRlcmVkPXt0cnVlfSB0ZXh0QWxpZ249eydjZW50ZXInfSB2ZXJ0aWNhbEFsaWduPXsnYm90dG9tJ30+XG4gICAgICA8R3JpZENvbHVtbj57dGhpcy5yZW5kZXJDb3VwbGluZ1Njb3Jlc1VwbG9hZEZvcm0oKX08L0dyaWRDb2x1bW4+XG4gICAgICA8R3JpZENvbHVtbj57dGhpcy5yZW5kZXJQREJVcGxvYWRGb3JtKCl9PC9HcmlkQ29sdW1uPlxuICAgICAge2lzUmVzaWR1ZU1hcHBpbmdOZWVkZWQgJiYgPEdyaWRDb2x1bW4+e3RoaXMucmVuZGVyUmVzaWR1ZU1hcHBpbmdVcGxvYWRGb3JtKCl9PC9HcmlkQ29sdW1uPn1cbiAgICAgIDxHcmlkQ29sdW1uPnt0aGlzLnJlbmRlckNsZWFyQWxsQnV0dG9uKHJlc2lkdWVDb250ZXh0LCBzZWNvbmRhcnlTdHJ1Y3R1cmVDb250ZXh0KX08L0dyaWRDb2x1bW4+XG4gICAgPC9HcmlkUm93PlxuICApO1xuXG4gIHByb3RlY3RlZCByZW5kZXJQREJVcGxvYWRGb3JtID0gKHsgZmlsZW5hbWVzLCBwZGJEYXRhIH0gPSB0aGlzLnN0YXRlKSA9PiAoXG4gICAgPEdyaWRSb3c+XG4gICAgICB7dGhpcy5yZW5kZXJVcGxvYWRMYWJlbChmaWxlbmFtZXMucGRiKX1cbiAgICAgIHt0aGlzLnJlbmRlclVwbG9hZEZvcm0odGhpcy5vblBEQlVwbG9hZCwgJ3BkYicsICdQREInLCBwZGJEYXRhICE9PSB1bmRlZmluZWQsIFsncGRiJ10pfVxuICAgIDwvR3JpZFJvdz5cbiAgKTtcblxuICBwcm90ZWN0ZWQgcmVuZGVyUmVzaWR1ZU1hcHBpbmdVcGxvYWRGb3JtID0gKHsgZmlsZW5hbWVzIH0gPSB0aGlzLnN0YXRlKSA9PiAoXG4gICAgPEdyaWRSb3cgdmVydGljYWxBbGlnbj17J21pZGRsZSd9IGNvbHVtbnM9ezF9IGNlbnRlcmVkPXt0cnVlfT5cbiAgICAgIHt0aGlzLnJlbmRlclVwbG9hZExhYmVsKGZpbGVuYW1lcy5yZXNpZHVlX21hcHBlcil9XG4gICAgICB7dGhpcy5yZW5kZXJVcGxvYWRGb3JtKHRoaXMub25SZXNpZHVlTWFwcGluZ1VwbG9hZCwgJ3Jlc2lkdWUtbWFwcGluZycsICdSZXNpZHVlIE1hcHBpbmcnLCBmYWxzZSwgW1xuICAgICAgICAnY3N2JyxcbiAgICAgICAgJ2luZGV4dGFibGUnLFxuICAgICAgICAnaW5kZXh0YWJsZXBsdXMnLFxuICAgICAgXSl9XG4gICAgPC9HcmlkUm93PlxuICApO1xuXG4gIHByb3RlY3RlZCByZW5kZXJDbGVhckFsbEJ1dHRvbiA9IChcbiAgICByZXNpZHVlQ29udGV4dDogSVJlc2lkdWVDb250ZXh0LFxuICAgIHNlY29uZGFyeVN0cnVjdHVyZUNvbnRleHQ6IElTZWNvbmRhcnlTdHJ1Y3R1cmVDb250ZXh0LFxuICApID0+IChcbiAgICA8R3JpZFJvdyB2ZXJ0aWNhbEFsaWduPXsnbWlkZGxlJ30gY29sdW1ucz17MX0gY2VudGVyZWQ9e3RydWV9PlxuICAgICAgPEdyaWRDb2x1bW4+XG4gICAgICAgIDxMYWJlbCBhcz1cImxhYmVsXCIgYmFzaWM9e3RydWV9IGh0bWxGb3I9eydjbGVhci1kYXRhJ30+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgaWNvbj17J3RyYXNoJ31cbiAgICAgICAgICAgIGxhYmVsPXt7XG4gICAgICAgICAgICAgIGJhc2ljOiB0cnVlLFxuICAgICAgICAgICAgICBjb250ZW50OiAnQ2xlYW4gVmlldycsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgbGFiZWxQb3NpdGlvbj17J3JpZ2h0J31cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25DbGVhckFsbChyZXNpZHVlQ29udGV4dCwgc2Vjb25kYXJ5U3RydWN0dXJlQ29udGV4dCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYWJlbD5cbiAgICAgIDwvR3JpZENvbHVtbj5cbiAgICA8L0dyaWRSb3c+XG4gICk7XG5cbiAgcHJvdGVjdGVkIG9uQ2xlYXJBbGwgPSAoXG4gICAgcmVzaWR1ZUNvbnRleHQ6IElSZXNpZHVlQ29udGV4dCxcbiAgICBzZWNvbmRhcnlTdHJ1Y3R1cmVDb250ZXh0OiBJU2Vjb25kYXJ5U3RydWN0dXJlQ29udGV4dCxcbiAgKSA9PiBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZShFeGFtcGxlQXBwLmluaXRpYWxTdGF0ZSk7XG4gICAgcmVzaWR1ZUNvbnRleHQuY2xlYXJBbGxSZXNpZHVlcygpO1xuICAgIHNlY29uZGFyeVN0cnVjdHVyZUNvbnRleHQuY2xlYXJBbGxTZWNvbmRhcnlTdHJ1Y3R1cmVzKCk7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9O1xuXG4gIHByb3RlY3RlZCBvbkNvdXBsaW5nU2NvcmVVcGxvYWQgPSBhc3luYyAoZTogUmVhY3QuQ2hhbmdlRXZlbnQpID0+IHtcbiAgICBlLnBlcnNpc3QoKTtcbiAgICBjb25zdCB7IG1lYXN1cmVkUHJveGltaXR5LCBwZGJEYXRhIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGZpbGVzID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzO1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlcyA/IGZpbGVzLml0ZW0oMCkgOiBudWxsO1xuICAgIGlmIChmaWxlICE9PSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5uYW1lLmVuZHNXaXRoKCcuY3N2JykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIFtWSVpfVFlQRS5DT05UQUNUX01BUF06IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVtWSVpfVFlQRS5DT05UQUNUX01BUF0sXG4gICAgICAgICAgICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgcGFyc2VkRmlsZSA9IGF3YWl0IHJlYWRGaWxlQXNUZXh0KGZpbGUpO1xuICAgICAgICAgIGNvbnN0IGNvdXBsaW5nU2NvcmVzID0gZ2V0Q291cGxpbmdTY29yZXNEYXRhKHBhcnNlZEZpbGUsIHRoaXMuc3RhdGUucmVzaWR1ZU1hcHBpbmcpO1xuICAgICAgICAgIGNvbnN0IG1pc21hdGNoZXMgPSBwZGJEYXRhID8gcGRiRGF0YS5nZXRSZXNpZHVlTnVtYmVyaW5nTWlzbWF0Y2hlcyhjb3VwbGluZ1Njb3JlcykgOiBbXTtcbiAgICAgICAgICBjb25zdCBpc1Jlc2lkdWVNYXBwaW5nTmVlZGVkID0gbWlzbWF0Y2hlcy5sZW5ndGggPiAwO1xuXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBbVklaX1RZUEUuQ09OVEFDVF9NQVBdOiB7XG4gICAgICAgICAgICAgIGNvdXBsaW5nU2NvcmVzOiBwZGJEYXRhXG4gICAgICAgICAgICAgICAgPyBwZGJEYXRhLmFtZW5kUERCV2l0aENvdXBsaW5nU2NvcmVzKGNvdXBsaW5nU2NvcmVzLnJhbmtlZENvbnRhY3RzLCBtZWFzdXJlZFByb3hpbWl0eSlcbiAgICAgICAgICAgICAgICA6IGNvdXBsaW5nU2NvcmVzLFxuICAgICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBwZGJEYXRhOiB0aGlzLnN0YXRlLnBkYkRhdGEsXG4gICAgICAgICAgICAgIHNlY29uZGFyeVN0cnVjdHVyZXM6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFyZVByZWRpY3Rpb25zQXZhaWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY291cGxpbmdTY29yZXM6IHBhcnNlZEZpbGUsXG4gICAgICAgICAgICBlcnJvck1zZzogJycsXG4gICAgICAgICAgICBmaWxlbmFtZXM6IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5zdGF0ZS5maWxlbmFtZXMsXG4gICAgICAgICAgICAgIGNvdXBsaW5nczogZmlsZS5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzUmVzaWR1ZU1hcHBpbmdOZWVkZWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgZXJyb3JNc2c6IGBVbmFibGUgdG8gbG9hZCBDb3VwbGluZyBTY29yZSBmaWxlICcke2ZpbGUubmFtZX0nIC0gTWFrZSBzdXJlIHRoZSBmaWxlIGVuZHMgaW4gJy5jc3YnIWAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyAhSU1QT1JUQU5UISBBbGxvd3Mgc2FtZSB1c2VyIHRvIGNsZWFyIGRhdGEgYW5kIHRoZW4gcmUtdXBsb2FkIHNhbWUgZmlsZSFcbiAgICAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSAnJztcbiAgfTtcblxuICBwcm90ZWN0ZWQgb25QREJVcGxvYWQgPSBhc3luYyAoZTogUmVhY3QuQ2hhbmdlRXZlbnQpID0+IHtcbiAgICBlLnBlcnNpc3QoKTtcbiAgICBjb25zdCB7IG1lYXN1cmVkUHJveGltaXR5IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGZpbGVzID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzO1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlcyA/IGZpbGVzLml0ZW0oMCkgOiBudWxsO1xuICAgIGlmIChmaWxlICE9PSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5uYW1lLmVuZHNXaXRoKCcucGRiJykpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgW1ZJWl9UWVBFLkNPTlRBQ1RfTUFQXToge1xuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVtWSVpfVFlQRS5DT05UQUNUX01BUF0sXG4gICAgICAgICAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbVklaX1RZUEUuTkdMXToge1xuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZVtWSVpfVFlQRS5OR0xdLFxuICAgICAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBwZGJEYXRhID0gYXdhaXQgQ2hlbGxQREIuY3JlYXRlUERCKGZpbGUpO1xuICAgICAgICBjb25zdCBjb3VwbGluZ1Njb3JlcyA9IHBkYkRhdGEuYW1lbmRQREJXaXRoQ291cGxpbmdTY29yZXMoXG4gICAgICAgICAgdGhpcy5zdGF0ZVtWSVpfVFlQRS5DT05UQUNUX01BUF0uY291cGxpbmdTY29yZXMucmFua2VkQ29udGFjdHMsXG4gICAgICAgICAgbWVhc3VyZWRQcm94aW1pdHksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIFtWSVpfVFlQRS5DT05UQUNUX01BUF06IHtcbiAgICAgICAgICAgIGNvdXBsaW5nU2NvcmVzLFxuICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIHBkYkRhdGEsXG4gICAgICAgICAgICBzZWNvbmRhcnlTdHJ1Y3R1cmVzOiBwZGJEYXRhLnNlY29uZGFyeVN0cnVjdHVyZVNlY3Rpb25zLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgW1ZJWl9UWVBFLk5HTF06IHtcbiAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICBwZGJEYXRhOiBwZGJEYXRhLm5nbFN0cnVjdHVyZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yTXNnOiAnJyxcbiAgICAgICAgICBmaWxlbmFtZXM6IHtcbiAgICAgICAgICAgIC4uLnRoaXMuc3RhdGUuZmlsZW5hbWVzLFxuICAgICAgICAgICAgcGRiOiBmaWxlLm5hbWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwZGJEYXRhLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGVycm9yTXNnOiBgVW5hYmxlIHRvIGxvYWQgUERCIGZpbGUgJyR7ZmlsZS5uYW1lfScgLSBNYWtlIHN1cmUgdGhlIGZpbGUgZW5kcyBpbiAnLnBkYichYCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vICFJTVBPUlRBTlQhIEFsbG93cyBzYW1lIHVzZXIgdG8gY2xlYXIgZGF0YSBhbmQgdGhlbiByZS11cGxvYWQgc2FtZSBmaWxlIVxuICAgIChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9ICcnO1xuICB9O1xuXG4gIHByb3RlY3RlZCBvbk1lYXN1cmVkUHJveGltaXR5Q2hhbmdlID0gKCkgPT4gKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1lYXN1cmVkUHJveGltaXR5OiBPYmplY3QudmFsdWVzKENPTlRBQ1RfRElTVEFOQ0VfUFJPWElNSVRZKVt2YWx1ZV0gYXMgQ09OVEFDVF9ESVNUQU5DRV9QUk9YSU1JVFksXG4gICAgfSk7XG4gIH07XG5cbiAgcHJvdGVjdGVkIG9uUmVzaWR1ZU1hcHBpbmdVcGxvYWQgPSBhc3luYyAoZTogUmVhY3QuQ2hhbmdlRXZlbnQpID0+IHtcbiAgICBlLnBlcnNpc3QoKTtcbiAgICBjb25zdCB7IG1lYXN1cmVkUHJveGltaXR5LCBwZGJEYXRhIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGZpbGVzID0gKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzO1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlcyA/IGZpbGVzLml0ZW0oMCkgOiBudWxsO1xuICAgIGNvbnN0IHZhbGlkRmlsZUV4dGVuc2lvbnMgPSBbJ2NzdicsICdpbmRleHRhYmxlJywgJ2luZGV4dGFibGVwbHVzJ107XG4gICAgaWYgKGZpbGUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGlzVmFsaWRGaWxlID0gdmFsaWRGaWxlRXh0ZW5zaW9ucy5yZWR1Y2UoKHByZXYsIGV4dCkgPT4gcHJldiB8fCBmaWxlLm5hbWUuZW5kc1dpdGgoYC4ke2V4dH1gKSwgZmFsc2UpO1xuICAgICAgaWYgKGlzVmFsaWRGaWxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBbVklaX1RZUEUuQ09OVEFDVF9NQVBdOiB7XG4gICAgICAgICAgICAgIC4uLnRoaXMuc3RhdGVbVklaX1RZUEUuQ09OVEFDVF9NQVBdLFxuICAgICAgICAgICAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnN0IHBhcnNlZEZpbGUgPSBhd2FpdCByZWFkRmlsZUFzVGV4dChmaWxlKTtcbiAgICAgICAgICBjb25zdCByZXNpZHVlTWFwcGluZyA9IGdlbmVyYXRlUmVzaWR1ZU1hcHBpbmcocGFyc2VkRmlsZSk7XG4gICAgICAgICAgY29uc3QgY291cGxpbmdTY29yZXMgPSBnZXRDb3VwbGluZ1Njb3Jlc0RhdGEodGhpcy5zdGF0ZS5jb3VwbGluZ1Njb3JlcywgcmVzaWR1ZU1hcHBpbmcpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgW1ZJWl9UWVBFLkNPTlRBQ1RfTUFQXToge1xuICAgICAgICAgICAgICBjb3VwbGluZ1Njb3JlczogcGRiRGF0YVxuICAgICAgICAgICAgICAgID8gcGRiRGF0YS5hbWVuZFBEQldpdGhDb3VwbGluZ1Njb3Jlcyhjb3VwbGluZ1Njb3Jlcy5yYW5rZWRDb250YWN0cywgbWVhc3VyZWRQcm94aW1pdHkpXG4gICAgICAgICAgICAgICAgOiBjb3VwbGluZ1Njb3JlcyxcbiAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgc2Vjb25kYXJ5U3RydWN0dXJlczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JNc2c6ICcnLFxuICAgICAgICAgICAgZmlsZW5hbWVzOiB7XG4gICAgICAgICAgICAgIC4uLnRoaXMuc3RhdGUuZmlsZW5hbWVzLFxuICAgICAgICAgICAgICByZXNpZHVlX21hcHBlcjogZmlsZS5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc2lkdWVNYXBwaW5nLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGVycm9yTXNnOiBgVW5hYmxlIHRvIGxvYWQgUmVzaWR1ZSBNYXBwaW5nIGZpbGUgJyR7XG4gICAgICAgICAgICBmaWxlLm5hbWVcbiAgICAgICAgICB9JyAtIE1ha2Ugc3VyZSB0aGUgZmlsZSBlbmRzIGluIG9uZSBvZiB0aGUgZm9sbG93aW5nOiAnJHt2YWxpZEZpbGVFeHRlbnNpb25zLmpvaW4oXCInLCAnXCIpfSdgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gIUlNUE9SVEFOVCEgQWxsb3dzIHNhbWUgdXNlciB0byBjbGVhciBkYXRhIGFuZCB0aGVuIHJlLXVwbG9hZCBzYW1lIGZpbGUhXG4gICAgKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gJyc7XG4gIH07XG59XG5cblJlYWN0RE9NLnJlbmRlcig8RXhhbXBsZUFwcCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4YW1wbGUtcm9vdCcpKTtcblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=