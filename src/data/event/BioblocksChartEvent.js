"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("~bioblocks-viz~/data");
var BioblocksChartEvent = /** @class */ (function () {
    function BioblocksChartEvent(
    // tslint:disable-next-line:no-reserved-keywords
    type, chartPiece, selectedPoints, plotlyEvent) {
        if (selectedPoints === void 0) { selectedPoints = []; }
        if (plotlyEvent === void 0) { plotlyEvent = {}; }
        this.type = type;
        this.chartPiece = chartPiece;
        this.selectedPoints = selectedPoints;
        this.plotlyEvent = plotlyEvent;
    }
    BioblocksChartEvent.prototype.isAxis = function () {
        return this.chartPiece === data_1.BIOBLOCKS_CHART_PIECE.AXIS;
    };
    return BioblocksChartEvent;
}());
exports.BioblocksChartEvent = BioblocksChartEvent;
//# sourceMappingURL=BioblocksChartEvent.js.map