import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NGLContainer, PredictedContactMap } from '~bioblocks-viz~/container';
import { BioblocksPDB } from '~bioblocks-viz~/data';

const stories = storiesOf('communication/Residues', module);

BioblocksPDB.createPDB('datasets/beta_lactamase/1ZG4.pdb')
  .then(aPDB => {
    stories.add('Residue Selection', () => (
      <div>
        <PredictedContactMap
          data={{ couplingScores: aPDB.contactInformation, secondaryStructures: aPDB.secondaryStructureSections }}
        />
        <NGLContainer predictedProteins={[aPDB]} />
      </div>
    ));
  })
  .catch(e => {
    console.log(e);
  });
