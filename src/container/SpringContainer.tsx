import * as React from 'react';

// tslint:disable:import-name match-default-export-name
import IframeComm, { IframeCommAttributes } from 'react-iframe-comm';
// tslint:enable:import-name match-default-export-name

import { ComponentCard } from '~chell-viz~/component';
import { initialSpringContext, ISpringContext, SpringContext } from '~chell-viz~/context';
import { ISpringLink, ISpringNode } from '~chell-viz~/data';

export interface ISpringContainerProps {
  datasetLocation: string;
  headerHeight: number;
  isFullPage: boolean;
  padding: number | string;
  selectedCategory: string;
  springContext: ISpringContext;
  springHeight: number;
  springWidth: number;
}

export interface ISpringContainerState {
  postMessageData: object;
  springUrl: string;
}

export interface ISpringMessage {
  // tslint:disable-next-line:no-reserved-keywords
  type: string;
  payload: {
    currentCategory: string;
    indices: number[];
    selectedLabel: string;
  };
}

export class SpringContainerClass extends React.Component<ISpringContainerProps, ISpringContainerState> {
  public static defaultProps = {
    data: {
      links: new Array<ISpringLink>(),
      nodes: new Array<ISpringNode>(),
    },
    datasetLocation: 'hpc/full',
    headerHeight: 18,
    isFullPage: false,
    padding: 0,
    selectedCategory: '',
    springContext: {
      ...initialSpringContext,
    },
    springHeight: 1150,
    springWidth: 1150,
  };

  public static displayName = 'SPRING';

  constructor(props: ISpringContainerProps) {
    super(props);
    this.state = {
      postMessageData: {
        payload: {},
        type: 'init',
      },
      springUrl: this.generateSpringURL(this.props.datasetLocation),
    };
  }

  public componentDidUpdate(prevProps: ISpringContainerProps, prevState: ISpringContainerState) {
    const { springContext } = this.props;
    if (!prevProps.springContext.currentCells.equals(springContext.currentCells)) {
      console.log(`sending new cells to spring, totalling ${springContext.currentCells.size}`);
      this.setState({
        postMessageData: {
          payload: {
            indices: springContext.currentCells.toArray(),
          },
          type: 'selected-cells-update',
        },
      });
    } else if (prevProps.datasetLocation !== this.props.datasetLocation) {
      this.setState({
        springUrl: this.generateSpringURL(this.props.datasetLocation),
      });
    }
  }

  public render() {
    const { headerHeight, isFullPage, springHeight, springWidth } = this.props;
    const { postMessageData, springUrl } = this.state;
    const attributes: IframeCommAttributes = {
      allowFullScreen: true,
      height: springHeight + headerHeight,
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

  protected onReceiveMessage = (msg: MessageEvent) => {
    const data = msg.data as ISpringMessage;
    const { springContext } = this.props;
    switch (data.type) {
      case 'selected-category-update':
      case 'selected-cells-update': {
        springContext.update(data.payload.indices, data.payload.currentCategory);
        break;
      }
      case 'loaded': {
        this.setState({
          postMessageData: {
            payload: {
              indices: springContext.currentCells.toArray(),
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

  protected generateSpringURL = (dataset: string) =>
    `${window.location.origin}/${window.location.pathname.substr(
      0,
      window.location.pathname.lastIndexOf('/'),
    )}/springViewer.html?datasets/${dataset}`;
}

type requiredProps = Omit<ISpringContainerProps, keyof typeof SpringContainerClass.defaultProps> &
  Partial<ISpringContainerProps>;

export const SpringContainer = (props: requiredProps) => (
  <SpringContext.Consumer>
    {springContext => <SpringContainerClass {...props} springContext={springContext} />}
  </SpringContext.Consumer>
);
