import * as React from 'react';
import * as ReactDOM from 'react-dom';

import TComponent from './src/component/TComponent';

window.addEventListener('message', msg => {
  console.log(msg);
  try {
    const parsedData = JSON.parse(msg.data);
    if (parsedData.type === 'loaded') {
      ReactDOM.render(
        <TComponent
          data={parsedData.data}
          cellContext={parsedData.cellContext}
          padding={parsedData.padding}
          pointColor={parsedData.pointColor}
        />,
        document.getElementById('TContainer'),
      );
    }
  } catch (e) {
    console.log(e);
  }
});

ReactDOM.render(<TComponent />, document.getElementById('TContainer'));

if (module.hot) {
  module.hot.accept();
}
