"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@storybook/react");
var React = require("react");
var addon_knobs_1 = require("@storybook/addon-knobs");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var stories = react_1.storiesOf('visualization/UMAP/Sequential Container', module).addParameters({
    component: container_1.UMAPSequenceContainer,
});
// Taken from first 16 rows of datasets/betalactamase_alignment/PSE1_NATURAL_TAXONOMY.csv
var sequences = [
    new data_1.SeqRecord(new data_1.Seq('IDAAEA')),
    new data_1.SeqRecord(new data_1.Seq('TAESKG')),
    new data_1.SeqRecord(new data_1.Seq('NAAEEH')),
    new data_1.SeqRecord(new data_1.Seq('AEREGI')),
    new data_1.SeqRecord(new data_1.Seq('NAAEEQ')),
    new data_1.SeqRecord(new data_1.Seq('SERGIR')),
    new data_1.SeqRecord(new data_1.Seq('DAAEEH')),
    new data_1.SeqRecord(new data_1.Seq('AAEREG')),
    new data_1.SeqRecord(new data_1.Seq('IVKAAA')),
    new data_1.SeqRecord(new data_1.Seq('EAEEKG')),
    new data_1.SeqRecord(new data_1.Seq('PIVKAA')),
    new data_1.SeqRecord(new data_1.Seq('EAEEKG')),
    new data_1.SeqRecord(new data_1.Seq('IVKAAA')),
    new data_1.SeqRecord(new data_1.Seq('EAEDKG')),
    new data_1.SeqRecord(new data_1.Seq('IVKAAA')),
    new data_1.SeqRecord(new data_1.Seq('EAEDKG')),
];
stories.add('Sequence Data', function () { return (React.createElement(container_1.UMAPSequenceContainer, { showUploadButton: addon_knobs_1.boolean('Show Upload Button', false), allSequences: addon_knobs_1.object('Sequences', sequences) })); }, {
    info: { inline: true },
});
//# sourceMappingURL=UMAPSequentialContainer.stories.js.map