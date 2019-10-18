"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@storybook/react");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
var helper_1 = require("~bioblocks-viz~/helper");
var stories = react_1.storiesOf('visualization/UMAP/Transcriptional Container', module).addParameters({
    component: container_1.UMAPTranscriptionalContainer,
});
helper_1.fetchMatrixData('datasets/hpc/full/tsne_matrix.csv')
    .then(function (dataMatrix) {
    stories.add('Transcriptional Data', function () { return React.createElement(container_1.UMAPTranscriptionalContainer, { dataMatrix: dataMatrix }); }, {
        info: { inline: true },
    });
})
    .catch(function (e) {
    console.log(e);
});
//# sourceMappingURL=UMAPTranscriptionalContainer.stories.js.map