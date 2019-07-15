import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { PredictedContactMap } from '~bioblocks-viz~/component';
import { Store } from '~bioblocks-viz~/reducer';

export class Frame extends React.Component {
  public componentDidMount() {
    window.addEventListener('message', this.onMessage);
  }

  public componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  public render() {
    return (
      <div style={{ height: 'auto', width: 'auto' }}>
        <meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
        <PredictedContactMap />
      </div>
    );
  }

  protected onMessage = (msg: MessageEvent) => {
    console.log(msg);
    console.log(msg.data);
  };
}

ReactDOM.render(
  <Provider store={Store}>
    <Frame />
  </Provider>,
  document.getElementById('bb-viz-frame'),
);

if (module.hot) {
  module.hot.accept();
}
