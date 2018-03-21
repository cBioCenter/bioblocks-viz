import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Card, Grid, GridRow } from 'semantic-ui-react';

import { ProteinViewer } from './container/ProteinViewer';
import { SideBySideContainer } from './container/SideBySideContainer';

ReactDOM.render(
  <div>
    <SideBySideContainer />
    <ProteinViewer />
  </div>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
