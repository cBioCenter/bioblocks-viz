"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var ConfigAccordion = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigAccordion, _super);
    function ConfigAccordion(props) {
        var _this = _super.call(this, props) || this;
        _this.renderConfigs = function (configs, activeIndices) {
            return configs.map(function (config, index) {
                return Object.keys(config).map(function (configKey) { return (React.createElement(semantic_ui_react_1.Grid.Row, { key: "accordion-" + configKey, textAlign: 'left' },
                    React.createElement(semantic_ui_react_1.Accordion.Title, { active: activeIndices.includes(index), index: index, key: configKey + "-title", onClick: _this.onClick, style: { fontWeight: 'bolder', textAlign: 'left' } },
                        React.createElement(semantic_ui_react_1.Icon, { name: 'dropdown' }),
                        configKey),
                    React.createElement(semantic_ui_react_1.Accordion.Content, { active: activeIndices.includes(index), key: configKey + "-content", style: { width: '100%' } }, _this.renderSingleConfig(Object.entries(configs)[index])))); });
            });
        };
        _this.onClick = function (event, data) {
            var allowMultipleOpen = _this.props.allowMultipleOpen;
            var activeIndices = _this.state.activeIndices;
            if (data === undefined || data.index === undefined) {
                return;
            }
            var alreadyActive = activeIndices.includes(data.index);
            if (alreadyActive) {
                _this.setState({
                    activeIndices: activeIndices.filter(function (index) { return index !== data.index; }),
                });
            }
            else if (allowMultipleOpen) {
                _this.setState({
                    activeIndices: tslib_1.__spread(activeIndices, [data.index]),
                });
            }
            else {
                _this.setState({
                    activeIndices: [data.index],
                });
            }
        };
        _this.renderSingleConfig = function (config) {
            return (React.createElement(semantic_ui_react_1.Grid.Row, { key: "accordion-" + config[0], textAlign: 'left' },
                React.createElement(semantic_ui_react_1.Grid, { padded: true, relaxed: true, stretched: true, style: { marginTop: '7px' } }, Object.values(config[1]))));
        };
        _this.state = {
            activeIndices: props.configs.length >= 1 ? [0] : [],
        };
        return _this;
    }
    ConfigAccordion.prototype.render = function () {
        var _a = this.props, configs = _a.configs, gridStyle = _a.gridStyle;
        var activeIndices = this.state.activeIndices;
        return (React.createElement(semantic_ui_react_1.Accordion, null,
            React.createElement(semantic_ui_react_1.Grid, { padded: true, stretched: true, style: gridStyle }, this.renderConfigs(configs, activeIndices))));
    };
    ConfigAccordion.defaultProps = {
        allowMultipleOpen: false,
        gridStyle: {},
    };
    return ConfigAccordion;
}(React.Component));
exports.ConfigAccordion = ConfigAccordion;
//# sourceMappingURL=ConfigAccordion.js.map