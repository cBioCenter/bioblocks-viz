import * as React from 'react';

import { select } from '@storybook/addon-knobs';
import { AnatomogramContainer, AnatomogramContainerClass } from '~bioblocks-viz~/container';

export default {
  component: AnatomogramContainerClass,
  title: 'visualizations/Anatomogram',
};

export const Species = () => (
  <AnatomogramContainer species={select('species', ['homo_sapiens', 'mus_musculus'], 'homo_sapiens')} />
);
