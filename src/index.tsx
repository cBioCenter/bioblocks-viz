import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridRow } from 'semantic-ui-react';

import { ProteinViewer } from './container/ProteinViewer';
import { SideBySideContainer } from './container/SideBySideContainer';

ReactDOM.render(
  <Grid centered={true}>
    <GridRow>
      <SideBySideContainer />
    </GridRow>
    <GridRow>
      <ProteinViewer />
    </GridRow>
  </Grid>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
