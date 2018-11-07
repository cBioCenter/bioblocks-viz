import * as React from 'react';
import * as ReactDOM from 'react-dom';

// tslint:disable-next-line:no-relative-imports
import { MorpheusComponent } from './src/component/MorpheusComponent';

ReactDOM.render(<MorpheusComponent />, document.getElementById('morpheus-root'));

if (module.hot) {
  module.hot.accept();
}
