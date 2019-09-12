import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { color } from '@storybook/addon-knobs';
import { PredictedContactMap } from '~bioblocks-viz~/container';
import { CouplingContainer, IContactMapData } from '~bioblocks-viz~/data';

const stories = storiesOf('Predicted Contact Map', module);

const contactMapData: IContactMapData = {
  couplingScores: new CouplingContainer([]),
  secondaryStructures: [],
};

stories.add('Agreement Color', () => (
  <PredictedContactMap data={contactMapData} agreementColor={color('agreement color', '#ff0000')} />
));
