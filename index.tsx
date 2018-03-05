import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { NGLContainer } from './src/container/NGLContainer';

ReactDOM.render(
  <div id="Contact Root">
    <div>Hi!</div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <NGLContainer />
    </div>
  </div>,
  document.getElementById('root'),
);
