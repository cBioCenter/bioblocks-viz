import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { NGLContainer } from './src/container/NGLContainer';
import { ThreeDimMolContainer } from './src/container/ThreeDimMolContainer';

ReactDOM.render(
  <div id="Contact Root">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <NGLContainer />
      <ThreeDimMolContainer />
    </div>
  </div>,
  document.getElementById('root'),
);
