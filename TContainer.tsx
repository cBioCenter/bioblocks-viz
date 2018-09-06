import * as React from 'react';
import * as ReactDOM from 'react-dom';

import TComponent from './src/component/TComponent';

let props = {};

window.addEventListener('message', msg => {
  try {
    const parsedData = JSON.parse(msg.data);
    if (parsedData.type === 'loaded') {
      props = {
        ...props,
        ...parsedData.payload,
      };
      ReactDOM.render(<TComponent {...props} />, document.getElementById('TContainer'));
    }
  } catch (e) {
    console.log(e);
  }
});

ReactDOM.render(<TComponent {...props} />, document.getElementById('TContainer'));

if (module.hot) {
  module.hot.accept();
}
