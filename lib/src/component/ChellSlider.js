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
var rc_slider_1 = require("rc-slider");
var React = require("react");
require("rc-slider/assets/index.css");
/**
 * Represents a simple 2d slider, allowing a value to be selected between a minimum and maximum.
 *
 * @export
 * @extends {React.Component<IChellSliderProps, IChellSliderState>}
 */
var ChellSlider = /** @class */ (function (_super) {
    __extends(ChellSlider, _super);
    function ChellSlider(props) {
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
        _this.state = {
            value: props.defaultValue,
        };
        return _this;
    }
    ChellSlider.prototype.render = function () {
        var _a = this.props, defaultValue = _a.defaultValue, max = _a.max, min = _a.min, label = _a.label, onAfterChange = _a.onAfterChange, onChange = _a.onChange, style = _a.style;
        return (React.createElement("div", null,
            React.createElement("p", null, label + ": " + this.state.value),
            React.createElement(rc_slider_1.default, { defaultValue: defaultValue, max: max, min: min, onAfterChange: this.onAfterChange(onAfterChange), onChange: this.onChange(onChange), style: style })));
    };
    return ChellSlider;
}(React.Component));
exports.ChellSlider = ChellSlider;
