import * as React from 'react';
import { Grid, GridRow } from 'semantic-ui-react';

import { ProteinFeatureViewer, VizPanelContainer } from '~chell-viz~/container';
import { VIZ_TYPE } from '~chell-viz~/data';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} divided={'vertically'}>
          <GridRow>
            <ProteinFeatureViewer />
          </GridRow>
          <GridRow>
            <VizPanelContainer
              dataDirs={['hpc/full'].map(dir => `assets/datasets/${dir}`)}
              initialVisualizations={[VIZ_TYPE['T-SNE'], VIZ_TYPE.SPRING, VIZ_TYPE['T-SNE-FRAME']]}
              supportedVisualizations={[VIZ_TYPE['T-SNE'], VIZ_TYPE.SPRING, VIZ_TYPE['T-SNE-FRAME']]}
              numPanels={3}
            />
          </GridRow>
          <GridRow>
            <VizPanelContainer
              dataDirs={['assets/beta_lactamase', 'assets/5P21', 'assets/P01112']}
              supportedVisualizations={[VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL]}
              initialVisualizations={[VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL]}
              numPanels={2}
            />
          </GridRow>
        </Grid>
      </div>
    );
  }
}
