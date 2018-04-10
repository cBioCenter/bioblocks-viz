import * as React from 'react';
import { Grid, GridRow } from 'semantic-ui-react';

import { VIZ_TYPE } from './component/VizSelectorPanel';
import { VizPanelContainer } from './container/VizPanelContainer';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} divided={'vertically'}>
          <GridRow>
            <VizPanelContainer initialVisualizations={[VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL]} numPanels={2} />
          </GridRow>
        </Grid>
        <GridRow>
          <VizPanelContainer initialVisualizations={[VIZ_TYPE['T-SNE'], VIZ_TYPE.SPRING]} numPanels={2} />
        </GridRow>
      </div>
    );
  }
}
