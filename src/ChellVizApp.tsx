import * as React from 'react';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { VizSelectorPanel } from './container/VizSelectorPanel';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} columns={2} divided={true} style={{ padding: '0 50px' }}>
          <GridRow>
            <GridColumn>
              <VizSelectorPanel />
            </GridColumn>
            <GridColumn>
              <VizSelectorPanel />
            </GridColumn>
          </GridRow>
        </Grid>
      </div>
    );
  }
}
