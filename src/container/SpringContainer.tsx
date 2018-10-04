import * as React from 'react';
// tslint:disable-next-line:import-name
import IframeComm from 'react-iframe-comm';

import {
  CellContextWrapper,
  ICellContext,
  initialCellContext,
  initialSpringContext,
  ISpringContext,
  SpringContextWrapper,
} from '~chell-viz~/context';
import { ISpringLink, ISpringNode, SPRING_DATA_TYPE } from '~chell-viz~/data';

export interface ISpringContainerProps {
  cellContext: ICellContext;
  data: SPRING_DATA_TYPE;
  height: number | string;
  padding: number | string;
  selectedCategory: string;
  springContext: ISpringContext;
  springUrl: string;
  width: number | string;
}

export interface ISpringContainerState {
  postMessageData: object;
}

export class SpringContainerClass extends React.Component<ISpringContainerProps, ISpringContainerState> {
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
    springContext: {
      ...initialSpringContext,
    },
    springUrl: 'http://localhost:11037/springViewer.html?datasets/hpc/full',
    width: 1200,
  };

  constructor(props: ISpringContainerProps) {
    super(props);
    this.state = {
      postMessageData: {
        payload: {
          coordinates: props.springContext.coordinates,
        },
        type: 'init',
      },
    };
  }

  public render() {
    const { height, springUrl, width } = this.props;

    const attributes = {
      frameBorder: 1,
      height,
      src: springUrl,
      width,
    };

    const targetOriginPieces = springUrl.split('/');
    return (
      <IframeComm
        attributes={attributes}
        postMessageData={this.state.postMessageData}
        handleReady={this.onReady}
        handleReceiveMessage={this.onReceiveMessage}
        targetOrigin={targetOriginPieces[0] + '//' + targetOriginPieces[2]}
      />
    );
  }

  protected onReady = () => {
    console.log('onReady called');
  };

  protected onReceiveMessage = (msg: MessageEvent) => {
    switch (msg.data.type) {
      case 'selected-cells-update': {
        this.props.cellContext.addCells(msg.data.payload.indices);
        break;
      }
      default: {
        console.log(`Got this msg for ya: ${JSON.stringify(msg)}`);
      }
    }
  };
}

type requiredProps = Omit<ISpringContainerProps, keyof typeof SpringContainerClass.defaultProps> &
  Partial<ISpringContainerProps>;

export const SpringContainer = (props: requiredProps) => (
  <CellContextWrapper.Consumer>
    {cellContext => (
      <SpringContextWrapper.Consumer>
        {springContext => (
          <SpringContainerClass {...props} cellContext={{ ...cellContext }} springContext={{ ...springContext }} />
        )}
      </SpringContextWrapper.Consumer>
    )}
  </CellContextWrapper.Consumer>
);
