import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TComponent } from '~chell-viz~/component';

let props = {};

window.addEventListener('message', (msg: { data: string }) => {
  try {
    const parsedData = JSON.parse(msg.data) as { [key: string]: any };
    if (document.getElementById('tcontainer-root') && parsedData.type === 'loaded') {
      props = {
        ...props,
        ...parsedData.payload,
      };
      ReactDOM.render(<TComponent {...props} />, document.getElementById('tcontainer-root'));
    }
  } catch (e) {
    console.log(e);
  }
});

ReactDOM.render(<TComponent {...props} />, document.getElementById('tcontainer-root'));

if (module.hot) {
  module.hot.accept();
}
