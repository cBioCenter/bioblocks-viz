import * as React from 'react';
import IframeComm from 'react-iframe-comm';
import CellContext, { ICellContext, initialCellContext } from '../context/CellContext';
import { T_SNE_DATA_TYPE } from '../data/chell-data';

export interface ITComponentProps {
  cellContext: ICellContext;
  data: T_SNE_DATA_TYPE;
  height: number | string;
  padding: number | string;
  pointColor: string;
  width: number | string;
}

class TFrameComponentClass extends React.Component<ITComponentProps, any> {
  public static defaultProps = {
    cellContext: {
      ...initialCellContext,
    },
    data: [[0], [0]],
    height: 400,
    padding: 0,
    pointColor: '#000000',
    width: 400,
  };

  protected iFrameRef: IframeComm | null = null;

  constructor(props: ITComponentProps) {
    super(props);
    const { cellContext, data, padding, pointColor } = props;
    this.state = {
      postMessageData: {
        payload: {
          cellContext,
          data,
          padding,
          pointColor,
        },
        type: 'loaded',
      },
    };
  }

  public componentDidUpdate(prevProps: ITComponentProps) {
    const { cellContext, data, padding, pointColor } = this.props;

    this.setState({
      postMessageData: {
        payload: {
          cellContext,
          data,
          padding,
          pointColor,
        },
        type: 'loaded',
      },
    });

    if (cellContext && cellContext !== prevProps.cellContext) {
      this.forceUpdate();
    }
  }

  public componentWillReceiveProps(nextProps: ITComponentProps) {
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

  public shouldComponentUpdate(nextProps: ITComponentProps) {
    return (
      nextProps.cellContext.currentCells && nextProps.cellContext.currentCells !== this.props.cellContext.currentCells
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

type requiredProps = Omit<ITComponentProps, keyof typeof TFrameComponentClass.defaultProps> & Partial<ITComponentProps>;

const TFrameComponent = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => <TFrameComponentClass {...props} cellContext={{ ...cellContext }} />}
  </CellContext.Consumer>
);

export default TFrameComponent;
export { TFrameComponent };
