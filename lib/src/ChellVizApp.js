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
var VizPanelContainer_1 = require("./container/VizPanelContainer");
var ChellVizApp = /** @class */ (function (_super) {
    __extends(ChellVizApp, _super);
    function ChellVizApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChellVizApp.prototype.render = function () {
        return (React.createElement("div", { id: "ChellVizApp" },
            React.createElement(semantic_ui_react_1.Grid, { centered: true, divided: 'vertically' },
                React.createElement(semantic_ui_react_1.GridRow, null,
                    React.createElement(VizPanelContainer_1.VizPanelContainer, { dataDirs: ['1', '2', '3'].map(function (dir) { return "assets/contact_map/example" + dir; }), supportedVisualizations: [chell_1.VIZ_TYPE.CONTACT_MAP, chell_1.VIZ_TYPE.NGL], initialVisualizations: [chell_1.VIZ_TYPE.CONTACT_MAP, chell_1.VIZ_TYPE.NGL], numPanels: 2 })),
                React.createElement(semantic_ui_react_1.GridRow, null,
                    React.createElement(VizPanelContainer_1.VizPanelContainer, { dataDirs: ['centroids', 'centroids_subset', 'ngl', 'spring2/full'].map(function (dir) { return "assets/" + dir; }), initialVisualizations: [chell_1.VIZ_TYPE['T-SNE'], chell_1.VIZ_TYPE.SPRING], supportedVisualizations: [chell_1.VIZ_TYPE['T-SNE'], chell_1.VIZ_TYPE.SPRING], numPanels: 2 })))));
    };
    return ChellVizApp;
}(React.Component));
exports.ChellVizApp = ChellVizApp;
