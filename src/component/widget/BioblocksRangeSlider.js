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
 * Represents a simple 2d slider, allowing a range to be selected within a minimum and maximum.
 *
 * @export
 * @extends {React.Component<BioblocksRangeSliderProps, IBioblocksRangeSliderState>}
 */
var BioblocksRangeSlider = /** @class */ (function (_super) {
    tslib_1.__extends(BioblocksRangeSlider, _super);
    function BioblocksRangeSlider(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
         */
        _this.onAfterChange = function (cb) { return function (range) {
            if (cb) {
                cb(range);
            }
            _this.setState({
                range: range,
            });
        }; };
        /**
         * Updates the state of the slider as the user moves the slider around but before selection is committed.
         * If applicable, invokes appropriate callback as well.
         */
        _this.onChange = function (cb) { return function (range) {
            if (cb) {
                cb(range);
            }
            _this.setState({
                range: range,
            });
        }; };
        _this.onReset = function () {
            _this.onChange(_this.props.onChange)(_this.state.defaultValue);
            // this.onAfterChange(this.props.onAfterChange)(this.state.defaultValue);
        };
        _this.state = {
            defaultValue: props.defaultValue ? props.defaultValue : props.value,
            range: props.value,
        };
        return _this;
    }
    BioblocksRangeSlider.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, defaultRange = _a.defaultValue, range = _a.value;
        if (range && range !== prevProps.value) {
            this.setState({
                range: range,
            });
        }
        var candidateDefaultRange = defaultRange ? defaultRange : range;
        if (candidateDefaultRange !== this.state.defaultValue) {
            this.setState({
                defaultValue: candidateDefaultRange,
            });
        }
    };
    BioblocksRangeSlider.prototype.render = function () {
        var _a = this.props, value = _a.value, hideLabelValue = _a.hideLabelValue, max = _a.max, min = _a.min, label = _a.label, onAfterChange = _a.onAfterChange, onChange = _a.onChange, style = _a.style, remainingProps = tslib_1.__rest(_a, ["value", "hideLabelValue", "max", "min", "label", "onAfterChange", "onChange", "style"]);
        var range = this.state.range;
        return (React.createElement("div", { style: style },
            React.createElement(semantic_ui_react_1.Grid.Column, { style: { float: 'left', height: '100%', width: '75%' } },
                !hideLabelValue && React.createElement("p", null, label + ": [" + range.join(' - ') + "]"),
                React.createElement(rc_slider_1.Range, tslib_1.__assign({ allowCross: false, pushable: false, max: max, min: min, onAfterChange: this.onAfterChange(onAfterChange), onChange: this.onChange(onChange), value: value }, remainingProps))),
            React.createElement(semantic_ui_react_1.Grid.Column, { style: { float: 'right', padding: '5% 0', width: '20%' }, verticalAlign: 'middle' },
                React.createElement(semantic_ui_react_1.Button, { icon: 'undo', onClick: this.onReset, size: 'small' }))));
    };
    return BioblocksRangeSlider;
}(React.Component));
exports.BioblocksRangeSlider = BioblocksRangeSlider;
//# sourceMappingURL=BioblocksRangeSlider.js.map