import { isEqual } from 'lodash';
import * as React from 'react';
import { Button } from 'semantic-ui-react';

// tslint:disable:import-name
import Fullscreen from 'react-full-screen';
import IframeComm, { IframeCommAttributes } from 'react-iframe-comm';
// tslint:enable:import-name

import {
  CellContext,
  ICellContext,
  initialCellContext,
  initialSpringContext,
  ISpringContext,
  SpringContext,
} from '~chell-viz~/context';
import { ISpringLink, ISpringNode } from '~chell-viz~/data';

export interface ISpringContainerProps {
  cellContext: ICellContext;
  height: number | string;
  padding: number | string;
  selectedCategory: string;
  springContext: ISpringContext;
  springUrl: string;
  width: number | string;
}

export interface ISpringContainerState {
  isFullscreen: boolean;
  postMessageData: object;
}

export interface ISpringMessage {
  // tslint:disable-next-line:no-reserved-keywords
  type: string;
  payload: {
    category: string;
    indices: number[];
  };
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
      isFullscreen: false,
      postMessageData: {
        payload: {},
        type: 'init',
      },
    };
  }

  public componentDidUpdate(prevProps: ISpringContainerProps) {
    const { cellContext, springContext } = this.props;
    if (!isEqual(prevProps.springContext.selectedCategories, springContext.selectedCategories)) {
      // Spring context updated.
      this.setState({
        postMessageData: {
          payload: {
            categories: springContext.selectedCategories,
          },
          type: 'selected-category-update',
        },
      });
    } else if (!isEqual(prevProps.cellContext.currentCells, cellContext.currentCells)) {
      // Cell context updated.
      this.setState({
        postMessageData: {
          payload: {
            indices: cellContext.currentCells,
          },
          type: 'selected-cells-update',
        },
      });
    }
  }

  public render() {
    console.log('spring render');
    const { height, springUrl, width } = this.props;
    const { isFullscreen, postMessageData } = this.state;

    const attributes: IframeCommAttributes = {
      allowFullScreen: true,
      frameBorder: 1,
      height: isFullscreen ? '100%' : height,
      src: springUrl,
      width: isFullscreen ? '100%' : width,
    };

    const targetOriginPieces = springUrl.split('/');

    return (
      <div className={'spring-container'}>
        <Fullscreen enabled={isFullscreen} onChange={this.onFullscreenChange}>
          <IframeComm
            key={isFullscreen ? 'fullscreen-spring-iframe' : 'not-fullscreen-spring-iframe'}
            attributes={attributes}
            postMessageData={postMessageData}
            handleReady={this.onReady}
            handleReceiveMessage={this.onReceiveMessage}
            targetOrigin={`${targetOriginPieces[0]}//${targetOriginPieces[2]}`}
          />
        </Fullscreen>
        <Button onClick={this.onFullscreenEnable} label={'Go Fullscreen!'} />
      </div>
    );
  }

  protected onReady = () => {
    return;
  };

  protected onFullscreenEnable = () => {
    this.setState({
      isFullscreen: true,
    });
  };

  protected onFullscreenChange = (isFullscreen: boolean) => {
    this.setState({
      isFullscreen,
      postMessageData: {
        type: 'relayout',
      },
    });
    this.forceUpdate();
  };

  protected onReceiveMessage = (msg: MessageEvent) => {
    const data = msg.data as ISpringMessage;

    switch (data.type) {
      case 'selected-category-update': {
        this.props.cellContext.addCells(data.payload.indices);
        this.props.springContext.toggleCategory(data.payload.category);
        break;
      }
      case 'selected-cells-update': {
        this.props.cellContext.addCells(data.payload.indices);
        break;
      }
      case 'loaded': {
        this.setState({
          postMessageData: {
            payload: {
              categories: this.props.springContext.selectedCategories,
              indices: this.props.cellContext.currentCells,
            },
            type: 'init',
          },
        });
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
  <CellContext.Consumer>
    {cellContext => (
      <SpringContext.Consumer>
        {springContext => <SpringContainerClass {...props} cellContext={cellContext} springContext={springContext} />}
      </SpringContext.Consumer>
    )}
  </CellContext.Consumer>
);
