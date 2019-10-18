"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
/**
 * Represents a single grouping of radio buttons for bioblocks, including selection logic.
 *
 * @export
 * @extends {React.Component<IBioblocksRadioGroupProps, IBioblocksRadioGroupState>}
 */
var BioblocksRadioGroup = /** @class */ (function (_super) {
    tslib_1.__extends(BioblocksRadioGroup, _super);
    function BioblocksRadioGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (index) { return function (event, data) {
            var onChange = _this.props.onChange;
            _this.setState({
                selectedIndex: index,
            });
            if (onChange) {
                onChange(index);
            }
        }; };
        _this.renderOptions = function (options, id, disabled, style) {
            return options.map(function (option, index) { return (React.createElement(semantic_ui_react_1.Grid.Column, { key: id + "-" + option + "-" + index, style: { paddingBottom: 0, paddingTop: '7px' } },
                React.createElement(semantic_ui_react_1.Form.Radio, { checked: _this.state.selectedIndex === index, disabled: disabled, label: { children: option, style: style }, name: option, onChange: _this.handleChange(index), value: index }))); });
        };
        var defaultOption = props.defaultOption, options = props.options, selectedOption = props.selectedOption;
        var selectedIndex = 0;
        if (selectedOption && options.includes(selectedOption)) {
            selectedIndex = options.indexOf(selectedOption);
        }
        else if (defaultOption && options.includes(defaultOption)) {
            selectedIndex = options.indexOf(defaultOption);
        }
        _this.state = {
            selectedIndex: selectedIndex,
        };
        return _this;
    }
    BioblocksRadioGroup.prototype.render = function () {
        var _a = this.props, disabled = _a.disabled, id = _a.id, options = _a.options, style = _a.style, title = _a.title;
        return (React.createElement("div", { style: style },
            React.createElement(semantic_ui_react_1.Form, null,
                React.createElement(semantic_ui_react_1.Grid, { centered: true, columns: 2, padded: true },
                    React.createElement(semantic_ui_react_1.Grid.Row, null,
                        React.createElement("div", { style: { fontStyle: 'italic', fontWeight: 'bold', textDecoration: 'underline' } }, title)),
                    this.renderOptions(options, id, disabled, style)))));
    };
    BioblocksRadioGroup.defaultProps = {
        disabled: false,
        style: {},
        title: 'How to calculate distance between two residues:',
    };
    return BioblocksRadioGroup;
}(React.Component));
exports.BioblocksRadioGroup = BioblocksRadioGroup;
//# sourceMappingURL=BioblocksRadioGroup.js.map