import * as React from 'react';

// tslint:disable-next-line: import-name
import IframeComm from 'react-iframe-comm';

import { initialSpringContext, ISpringContext, SpringContext } from '~chell-viz~/context';
import { T_SNE_DATA_TYPE } from '~chell-viz~/data';

export interface ITFrameComponentProps {
  data: T_SNE_DATA_TYPE;
  height: number | string;
  padding: number | string;
  pointColor: string;
  springContext: ISpringContext;
  width: number | string;
}

export interface ITFrameComponentState {
  postMessageData: object;
}

class TFrameComponentClass extends React.Component<ITFrameComponentProps, ITFrameComponentState> {
  public static defaultProps = {
    data: [[0], [0]],
    height: 400,
    padding: 0,
    pointColor: '#000000',
    springContext: {
      ...initialSpringContext,
    },
    width: 400,
  };

  protected iFrameRef: IframeComm | null = null;

  constructor(props: ITFrameComponentProps) {
    super(props);
    const { springContext, data, padding, pointColor } = props;
    this.state = {
      postMessageData: {
        payload: {
          data,
          padding,
          pointColor,
          springContext,
        },
        type: 'loaded',
      },
    };
  }

  public componentDidUpdate(prevProps: ITFrameComponentProps) {
    const { data, padding, pointColor, springContext } = this.props;

    this.setState({
      postMessageData: {
        payload: {
          data,
          padding,
          pointColor,
          springContext,
        },
        type: 'loaded',
      },
    });

    if (springContext && springContext !== prevProps.springContext) {
      this.forceUpdate();
    }
  }

  public componentWillReceiveProps(nextProps: ITFrameComponentProps) {
    let payload = {};
    Object.entries(nextProps).forEach(pair => {
      const key = pair['0'];
      // @ts-ignore
      if (nextProps[key] !== this.props[key]) {
        payload = {
          ...payload,
          // @ts-ignore
          [key]: nextProps[key],
        };
      }
    });

    this.setState({
      postMessageData: {
        payload,
        type: 'loaded',
      },
    });
  }

  public shouldComponentUpdate(nextProps: ITFrameComponentProps) {
    return (
      nextProps.springContext.currentCells &&
      nextProps.springContext.currentCells !== this.props.springContext.currentCells
    );
  }

  public render() {
    const { height, width } = this.props;
    const attributes = {
      height,
      src: 'http://localhost:8080/TContainer.html',
      width,
    };

    return <IframeComm attributes={attributes} postMessageData={this.state.postMessageData} />;
  }
}

type requiredProps = Omit<ITFrameComponentProps, keyof typeof TFrameComponentClass.defaultProps> &
  Partial<ITFrameComponentProps>;

export const TFrameComponent = (props: requiredProps) => (
  <SpringContext.Consumer>
    {springContext => <TFrameComponentClass {...props} springContext={springContext} />}
  </SpringContext.Consumer>
);
