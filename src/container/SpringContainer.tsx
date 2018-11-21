import { isEqual } from 'lodash';
import * as React from 'react';

// tslint:disable:import-name match-default-export-name
import IframeComm, { IframeCommAttributes } from 'react-iframe-comm';
// tslint:enable:import-name match-default-export-name

import { ComponentCard } from '~chell-viz~/component';
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
  isFullPage: boolean;
  padding: number | string;
  selectedCategory: string;
  springContext: ISpringContext;
  springHeight: number;
  springUrl: string;
  springWidth: number;
}

export interface ISpringContainerState {
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
    headerHeight: 32,
    isFullPage: false,
    padding: 0,
    selectedCategory: '',
    springContext: {
      ...initialSpringContext,
    },
    springHeight: 720,
    springUrl: `${window.location.origin}/${window.location.pathname.substr(
      0,
      window.location.pathname.lastIndexOf('/'),
    )}/springViewer.html?datasets/hpc/full`,
    springWidth: 1280,
  };

  public static displayName = 'SPRING';

  protected springIFrameRef: React.Component<any> | null = null;

  constructor(props: ISpringContainerProps) {
    super(props);
    this.state = {
      postMessageData: {
        payload: {},
        type: 'init',
      },
    };
  }

  public componentDidUpdate(prevProps: ISpringContainerProps, prevState: ISpringContainerState) {
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
    const { isFullPage, springHeight, springUrl, springWidth } = this.props;
    const { postMessageData } = this.state;

    const attributes: IframeCommAttributes = {
      allowFullScreen: true,
      height: springHeight,
      src: springUrl,
      width: springWidth,
    };

    const targetOriginPieces = springUrl.split('/');

    return (
      <ComponentCard
        componentName={SpringContainerClass.displayName}
        isFramedComponent={true}
        isFullPage={isFullPage}
        frameHeight={springHeight}
        frameWidth={springWidth}
      >
        <IframeComm
          attributes={attributes}
          postMessageData={postMessageData}
          handleReady={this.onReady}
          handleReceiveMessage={this.onReceiveMessage}
          targetOrigin={`${targetOriginPieces[0]}//${targetOriginPieces[2]}`}
        />
      </ComponentCard>
    );
  }

  protected onReady = () => {
    return;
  };

  protected onFullscreenEnable = () => {
    this.setState({
      postMessageData: {
        // type: 'resize',
      },
    });
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
