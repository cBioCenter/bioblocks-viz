import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NGLContainer } from '~bioblocks-viz~/container';

const stories = storiesOf('visualization/NGL', module).addParameters({ component: NGLContainer });

stories.add(
  'Beta Lactamase 1ZG4',
  () => (
    <NGLContainer
      experimentalProteins={['datasets/beta_lactamase/1zg4.pdb', 'datasets/beta_lactamase/1zg4_copy.pdb']}
      predictedProteins={['datasets/1zg4/1zg4.pdb', 'datasets/1zg4/1zg4_copy.pdb']}
    />
  ),
  {
    info: { inline: true },
  },
);
