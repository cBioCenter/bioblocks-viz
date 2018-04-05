import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { VizPanelContainer } from './container/VizPanelContainer';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true}>
          <VizPanelContainer numPanels={2} />
        </Grid>
      </div>
    );
  }
}
