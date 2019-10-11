import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NGLComponent } from '~bioblocks-viz~/component';
import { BioblocksPDB } from '~bioblocks-viz~/data';

const stories = storiesOf('visualization/NGL', module).addParameters({ component: NGLComponent });

BioblocksPDB.createPDB('datasets/beta_lactamase/1ZG4.pdb')
  .then(aPDB => {
    stories.add('Beta Lactamase 1ZG4', () => <NGLComponent predictedProteins={[aPDB]} />, {
      info: { inline: true },
    });
  })
  .catch(e => {
    console.log(e);
  });
