import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Chart } from 'react-google-charts';

import { ContactContainer } from './src/container/ContactContainer';

ReactDOM.render(
  <div id="Contact Root">
    <div>Hi!</div>
    <ContactContainer />
  </div>,
  document.getElementById('root'),
);
