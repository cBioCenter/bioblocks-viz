"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var reselect_1 = require("reselect");
exports.getSpring = function (state, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return (state === undefined || !state[namespace + "/spring"]
        ? {
            category: '',
            graphData: { nodes: [] },
        }
        : state[namespace + "/spring"]);
};
exports.getGraphData = function (state, namespace) {
    if (namespace === void 0) { namespace = 'bioblocks'; }
    return exports.getSpring(state, namespace).graphData;
};
exports.getCategories = reselect_1.createSelector([exports.getGraphData], function (graphData) {
    var nodes = graphData && graphData.nodes ? graphData.nodes : [];
    var categories = immutable_1.Set(nodes.length >= 1 ? Object.keys(nodes[0].labelForCategory) : []);
    var labelsByCategory = new Map();
    categories.forEach(function (category) {
        if (category) {
            var labels = immutable_1.Set(Array.from(nodes.map(function (node) { return node.labelForCategory[category]; })));
            labelsByCategory.set(category, labels);
        }
    });
    return categories;
});
exports.getLabels = reselect_1.createSelector([exports.getGraphData], function (graphData) {
    var nodes = graphData && graphData.nodes ? graphData.nodes : [];
    var categories = immutable_1.Set(nodes.length >= 1 ? Object.keys(nodes[0].labelForCategory) : []);
    var labels = immutable_1.Set();
    categories.forEach(function (category) {
        if (category) {
            labels = labels.merge(immutable_1.Set(Array.from(nodes.map(function (node) { return node.labelForCategory[category]; }))));
        }
    });
    return labels;
});
//# sourceMappingURL=SpringSelectors.js.map