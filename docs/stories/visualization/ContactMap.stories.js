"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var addon_knobs_1 = require("@storybook/addon-knobs");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
exports.default = {
    component: container_1.ContactMapContainer,
    title: 'visualization/Contact Map',
};
exports.NodeColors = function () { return (React.createElement(container_1.ContactMapContainer, { data: {
        couplingScores: new data_1.CouplingContainer([
            // Agreement
            { i: 381, A_i: 'Q', j: 391, A_j: 'Y', dist: 3.342438331517875 },
            { i: 337, A_i: 'R', j: 346, A_j: 'Q', dist: 2.6320275454485698 },
            { i: 328, A_i: 'P', j: 338, A_j: 'P', dist: 5.037053205992569 },
            { i: 388, A_i: 'Q', j: 392, A_j: 'D', dist: 2.7139880250288506 },
            { i: 387, A_i: 'D', j: 390, A_j: 'L', dist: 2.6750674757844877 },
            // Disagreement
            { i: 388, A_i: 'Q', j: 695, A_j: 'L', dist: 45.912429569779896 },
            { i: 375, A_i: 'L', j: 670, A_j: 'T', dist: 64.49344361250995 },
            { i: 446, A_i: 'A', j: 580, A_j: 'L', dist: 32.842243056770656 },
            { i: 232, A_i: 'T', j: 448, A_j: 'D', dist: 34.00742236630116 },
            { i: 374, A_i: 'N', j: 553, A_j: 'D', dist: 62.27235530313592 },
        ]),
        secondaryStructures: [],
    }, agreementColor: addon_knobs_1.color('Agreement', '#ff0000'), allColor: addon_knobs_1.color('All', '#000000'), highlightColor: addon_knobs_1.color('Highlight', '#ff8800'), observedColor: addon_knobs_1.color('Observed', '#0000ff') })); };
//# sourceMappingURL=ContactMap.stories.js.map