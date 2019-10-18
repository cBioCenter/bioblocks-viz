"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.defaultDistanceParams = {
    color: 'red',
};
exports.defaultDistanceTooltipParams = {
    labelBackground: true,
    labelBackgroundColor: 'lightgrey',
    labelBackgroundMargin: 0.75,
    labelBorder: true,
    labelBorderColor: 'white',
    labelBorderWidth: 0.3,
    labelColor: 'black',
    labelSize: 5,
    labelUnit: 'angstrom',
    labelZOffset: 35,
};
/**
 * Draws a line between two residues in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param selection The [NGL Selection](http://nglviewer.org/ngl/api/manual/selection-language.html) defining the residues.
 */
exports.createDistanceRepresentation = function (structureComponent, selection, isTooltipEnabled, params) {
    if (params === void 0) { params = {}; }
    var representationParams = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, exports.defaultDistanceParams), params), { atomPair: Array.isArray(selection) ? [selection] : [selection.split(',')] });
    if (isTooltipEnabled) {
        representationParams = tslib_1.__assign(tslib_1.__assign({}, representationParams), exports.defaultDistanceTooltipParams);
    }
    return structureComponent.addRepresentation('distance', representationParams);
};
/**
 * Marks a set of residues with a ball+stick representation in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param residues The residues to mark.
 */
exports.createBallStickRepresentation = function (structureComponent, residues) {
    return structureComponent.addRepresentation('ball+stick', {
        sele: residues.join(', '),
    });
};
/**
 * Highlights a secondary structure in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param section The secondary structure section to highlight.
 * @param [radiusScale=5] How large to make the ribbon highlight.
 * @param [color='pink'] The color of the ribbon highlight.
 */
exports.createSecStructRepresentation = function (structureComponent, section, radiusScale, color) {
    if (radiusScale === void 0) { radiusScale = 2; }
    if (color === void 0) { color = '#feb83f'; }
    var rep = structureComponent.addRepresentation('cartoon', {
        color: color,
        radiusScale: radiusScale,
        sele: section.start + "-" + section.end,
    });
    rep.setParameters({ wireframe: true });
    return rep;
};
//# sourceMappingURL=NGLHelper.js.map