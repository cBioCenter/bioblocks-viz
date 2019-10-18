"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@storybook/react");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
var stories = react_1.storiesOf('visualization/TensorFlow T-SNE', module).addParameters({
    component: container_1.TensorTContainer,
});
stories.add('HPC - Full - T-SNE', function () { return React.createElement(container_1.TensorTContainer, { datasetLocation: 'datasets/hpc/full' }); }, {
    info: { inline: true },
});
//# sourceMappingURL=TSNE.stories.js.map