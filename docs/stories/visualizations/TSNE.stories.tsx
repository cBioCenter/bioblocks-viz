import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { TensorTContainer } from '~bioblocks-viz~/container';

const stories = storiesOf('visualizations/TensorFlow T-SNE', module).addParameters({
  component: TensorTContainer,
});

stories.add('HPC - Full - T-SNE', () => <TensorTContainer datasetLocation={'datasets/hpc/full'} />, {
  info: { inline: true },
});
