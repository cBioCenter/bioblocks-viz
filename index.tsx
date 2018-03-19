import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ProteinViewer } from './src/container/ProteinViewer';
import { SideBySideContainer } from './src/container/SideBySideContainer';

ReactDOM.render(
  <div id="Contact Root">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <SideBySideContainer />
      <ProteinViewer />
    </div>
  </div>,
  document.getElementById('root'),
);
