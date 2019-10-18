"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@storybook/react");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
var stories = react_1.storiesOf('visualization/NGL', module).addParameters({ component: container_1.NGLContainer });
stories.add('Beta Lactamase 1ZG4', function () { return (React.createElement(container_1.NGLContainer, { experimentalProteins: ['datasets/beta_lactamase/1ZG4.pdb'], predictedProteins: ['datasets/beta_lactamase/1ZG4.pdb'] })); }, {
    info: { inline: true },
});
//# sourceMappingURL=NGL.stories.js.map