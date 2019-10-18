"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var TensorTComponentClass = /** @class */ (function (_super) {
    tslib_1.__extends(TensorTComponentClass, _super);
    function TensorTComponentClass(props) {
        return _super.call(this, props) || this;
    }
    TensorTComponentClass.prototype.render = function () {
        var _a = this.props, onSelectedCallback = _a.onSelectedCallback, pointsToPlot = _a.pointsToPlot;
        return (React.createElement(component_1.PlotlyChart, { data: pointsToPlot, layout: tslib_1.__assign(tslib_1.__assign({}, component_1.defaultPlotlyLayout), { dragmode: 'select', margin: {
                    b: 20,
                }, xaxis: { autorange: false, range: [0, 1], showline: true }, yaxis: { autorange: false, range: [0, 1], showline: true } }), onSelectedCallback: onSelectedCallback }));
    };
    TensorTComponentClass.defaultProps = {
        pointsToPlot: [],
        style: {
            padding: 0,
        },
    };
    return TensorTComponentClass;
}(React.Component));
exports.TensorTComponent = function (props) { return React.createElement(TensorTComponentClass, tslib_1.__assign({}, props)); };
//# sourceMappingURL=TensorTComponent.js.map