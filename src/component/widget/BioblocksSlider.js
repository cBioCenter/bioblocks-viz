"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// tslint:disable-next-line:import-name
var rc_slider_1 = require("rc-slider");
var React = require("react");
// https://github.com/react-component/slider/ requires the css imported like this.
// tslint:disable-next-line:no-submodule-imports no-import-side-effect
require("rc-slider/assets/index.css");
var semantic_ui_react_1 = require("semantic-ui-react");
/**
 * Represents a simple 2d slider, allowing a value to be selected between a minimum and maximum.
 *
 * @export
 * @extends {React.Component<BioblocksSliderProps, IBioblocksSliderState>}
 */
var BioblocksSlider = /** @class */ (function (_super) {
    tslib_1.__extends(BioblocksSlider, _super);
    function BioblocksSlider(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
         */
        _this.onAfterChange = function (cb) { return function (value) {
            if (cb) {
                cb(value);
            }
            _this.setState({
                value: value,
            });
        }; };
        /**
         * Updates the state of the slider as the user moves the slider around but before selection is committed.
         * If applicable, invokes appropriate callback as well.
         */
        _this.onChange = function (cb) { return function (value) {
            if (cb) {
                cb(value);
            }
            _this.setState({
                value: value,
            });
        }; };
        _this.onReset = function () {
            _this.onChange(_this.props.onChange)(_this.state.defaultValue);
            // this.onAfterChange(this.props.onAfterChange)(this.state.defaultValue);
        };
        _this.state = {
            defaultValue: props.defaultValue ? props.defaultValue : props.value,
            value: props.value,
        };
        return _this;
    }
    BioblocksSlider.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, defaultValue = _a.defaultValue, value = _a.value;
        console.log(value);
        console.log(prevProps.value);
        if (value && value !== prevProps.value) {
            this.setState({
                value: value,
            });
        }
        var candidateDefaultValue = defaultValue ? defaultValue : value;
        if (this.state.defaultValue === -1 && candidateDefaultValue !== this.state.defaultValue) {
            this.setState({
                defaultValue: candidateDefaultValue,
            });
        }
    };
    BioblocksSlider.prototype.render = function () {
        var _a = this.props, value = _a.value, hideLabelValue = _a.hideLabelValue, max = _a.max, min = _a.min, label = _a.label, onAfterChange = _a.onAfterChange, onChange = _a.onChange, style = _a.style, remainingProps = tslib_1.__rest(_a, ["value", "hideLabelValue", "max", "min", "label", "onAfterChange", "onChange", "style"]);
        return (React.createElement("div", { style: style },
            React.createElement(semantic_ui_react_1.Grid.Column, { style: { float: 'left', height: '100%', width: '75%' } },
                !hideLabelValue && React.createElement("p", null, label + ": " + this.state.value),
                React.createElement(rc_slider_1.default, tslib_1.__assign({ max: max, min: min, onAfterChange: this.onAfterChange(onAfterChange), onChange: this.onChange(onChange), value: value }, remainingProps))),
            React.createElement(semantic_ui_react_1.Grid.Column, { style: { float: 'right', padding: '5% 0', width: '20%' }, verticalAlign: 'middle' },
                React.createElement(semantic_ui_react_1.Button, { icon: 'undo', onClick: this.onReset, size: 'small' }))));
    };
    return BioblocksSlider;
}(React.Component));
exports.BioblocksSlider = BioblocksSlider;
//# sourceMappingURL=BioblocksSlider.js.map