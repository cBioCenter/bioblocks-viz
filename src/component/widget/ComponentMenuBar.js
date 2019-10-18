"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var widget_1 = require("~bioblocks-viz~/component/widget");
var data_1 = require("~bioblocks-viz~/data");
exports.DEFAULT_POPUP_PROPS = {
    closeOnPortalMouseLeave: false,
    closeOnTriggerClick: true,
    closeOnTriggerMouseLeave: false,
    hoverable: false,
    openOnTriggerClick: true,
    openOnTriggerFocus: false,
    openOnTriggerMouseEnter: false,
    position: 'bottom left',
    style: { marginTop: 0, maxHeight: '350px', overflow: 'auto', zIndex: 3 },
};
var ComponentMenuBar = /** @class */ (function (_super) {
    tslib_1.__extends(ComponentMenuBar, _super);
    function ComponentMenuBar(props) {
        var _this = _super.call(this, props) || this;
        _this.getPopupMenuItem = function (item) {
            var opacity = _this.props.opacity;
            var trigger = React.createElement(semantic_ui_react_1.Icon, { fitted: true, name: item.iconName ? item.iconName : 'setting' });
            // We are separating the style to prevent a bug where the popup arrow does not display if overflow is set.
            var _a = tslib_1.__assign(tslib_1.__assign({}, exports.DEFAULT_POPUP_PROPS), item.component.props), style = _a.style, combinedProps = tslib_1.__rest(_a, ["style"]);
            return item.component.configs ? (React.createElement(semantic_ui_react_1.Popup, tslib_1.__assign({ trigger: trigger, wide: true }, combinedProps, { style: { opacity: opacity } }),
                React.createElement(widget_1.ConfigAccordion, { configs: _this.renderConfigs(item.component.configs), gridStyle: style, title: 'Config' }))) : (React.createElement(semantic_ui_react_1.Popup, tslib_1.__assign({ trigger: trigger }, combinedProps, { style: { opacity: opacity } })));
        };
        _this.getButtonMenuItem = function (item) {
            var validButtonProps = {};
            if (item.component.props) {
                var _a = item.component.props, color = _a.color, size = _a.size, rest = tslib_1.__rest(_a, ["color", "size"]);
                validButtonProps = rest;
            }
            return React.createElement(semantic_ui_react_1.Icon, tslib_1.__assign({ fitted: true, name: item.iconName ? item.iconName : 'setting' }, validButtonProps));
        };
        _this.onMenuEnter = function () {
            _this.setState({
                isHovered: true,
            });
        };
        _this.onMenuLeave = function () {
            _this.setState({
                isHovered: false,
            });
        };
        _this.renderComponentRightMenu = function () {
            var _a = _this.props, componentName = _a.componentName, isExpanded = _a.isExpanded, menuItems = _a.menuItems, onExpandToggleCb = _a.onExpandToggleCb;
            return (React.createElement(semantic_ui_react_1.Menu.Item, { fitted: 'horizontally', position: 'right' },
                React.createElement(semantic_ui_react_1.Menu, { secondary: true },
                    _this.renderMenuItems(menuItems, componentName),
                    React.createElement(semantic_ui_react_1.Menu.Item, { style: { flexDirection: 'column' } },
                        React.createElement(semantic_ui_react_1.Icon, { name: isExpanded ? 'compress' : 'expand arrows alternate', onClick: onExpandToggleCb }),
                        _this.renderMenuIconText(isExpanded ? 'Close' : 'Expand')))));
        };
        _this.renderComponentTitle = function (componentName, iconSrc, iconUrl) {
            return (React.createElement(semantic_ui_react_1.Menu, { secondary: true, widths: 6, fluid: false, style: { width: 'auto' } },
                React.createElement(semantic_ui_react_1.Menu.Item, { fitted: 'horizontally', style: { margin: 0, padding: 0 } },
                    iconSrc && (React.createElement("img", { alt: 'component icon', src: iconUrl, style: { height: '32px', padding: '2px', width: '32px' } })),
                    componentName)));
        };
        _this.renderConfigs = function (configs) {
            return Object.keys(configs).map(function (configKey) {
                var _a;
                return (_a = {},
                    _a[configKey] = configs[configKey].map(function (config, configIndex) { return (React.createElement(semantic_ui_react_1.Grid.Row, { columns: 1, key: "menu-bar-" + configKey + "-row-" + configIndex, style: { padding: '5px 0', width: '100%' } }, _this.renderSingleConfig(config, configKey + "-row-" + configIndex))); }),
                    _a);
            });
        };
        _this.state = {
            iconUrl: 'assets/icons/bio-blocks-icon.svg',
            isHovered: false,
        };
        return _this;
    }
    ComponentMenuBar.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var iconSrc, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iconSrc = this.props.iconSrc;
                        return [4 /*yield*/, fetch(iconSrc)];
                    case 1:
                        result = _a.sent();
                        this.setState({
                            iconUrl: result.url,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ComponentMenuBar.prototype.render = function () {
        var _a = this.props, componentName = _a.componentName, height = _a.height, iconSrc = _a.iconSrc, isExpanded = _a.isExpanded, menuItems = _a.menuItems, onExpandToggleCb = _a.onExpandToggleCb;
        var iconUrl = this.state.iconUrl;
        return (React.createElement("div", { onMouseEnter: this.onMenuEnter, onMouseLeave: this.onMenuLeave },
            React.createElement(semantic_ui_react_1.Menu, { secondary: true, style: { margin: 0, height: height } },
                this.renderComponentTitle(componentName, iconSrc, iconUrl),
                this.renderComponentRightMenu())));
    };
    ComponentMenuBar.prototype.renderConfigurationButton = function (config, id) {
        return (React.createElement(semantic_ui_react_1.Button, { compact: true, key: id, onClick: config.onClick, style: config.style },
            config.icon && React.createElement(semantic_ui_react_1.Icon, { name: config.icon }),
            config.name));
    };
    ComponentMenuBar.prototype.renderConfigurationButtonGroup = function (config, id) {
        return (React.createElement(semantic_ui_react_1.Grid, { padded: true, style: { padding: 'initial 0' } },
            React.createElement(semantic_ui_react_1.Grid.Row, { columns: 2 },
                React.createElement(semantic_ui_react_1.Grid.Column, { width: 9 }, config.name),
                React.createElement(semantic_ui_react_1.Grid.Column, { width: 3 },
                    React.createElement(semantic_ui_react_1.Button.Group, null, config.options.map(function (singleConfig, index) { return (React.createElement(semantic_ui_react_1.Button, { icon: singleConfig, key: id + "-" + index, style: config.style, basic: true, compact: true })); }))))));
    };
    ComponentMenuBar.prototype.renderConfigurationCheckbox = function (config, id) {
        return (React.createElement(semantic_ui_react_1.Checkbox, { key: id, checked: config.checked, label: config.name, onChange: config.onChange, style: config.style }));
    };
    ComponentMenuBar.prototype.renderConfigurationDropDown = function (config, id) {
        return React.createElement(semantic_ui_react_1.Dropdown, { key: id, onChange: config.onChange, options: config.options });
    };
    ComponentMenuBar.prototype.renderConfigurationLabel = function (config, id) {
        return (React.createElement(semantic_ui_react_1.Label, { basic: true, key: id, style: config.style, color: 'orange' }, config.name));
    };
    ComponentMenuBar.prototype.renderConfigurationRadioButton = function (config, id) {
        return (React.createElement(widget_1.BioblocksRadioGroup, { defaultOption: config.defaultOption, id: id, key: id, options: config.options, onChange: config.onChange, selectedOption: config.current, style: config.style, title: config.name }));
    };
    ComponentMenuBar.prototype.renderConfigurationRangeSlider = function (config, id) {
        return (React.createElement(widget_1.BioblocksRangeSlider, { key: id, label: config.name, defaultValue: config.range.defaultRange, max: config.range.max, min: config.range.min, onAfterChange: config.onAfterChange, onChange: config.onChange, style: tslib_1.__assign({ padding: '2px 0 3px 18px', width: '100%' }, config.style), value: config.range.current }));
    };
    ComponentMenuBar.prototype.renderConfigurationSlider = function (config, id) {
        return (React.createElement(widget_1.BioblocksSlider, { key: id, label: config.name, defaultValue: config.values.defaultValue, marks: config.marks, max: config.values.max, min: config.values.min, onAfterChange: config.onAfterChange, onChange: config.onChange, step: config.step, style: tslib_1.__assign({ padding: '2px 0 3px 18px', width: '100%' }, config.style), value: config.values.current }));
    };
    ComponentMenuBar.prototype.renderMenuIconText = function (text) {
        var isHovered = this.state.isHovered;
        return React.createElement("span", { style: { fontSize: '11px', visibility: isHovered ? 'visible' : 'hidden' } }, text);
    };
    ComponentMenuBar.prototype.renderMenuItems = function (items, componentName) {
        var _this = this;
        return items.map(function (item, menuBarIndex) {
            var menuItemChild = item.component.name === 'POPUP'
                ? _this.getPopupMenuItem(item)
                : _this.getButtonMenuItem(item);
            return (menuItemChild && (React.createElement(semantic_ui_react_1.Menu.Item, { active: item.component.props ? item.component.props.active : undefined, key: componentName + "-menu-item-" + menuBarIndex, style: { flexDirection: 'column' }, onClick: 'onClick' in item.component
                    ? item.component.onClick
                    : function () {
                        return;
                    } },
                menuItemChild,
                _this.renderMenuIconText(item.description))));
        });
    };
    ComponentMenuBar.prototype.renderSingleConfig = function (config, id) {
        switch (config.type) {
            case data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON:
                return this.renderConfigurationButton(config, "button-" + id);
            case data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP:
                return this.renderConfigurationButtonGroup(config, "button-" + id);
            case data_1.CONFIGURATION_COMPONENT_TYPE.CHECKBOX:
                return this.renderConfigurationCheckbox(config, "label-" + id);
            case data_1.CONFIGURATION_COMPONENT_TYPE.DROP_DOWN:
                return this.renderConfigurationDropDown(config, "label-" + id);
            case data_1.CONFIGURATION_COMPONENT_TYPE.LABEL:
                return this.renderConfigurationLabel(config, "label-" + id);
            case data_1.CONFIGURATION_COMPONENT_TYPE.RADIO:
                return this.renderConfigurationRadioButton(config, "radio-" + id);
            case data_1.CONFIGURATION_COMPONENT_TYPE.RANGE_SLIDER:
                return this.renderConfigurationRangeSlider(config, "range-slider-" + id);
            case data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER:
                return this.renderConfigurationSlider(config, "slider-" + id);
            default: {
                return "configuration for " + id;
            }
        }
    };
    ComponentMenuBar.defaultProps = {
        height: '100%',
        iconSrc: 'assets/icons/bio-blocks-icon.svg',
        isExpanded: false,
        menuItems: [],
        opacity: 0.85,
        width: '100%',
    };
    return ComponentMenuBar;
}(React.Component));
exports.ComponentMenuBar = ComponentMenuBar;
//# sourceMappingURL=ComponentMenuBar.js.map