import * as React from 'react';
import IframeComm from 'react-iframe-comm';

import CellContext, { ICellContext, initialCellContext } from '../context/CellContext';
import { SPRING_DATA_TYPE } from '../data/chell-data';
import { ISpringLink, ISpringNode } from '../data/Spring';

export interface ISpringContainerProps {
  cellContext: ICellContext;
  data: SPRING_DATA_TYPE;
  height: number | string;
  padding: number | string;
  selectedCategory: string;
  springUrl: string;
  width: number | string;
}

export class SpringContainerClass extends React.Component<ISpringContainerProps, any> {
  public static defaultProps = {
    cellContext: {
      ...initialCellContext,
    },
    data: {
      links: new Array<ISpringLink>(),
      nodes: new Array<ISpringNode>(),
    },
    height: '100%',
    padding: 0,
    selectedCategory: '',
    springUrl: 'http://localhost:11037/springViewer.html?datasets/example/full',
    width: 1200,
  };

  constructor(props: ISpringContainerProps) {
    super(props);
  }

  public render() {
    const { height, springUrl, width } = this.props;

    const attributes = {
      frameBorder: 1,
      height,
      src: springUrl,
      width,
    };

    const postMessageData = 'postMessageData';

    const onReceiveMessage = (msg: MessageEvent) => {
      if (msg.data.type === 'selected-cells-update') {
        console.log(msg);
        this.props.cellContext.addCells(msg.data.payload.indices);
      } else {
        console.log(`Got this msg for ya: ${JSON.stringify(msg)}`);
      }
    };

    const onReady = () => {
      console.log('onReady');
    };

    const targetOriginPieces = springUrl.split('/');
    return (
      <IframeComm
        attributes={attributes}
        postMessageData={postMessageData}
        handleReady={onReady}
        handleReceiveMessage={onReceiveMessage}
        targetOrigin={targetOriginPieces[0] + '//' + targetOriginPieces[2]}
      />
    );
  }
}

type requiredProps = Omit<ISpringContainerProps, keyof typeof SpringContainerClass.defaultProps> &
  Partial<ISpringContainerProps>;

const SpringContainer = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => <SpringContainerClass {...props} cellContext={{ ...cellContext }} />}
  </CellContext.Consumer>
);

export default SpringContainer;
export { SpringContainer };
