import { isEqual } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Card, Grid, Icon, Menu } from 'semantic-ui-react';

// tslint:disable:import-name match-default-export-name
import IframeComm, { IframeCommAttributes } from 'react-iframe-comm';
import ReactSVG from 'react-svg';
// tslint:enable:import-name match-default-export-name

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
  headerHeight: number;
  height: number | string;
  padding: number | string;
  selectedCategory: string;
  springContext: ISpringContext;
  springHeight: number;
  springUrl: string;
  springWidth: number;
  width: number | string;
}

export interface ISpringContainerState {
  isFullPage: boolean;
  postMessageData: object;
  springIFrameStyle: React.CSSProperties;
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
    height: '50%',
    padding: 0,
    selectedCategory: '',
    springContext: {
      ...initialSpringContext,
    },
    springHeight: 800,
    springUrl: `${window.origin}/chell-viz/springViewer.html?datasets/hpc/full`,
    springWidth: 1200,
    width: 1200,
  };

  public static displayName = 'SPRING';

  protected springIFrameRef: React.Component<any> | null = null;

  constructor(props: ISpringContainerProps) {
    super(props);
    this.state = {
      isFullPage: false,
      postMessageData: {
        payload: {},
        type: 'init',
      },
      springIFrameStyle: {
        transformOrigin: 'top left',
      },
    };
  }

  public componentDidMount() {
    window.onresize = () => {
      this.resizeSpringIFrame();
    };
  }

  public componentDidUpdate(prevProps: ISpringContainerProps, prevState: ISpringContainerState) {
    const { cellContext, springContext } = this.props;
    const { isFullPage } = this.state;
    if (isFullPage !== prevState.isFullPage) {
      this.resizeSpringIFrame();
    }
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
    const { headerHeight, springHeight, springUrl, springWidth } = this.props;
    const { isFullPage, postMessageData, springIFrameStyle } = this.state;

    const attributes: IframeCommAttributes = {
      allowFullScreen: true,
      height: springHeight,
      src: springUrl,
      width: springWidth,
    };

    const targetOriginPieces = springUrl.split('/');

    return (
      <Grid.Column width={isFullPage ? 16 : 8}>
        <Card
          className={'spring-container'}
          ref={ref => (this.springIFrameRef = ref)}
          style={{
            maxWidth: 'unset',
            padding: '5px',
            width: '100%',
          }}
        >
          {this.renderTopMenu(headerHeight)}
          {this.springIFrameRef && (
            <div style={springIFrameStyle}>
              <IframeComm
                attributes={attributes}
                postMessageData={postMessageData}
                handleReady={this.onReady}
                handleReceiveMessage={this.onReceiveMessage}
                targetOrigin={`${targetOriginPieces[0]}//${targetOriginPieces[2]}`}
              />
            </div>
          )}
        </Card>
      </Grid.Column>
    );
  }

  protected resizeSpringIFrame = () => {
    const { headerHeight, springHeight, springWidth } = this.props;
    const { springIFrameStyle } = this.state;

    if (this.springIFrameRef) {
      const iFrameNodeRef = ReactDOM.findDOMNode(this.springIFrameRef) as Element;
      const iFrameNodeStyle = iFrameNodeRef ? window.getComputedStyle(iFrameNodeRef) : null;

      if (iFrameNodeStyle && iFrameNodeStyle.width && iFrameNodeStyle.height) {
        const refHeight = parseInt(iFrameNodeStyle.height, 10) - 18;
        const refWidth = parseInt(iFrameNodeStyle.width, 10) - 10;

        this.setState({
          springIFrameStyle: {
            ...springIFrameStyle,
            transform: `scale(calc(${refWidth}/${springWidth}),calc((${refHeight} - ${headerHeight})/${springHeight}))`,
          },
        });
      }
    }
  };

  protected renderTopMenu = (height: number | string) => (
    <Menu secondary={true} style={{ margin: 0, height }}>
      <Menu.Item position={'left'} fitted={'horizontally'} style={{ margin: 0 }}>
        <ReactSVG src={'assets/spring-icon.svg'} svgStyle={{ height: '32px', width: '32px' }} />
        {SpringContainerClass.displayName}
      </Menu.Item>
      <Menu.Item position={'right'} fitted={'horizontally'} style={{ margin: 0 }}>
        <Icon name={'expand arrows alternate'} onClick={this.onFullscreenEnable} />
        <Icon name={'settings'} />
      </Menu.Item>
    </Menu>
  );

  protected onReady = () => {
    this.resizeSpringIFrame();
  };

  protected onFullscreenEnable = () => {
    this.setState({
      isFullPage: !this.state.isFullPage,
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
