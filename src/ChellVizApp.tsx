import * as React from 'react';
import { Grid, GridRow } from 'semantic-ui-react';

import { VizPanelContainer } from '~chell-viz~/container';
import { VIZ_TYPE } from '~chell-viz~/data';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} divided={'vertically'}>
          <GridRow>
            <VizPanelContainer
              dataDirs={['hpc/full'].map(dir => `assets/datasets/${dir}`)}
              initialVisualizations={[VIZ_TYPE.SPRING, VIZ_TYPE['TENSOR-T-SNE']]}
              supportedVisualizations={[VIZ_TYPE.SPRING, VIZ_TYPE['TENSOR-T-SNE']]}
              numPanels={2}
            />
          </GridRow>
        </Grid>
      </div>
    );
  }
}
