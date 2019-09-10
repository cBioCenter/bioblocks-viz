// tslint:disable-next-line: no-submodule-imports
import { text } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { ComponentCard } from '~bioblocks-viz~/component';

const stories = storiesOf('ComponentCard', module);

stories.add('Component name', () => <ComponentCard componentName={text('name', 'My Cool Component')} />, {
  info: { inline: true },
});
