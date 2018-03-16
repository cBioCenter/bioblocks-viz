import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ProteinViewer } from './src/container/ProteinViewer';
import { TContainer } from './src/container/TContainer';

ReactDOM.render(
  <div id="Contact Root">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <ProteinViewer />
      <TContainer />
    </div>
  </div>,
  document.getElementById('root'),
);
