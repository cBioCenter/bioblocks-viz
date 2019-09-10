import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { ComponentCard } from '~bioblocks-viz~/component';

storiesOf('ComponentCard', module).add('with text', () => <ComponentCard componentName={'A Name'} />);
