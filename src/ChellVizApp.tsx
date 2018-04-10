import * as React from 'react';
import { Grid, GridRow } from 'semantic-ui-react';

import { VizPanelContainer } from './container/VizPanelContainer';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} divided={'vertically'}>
          <GridRow>
            <VizPanelContainer numPanels={2} />
          </GridRow>
        </Grid>
      </div>
    );
  }
}
