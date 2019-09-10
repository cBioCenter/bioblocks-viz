import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { PredictedContactMap } from '~bioblocks-viz~/container';

const stories = storiesOf('PredictedContactMap', module);

stories.add('Component name', () => <PredictedContactMap />, {
  info: { inline: true },
});
