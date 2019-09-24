import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { boolean, object } from '@storybook/addon-knobs';
import { UMAPSequenceContainer } from '~bioblocks-viz~/container';
import { Seq, SeqRecord } from '~bioblocks-viz~/data';

const stories = storiesOf('visualizations/UMAP/Sequential Container', module).addParameters({
  component: UMAPSequenceContainer,
});

// Taken from first 16 rows of datasets/betalactamase_alignment/PSE1_NATURAL_TAXONOMY.csv
const sequences = [
  new SeqRecord(new Seq('IDAAEA')),
  new SeqRecord(new Seq('TAESKG')),
  new SeqRecord(new Seq('NAAEEH')),
  new SeqRecord(new Seq('AEREGI')),
  new SeqRecord(new Seq('NAAEEQ')),
  new SeqRecord(new Seq('SERGIR')),
  new SeqRecord(new Seq('DAAEEH')),
  new SeqRecord(new Seq('AAEREG')),
  new SeqRecord(new Seq('IVKAAA')),
  new SeqRecord(new Seq('EAEEKG')),
  new SeqRecord(new Seq('PIVKAA')),
  new SeqRecord(new Seq('EAEEKG')),
  new SeqRecord(new Seq('IVKAAA')),
  new SeqRecord(new Seq('EAEDKG')),
  new SeqRecord(new Seq('IVKAAA')),
  new SeqRecord(new Seq('EAEDKG')),
];

stories.add(
  'Sequence Data',
  () => (
    <UMAPSequenceContainer
      showUploadButton={boolean('Show Upload Button', false)}
      allSequences={object('Sequences', sequences)}
    />
  ),
  {
    info: { inline: true },
  },
);
