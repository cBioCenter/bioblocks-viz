import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { NGLContainer, PredictedContactMap, SpringContainer } from '~bioblocks-viz~/container';
import { BIOBLOCKS_CSS_STYLE, VIZ_TYPE } from '~bioblocks-viz~/data';
import { BBStore } from '~bioblocks-viz~/reducer';

export interface IBBFrameProps {
  style: BIOBLOCKS_CSS_STYLE;
}

export interface IBBFrameState {
  currentViz: VIZ_TYPE | undefined;
}

export class BBFrame extends React.Component<any, IBBFrameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentViz: undefined,
    };
  }
  public componentDidMount() {
    window.addEventListener('message', this.onMessage);
  }

  public componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  public render() {
    const { style } = this.props;
    const { currentViz } = this.state;

    const combinedStyle: BIOBLOCKS_CSS_STYLE = {
      ...{ height: 'auto', width: 'auto' },
      ...style,
    };

    return <div style={combinedStyle}>{this.renderViz(currentViz)}</div>;
  }

  protected onMessage = (msg: MessageEvent) => {
    console.log(msg);
    console.log(msg.data);
  };

  protected renderViz = (viz?: VIZ_TYPE) => {
    switch (viz) {
      case VIZ_TYPE.CONTACT_MAP:
        return <PredictedContactMap />;
      case VIZ_TYPE.NGL:
        return <NGLContainer />;
      case VIZ_TYPE.SPRING:
        return <SpringContainer />;
      default:
        return <div>{`Unsupported viz ${viz}!`}</div>;
    }
  };
}

ReactDOM.render(
  <Provider store={BBStore}>
    <BBFrame />
  </Provider>,
  document.getElementById('bb-viz-frame'),
);

if (module.hot) {
  module.hot.accept();
}
