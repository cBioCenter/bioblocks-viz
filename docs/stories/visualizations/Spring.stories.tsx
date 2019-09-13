import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { SpringContainer } from '~bioblocks-viz~/container';

const stories = storiesOf('visualizations/SPRING', module);

stories.add('HPC - Full', () => <SpringContainer />, {
  info: { inline: true },
});
