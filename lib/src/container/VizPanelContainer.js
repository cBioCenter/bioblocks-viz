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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var VizSelectorPanel_1 = require("../component/VizSelectorPanel");
var ChellContext_1 = require("../context/ChellContext");
var DataHelper_1 = require("../helper/DataHelper");
var ReactHelper_1 = require("../helper/ReactHelper");
var defaultProps = {
    initialVisualizations: [],
    /** Number of panels to be controlled by this container. Currently limited to 4. */
    numPanels: 1,
};
var initialState = {
    currentDataDir: '',
    data: {},
};
exports.VizPanelContainer = ReactHelper_1.withDefaultProps(defaultProps, /** @class */ (function (_super) {
    __extends(VizPanelContainerClass, _super);
    function VizPanelContainerClass(props) {
        var _this = _super.call(this, props) || this;
        _this.state = initialState;
        _this.onDataDirChange = function (event, data) {
            _this.setState({
                currentDataDir: data.value,
            });
        };
        _this.state = __assign({}, _this.state, { currentDataDir: props.dataDirs[0] });
        return _this;
    }
    VizPanelContainerClass.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, _a, viz, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        results = {};
                        _i = 0, _a = this.props.supportedVisualizations;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        viz = _a[_i];
                        _b = results;
                        _c = viz;
                        return [4 /*yield*/, DataHelper_1.fetchAppropriateData(viz, this.state.currentDataDir)];
                    case 2:
                        _b[_c] = _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.setState({
                            data: __assign({}, results),
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    VizPanelContainerClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, _a, viz, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(prevState.currentDataDir !== this.state.currentDataDir)) return [3 /*break*/, 5];
                        results = {};
                        _i = 0, _a = this.props.supportedVisualizations;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        viz = _a[_i];
                        _b = results;
                        _c = viz;
                        return [4 /*yield*/, DataHelper_1.fetchAppropriateData(viz, this.state.currentDataDir)];
                    case 2:
                        _b[_c] = _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.setState({
                            data: __assign({}, results),
                        });
                        _d.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VizPanelContainerClass.prototype.render = function () {
        return (React.createElement(semantic_ui_react_1.Grid, { className: 'VizPanelContainer', columns: this.props.numPanels, centered: true, relaxed: true },
            React.createElement(semantic_ui_react_1.GridRow, { columns: 1, centered: true },
                React.createElement(semantic_ui_react_1.Dropdown, { onChange: this.onDataDirChange, options: this.props.dataDirs.map(function (dir) {
                        return { key: dir, text: dir, value: dir };
                    }).slice(), placeholder: 'Select Data Directory', search: true })),
            React.createElement(ChellContext_1.ChellContext, null, this.renderPanels(this.props.numPanels, this.state.data, this.props.initialVisualizations).map(function (panel, index) { return React.createElement(semantic_ui_react_1.GridColumn, { key: index }, panel); }))));
    };
    VizPanelContainerClass.prototype.renderPanels = function (numPanels, data, initialVisualizations) {
        var result = [];
        for (var i = 0; i < numPanels; ++i) {
            result.push(React.createElement(VizSelectorPanel_1.VizSelectorPanel, { data: data, initialViz: initialVisualizations[i], supportedVisualizations: this.props.supportedVisualizations }));
        }
        return result;
    };
    return VizPanelContainerClass;
}(React.Component)));
