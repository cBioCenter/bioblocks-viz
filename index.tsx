import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { NGLContainer } from './src/container/NGLContainer';
import { TContainer } from './src/container/TContainer';

ReactDOM.render(
  <div id="Contact Root">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <NGLContainer />
      <TContainer />
    </div>
  </div>,
  document.getElementById('root'),
);
