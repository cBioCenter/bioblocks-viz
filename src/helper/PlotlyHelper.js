"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data");
/**
 * Generate data in the expected format for a WebGL Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
exports.generateScatterGLData = function (entry, mirrorPoints) {
    if (mirrorPoints === void 0) { mirrorPoints = false; }
    return (tslib_1.__assign(tslib_1.__assign({}, exports.generateScatterData(entry, mirrorPoints)), { type: data_1.PLOTLY_CHART_TYPE.scattergl }));
};
/**
 * Generate data in the expected format for a Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
exports.generateScatterData = function (entry, mirrorPoints) {
    if (mirrorPoints === void 0) { mirrorPoints = false; }
    var marker = entry.marker, points = entry.points, hoverinfo = entry.hoverinfo, subtitle = entry.subtitle, name = entry.name, text = entry.text;
    var xValues = points.map(function (data) { return data.i; });
    var yValues = points.map(function (data) { return data.j; });
    var zValues = points.map(function (data) { return (data.dist ? data.dist : -1); });
    var textValues = text ? (Array.isArray(text) ? text : [text]) : [];
    return {
        hoverinfo: hoverinfo ? hoverinfo : 'x+y+z',
        marker: tslib_1.__assign({ color: derivePlotlyColor(mirrorPoints, zValues, entry), size: entry.nodeSize }, marker),
        mode: 'markers',
        name: name + " " + subtitle,
        text: deriveScatterText(mirrorPoints, textValues),
        type: data_1.PLOTLY_CHART_TYPE.scatter,
        x: derivePoints(mirrorPoints, xValues, yValues),
        y: derivePoints(mirrorPoints, yValues, xValues),
        z: derivePoints(mirrorPoints, zValues, zValues),
    };
};
var derivePlotlyColor = function (mirrorPoints, zValues, entry) {
    var totalColors = mirrorPoints ? zValues.length * 2 : zValues.length;
    var result = new Array(totalColors);
    if (entry.marker && typeof entry.marker.color === 'string') {
        return result.fill(entry.marker.color);
    }
    else {
        var zStrings = zValues.map(function (val) { return val.toString(); });
        return mirrorPoints ? tslib_1.__spread(zStrings, zStrings) : zStrings;
    }
};
var derivePoints = function (mirrorPoints, points, oppositePoints) {
    return mirrorPoints ? tslib_1.__spread(points, oppositePoints) : points;
};
var deriveScatterText = function (mirrorPoints, textValues) {
    return mirrorPoints
        ? tslib_1.__spread(textValues, textValues.map(
        // Given a coordinate '(x, y)', create '(y, x)' - needed because we have custom hover labels.
        function (coord) {
            if (coord.includes('<br>') && coord.includes('(')) {
                var breakIndex = coord.indexOf('<br>');
                return "(" + coord
                    .substr(1, breakIndex - 2)
                    .split(', ')
                    .reverse()
                    .join(', ') + ")" + coord.substring(breakIndex);
            }
            else if (coord.includes('(')) {
                return "(" + coord
                    .substr(1, coord.length - 2)
                    .split(', ')
                    .reverse()
                    .join(', ') + ")";
            }
            else {
                return "" + coord
                    .split(', ')
                    .reverse()
                    .join(', ');
            }
        })) : textValues;
};
/**
 * Determines the appropriate hover text in plotly for this coupling score.
 *
 * Currently the following 3 fields will be appended if present:
 * - Amino acid (A_i, A_j)
 * - Score
 * - Probability
 */
exports.generateCouplingScoreHoverText = function (point) {
    var hoverText = '';
    if (point) {
        // Yields the format '(2B, 9S)' if amino acid is known, otherwise just '(2, 9)'
        hoverText =
            point.A_i && point.A_j ? "(" + point.i + point.A_i + ", " + point.j + point.A_j + ")" : "(" + point.i + ", " + point.j + ")";
        if (point.score) {
            hoverText = hoverText + "<br>Score: " + point.score;
        }
        if (point.probability) {
            hoverText = hoverText + "<br>Probability: " + point.probability.toFixed(1);
        }
    }
    return hoverText;
};
exports.generateFloat32ArrayFromContacts = function (array) {
    var result = new Float32Array(array.length * 2);
    array.forEach(function (item, index) {
        result[index * 2] = item.i;
        result[index * 2 + 1] = item.j;
    });
    return result;
};
/**
 * Generate data in the expected format for a Plotly PointCloud.
 *
 * @param entry A unit of Plotly data containing points, color, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
exports.generatePointCloudData = function (entry, mirrorPoints) {
    if (mirrorPoints === void 0) { mirrorPoints = false; }
    var points = entry.points;
    var coords = exports.generateFloat32ArrayFromContacts(points);
    return {
        marker: tslib_1.__assign(tslib_1.__assign({}, entry.marker), { sizemax: entry.nodeSize * 2, sizemin: entry.nodeSize }),
        mode: 'markers',
        type: data_1.PLOTLY_CHART_TYPE.pointcloud,
        xy: mirrorPoints
            ? new Float32Array(tslib_1.__spread(Array.from(coords), Array.from(coords)
                .slice()
                .reverse()))
            : coords,
    };
};
//# sourceMappingURL=PlotlyHelper.js.map