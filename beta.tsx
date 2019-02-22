import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BioblocksVizApp as App } from '~bioblocks-viz~';
import { Store } from '~bioblocks-viz~/reducer';

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('app-root'),
);

if (module.hot) {
  module.hot.accept();
}
