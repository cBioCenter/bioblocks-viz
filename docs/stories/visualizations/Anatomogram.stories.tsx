import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { select } from '@storybook/addon-knobs';
import { AnatomogramContainer, AnatomogramContainerClass } from '~bioblocks-viz~/container';

const stories = storiesOf('visualizations/Anatomogram Container', module).addParameters({
  component: AnatomogramContainerClass,
});

stories.add(
  'Species',
  () => <AnatomogramContainer species={select('species', ['homo_sapiens', 'mus_musculus'], 'homo_sapiens')} />,
  {
    info: { inline: true },
  },
);
