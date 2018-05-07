import * as React from 'react';
import { Grid, GridRow } from 'semantic-ui-react';

import VizPanelContainer from './container/VizPanelContainer';
import { VIZ_TYPE } from './data/chell-data';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} divided={'vertically'}>
          <GridRow>
            <VizPanelContainer
              dataDirs={['1', '2', '3'].map(dir => `assets/contact_map/example${dir}`)}
              supportedVisualizations={[VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL]}
              initialVisualizations={[VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL]}
              numPanels={2}
            />
          </GridRow>
          <GridRow>
            <VizPanelContainer
              dataDirs={['centroids', 'centroids_subset', 'ngl', 'spring2/full'].map(dir => `assets/${dir}`)}
              initialVisualizations={[VIZ_TYPE['T-SNE'], VIZ_TYPE.SPRING]}
              supportedVisualizations={[VIZ_TYPE['T-SNE'], VIZ_TYPE.SPRING]}
              numPanels={2}
            />
          </GridRow>
        </Grid>
      </div>
    );
  }
}
