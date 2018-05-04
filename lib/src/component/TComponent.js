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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var CellContext_1 = require("../context/CellContext");
var PlotlyHelper_1 = require("../helper/PlotlyHelper");
var ReactHelper_1 = require("../helper/ReactHelper");
var defaultProps = {
    data: [[0], [0]],
    height: 400,
    padding: 0,
    pointColor: '#000000',
    width: 400,
};
exports.TComponent = ReactHelper_1.withDefaultProps(defaultProps, /** @class */ (function (_super) {
    __extends(TComponentClass, _super);
    function TComponentClass(props) {
        var _this = _super.call(this, props) || this;
        _this.onMouseSelect = function (cb) { return function (e) {
            if (e.points) {
                cb(e.points.map(function (point) { return point.pointNumber; }));
            }
        }; };
        _this.state = __assign({}, _this.state);
        return _this;
    }
    TComponentClass.prototype.render = function () {
        var _this = this;
        var _a = this.props, data = _a.data, height = _a.height, padding = _a.padding, pointColor = _a.pointColor, width = _a.width;
        var coords = new Float32Array(data.length * 2);
        data.forEach(function (ele, index) {
            coords[index * 2] = ele[0];
            coords[index * 2 + 1] = ele[1];
        });
        return (React.createElement("div", { id: "TComponent", style: { padding: padding } },
            React.createElement(CellContext_1.CellContext.Consumer, null, function (_a) {
                var addCells = _a.addCells;
                return (React.createElement(PlotlyHelper_1.PlotlyChart, { config: __assign({}, PlotlyHelper_1.defaultConfig, { modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']] }), data: [
                        {
                            marker: {
                                color: pointColor,
                            },
                            mode: 'markers',
                            type: 'scatter',
                            x: data.map(function (ele) { return ele[0]; }),
                            xaxis: 'x',
                            y: data.map(function (ele) { return ele[1]; }),
                            yaxis: 'y',
                        },
                    ], layout: __assign({}, PlotlyHelper_1.defaultLayout, { height: height,
                        width: width, yaxis: {
                            autorange: true,
                        } }), onSelectedCallback: _this.onMouseSelect(addCells) }));
            })));
    };
    return TComponentClass;
}(React.Component)));
