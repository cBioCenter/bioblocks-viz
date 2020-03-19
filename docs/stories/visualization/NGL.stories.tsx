import * as React from 'react';

import { number, select } from '@storybook/addon-knobs';
import { NGLContainer } from '~bioblocks-viz~/container';

export default {
  component: NGLContainer,
  title: 'visualization/NGL',
};

export const BetaLactamase1ZG4 = () => (
  <NGLContainer
    experimentalProteins={['datasets/beta_lactamase/1zg4.pdb', 'datasets/beta_lactamase/1zg4_copy.pdb']}
    predictedProteins={['datasets/1zg4/1zg4.pdb', 'datasets/1zg4/1zg4_copy.pdb']}
  />
);

export const Camera = () => (
  <NGLContainer
    cameraFov={number('Stereo Camera FOV', 65)}
    cameraType={select('Camera Type', ['perspective', 'orthographic', 'stereo'], 'stereo')}
    experimentalProteins={['datasets/beta_lactamase/1zg4.pdb']}
  />
);
