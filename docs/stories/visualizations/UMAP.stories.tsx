import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { UMAPSequenceContainer } from '~bioblocks-viz~/container';

storiesOf('UMAPSequenceContainer', module).add('with text', () => <UMAPSequenceContainer allSequences={[]} />);
