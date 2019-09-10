import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { UMAPSequenceContainer } from '~bioblocks-viz~/container';

const stories = storiesOf('UMAPSequenceContainer', module);

stories.add('Component name', () => <UMAPSequenceContainer allSequences={[]} />, {
  info: { inline: true },
});
