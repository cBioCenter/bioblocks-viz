// tslint:disable-next-line: no-submodule-imports
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { ComponentCard } from '~bioblocks-viz~/component';

const stories = storiesOf('widget/ComponentCard', module).addParameters({ component: ComponentCard });

stories.add('Component Name', () => <ComponentCard componentName={text('name', 'My Cool Component')} />, {
  info: { inline: true },
});
