"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@storybook/react");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
var stories = react_1.storiesOf('visualization/SPRING', module).addParameters({
    component: container_1.SpringContainerClass,
});
stories.add('HPC - Full', function () { return React.createElement(container_1.SpringContainer, { datasetLocation: '../datasets/hpc_sf2/full' }); }, {
    info: { inline: true },
});
//# sourceMappingURL=Spring.stories.js.map