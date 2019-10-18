"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-submodule-imports
var addon_knobs_1 = require("@storybook/addon-knobs");
var react_1 = require("@storybook/react");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var stories = react_1.storiesOf('widget/ComponentCard', module).addParameters({ component: component_1.ComponentCard });
stories.add('Component Name', function () { return React.createElement(component_1.ComponentCard, { componentName: addon_knobs_1.text('name', 'My Cool Component') }); }, {
    info: { inline: true },
});
//# sourceMappingURL=ComponentCard.stories.js.map