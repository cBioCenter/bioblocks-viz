import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { color } from '@storybook/addon-knobs';
import { PredictedContactMap } from '~bioblocks-viz~/container';
import { CouplingContainer, IContactMapData } from '~bioblocks-viz~/data';

const stories = storiesOf('visualizations/Predicted Contact Map', module).addParameters({
  component: PredictedContactMap,
});

const contactMapData: IContactMapData = {
  couplingScores: new CouplingContainer([
    // Agreement
    { i: 381, A_i: 'Q', j: 391, A_j: 'Y', dist: 3.342438331517875 },
    { i: 337, A_i: 'R', j: 346, A_j: 'Q', dist: 2.6320275454485698 },
    { i: 328, A_i: 'P', j: 338, A_j: 'P', dist: 5.037053205992569 },
    { i: 388, A_i: 'Q', j: 392, A_j: 'D', dist: 2.7139880250288506 },
    { i: 387, A_i: 'D', j: 390, A_j: 'L', dist: 2.6750674757844877 },
    // Disagreement
    { i: 388, A_i: 'Q', j: 695, A_j: 'L', dist: 45.912429569779896 },
    { i: 375, A_i: 'L', j: 670, A_j: 'T', dist: 64.49344361250995 },
    { i: 446, A_i: 'A', j: 580, A_j: 'L', dist: 32.842243056770656 },
    { i: 232, A_i: 'T', j: 448, A_j: 'D', dist: 34.00742236630116 },
    { i: 374, A_i: 'N', j: 553, A_j: 'D', dist: 62.27235530313592 },
  ]),
  secondaryStructures: [],
};

stories.add('Node Colors', () => (
  <PredictedContactMap
    data={contactMapData}
    agreementColor={color('Agreement', '#ff0000')}
    allColor={color('All', '#000000')}
    highlightColor={color('Highlight', '#ff8800')}
    observedColor={color('Observed', '#0000ff')}
  />
));
