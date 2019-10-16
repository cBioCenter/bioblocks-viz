import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { UMAPTranscriptionalContainer } from '~bioblocks-viz~/container';
import { fetchMatrixData } from '~bioblocks-viz~/helper';

const stories = storiesOf('visualization/UMAP/Transcriptional Container', module).addParameters({
  component: UMAPTranscriptionalContainer,
});

fetchMatrixData('datasets/hpc/full/tsne_matrix.csv')
  .then(dataMatrix => {
    stories.add('Transcriptional Data', () => <UMAPTranscriptionalContainer dataMatrix={dataMatrix} />, {
      info: { inline: true },
    });
  })
  .catch(e => {
    console.log(e);
  });
