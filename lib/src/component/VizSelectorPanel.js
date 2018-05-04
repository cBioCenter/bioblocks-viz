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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var chell_1 = require("chell");
var NGLComponent_1 = require("../component/NGLComponent");
var SpringComponent_1 = require("../component/SpringComponent");
var TComponent_1 = require("../component/TComponent");
var ReactHelper_1 = require("../helper/ReactHelper");
var ContactMap_1 = require("./ContactMap");
var defaultProps = {
    data: {},
    height: 450,
    initialViz: chell_1.VIZ_TYPE['T-SNE'],
    onDataSelect: function (e) {
        return;
    },
    padding: 15,
    selectedData: undefined,
    supportedVisualizations: [],
    width: 450,
};
var initialState = {
    selectedViz: defaultProps.initialViz,
};
exports.VizSelectorPanel = ReactHelper_1.withDefaultProps(defaultProps, /** @class */ (function (_super) {
    __extends(VizSelectorPanelClass, _super);
    function VizSelectorPanelClass(props) {
        var _this = _super.call(this, props) || this;
        _this.state = initialState;
        _this.onVizSelect = function (event, data) {
            _this.setState({
                selectedViz: data.value,
            });
        };
        _this.generateDropdownItems = function (supportedVisualizations) {
            return supportedVisualizations
                .map(function (viz) { return ({
                key: viz,
                text: viz,
                value: viz,
            }); })
                .sort(function (a, b) { return a.key.localeCompare(b.key); });
        };
        _this.state = {
            selectedViz: props.initialViz ? props.initialViz : chell_1.VIZ_TYPE.SPRING,
        };
        return _this;
    }
    VizSelectorPanelClass.prototype.render = function () {
        // N.B. We are only setting the width of the VizSelectorPanel, explicitly leaving out the height.
        // This means a component can only grow vertically, but not horizontally, and be correctly styled in containers.
        var _a = this.props, data = _a.data, selectedData = _a.selectedData, supportedVisualizations = _a.supportedVisualizations, width = _a.width;
        return (React.createElement("div", { className: "VizSelectorPanel", style: { width: width } },
            React.createElement(semantic_ui_react_1.Dropdown, { options: this.generateDropdownItems(supportedVisualizations), fluid: true, onChange: this.onVizSelect, defaultValue: this.props.initialViz }),
            React.createElement(semantic_ui_react_1.Card, { fluid: true, raised: true }, this.renderVizContainer(this.state.selectedViz, data, selectedData))));
    };
    VizSelectorPanelClass.prototype.renderVizContainer = function (viz, data, selectedData) {
        var padding = this.props.padding;
        var paddedHeight = this.props.height - padding * 2;
        var paddedWidth = this.props.width - padding * 2;
        switch (viz) {
            case chell_1.VIZ_TYPE['T-SNE']:
                return (React.createElement(TComponent_1.TComponent, { data: data['T-SNE'], height: paddedHeight, padding: padding, width: paddedWidth }));
            case chell_1.VIZ_TYPE.SPRING:
                return (React.createElement(SpringComponent_1.SpringComponent, { data: data.Spring, height: paddedHeight, padding: padding, width: paddedWidth }));
            case chell_1.VIZ_TYPE.NGL:
                return (React.createElement(NGLComponent_1.NGLComponent, { data: data.NGL, height: paddedHeight, padding: padding, width: paddedWidth }));
            case chell_1.VIZ_TYPE.CONTACT_MAP:
                return (React.createElement(ContactMap_1.ContactMap, { data: data['Contact Map'], enableSliders: true, height: paddedHeight, onMouseEnter: this.props.onDataSelect, padding: padding, selectedData: selectedData, width: paddedWidth }));
            default:
                throw new Error("Unknown viz: " + viz);
        }
    };
    return VizSelectorPanelClass;
}(React.Component)));
