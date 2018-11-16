import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { SpringContainer } from '~chell-viz~/container';
import { ChellContextProvider } from '~chell-viz~/context';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <ChellContextProvider>
          <Grid centered={true} divided={'vertically'}>
            <Grid.Row />
            <SpringContainer height={'450px'} width={'450px'} />
          </Grid>
        </ChellContextProvider>
      </div>
    );
  }
}
