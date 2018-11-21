import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ChellVizApp as App } from '~chell-viz~';

ReactDOM.render(<App />, document.getElementById('app-root'));

if (module.hot) {
  module.hot.accept();
}
