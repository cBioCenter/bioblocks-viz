"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var ComponentDock = /** @class */ (function (_super) {
    tslib_1.__extends(ComponentDock, _super);
    function ComponentDock(props) {
        var _this = _super.call(this, props) || this;
        _this.renderSingleDockItem = function (dockItem, index) {
            if (dockItem.isVisibleCb && dockItem.isVisibleCb() === false) {
                return null;
            }
            var isLink = dockItem.isLink === undefined ? true : dockItem.isLink;
            return (React.createElement(semantic_ui_react_1.Grid.Column, { key: "dock-item-" + index, style: { padding: 0, paddingTop: '3px' } }, isLink ? (React.createElement("div", { style: { userSelect: 'none' } },
                React.createElement("a", { "aria-pressed": false, onClick: dockItem.onClick, role: 'button' }, dockItem.text))) : (React.createElement("div", null, dockItem.text))));
        };
        return _this;
    }
    ComponentDock.prototype.render = function () {
        var _this = this;
        var _a = this.props, dockItems = _a.dockItems, visible = _a.visible;
        return (visible && (React.createElement(semantic_ui_react_1.Grid, { centered: true, columns: 'equal', style: { marginLeft: 'initial', marginRight: 'initial', marginTop: '-0.5rem', padding: 0 }, stretched: true }, dockItems.map(function (dockItem, index) { return _this.renderSingleDockItem(dockItem, index); }))));
    };
    ComponentDock.defaultProps = {
        visible: true,
    };
    return ComponentDock;
}(React.Component));
exports.ComponentDock = ComponentDock;
//# sourceMappingURL=ComponentDock.js.map