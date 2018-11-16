import { isEqual } from 'lodash';
import * as React from 'react';
import { Card, Icon, Menu } from 'semantic-ui-react';

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
  height: number | string;
  padding: number | string;
  selectedCategory: string;
  springContext: ISpringContext;
  springUrl: string;
  width: number | string;
}

export interface ISpringContainerState {
  isFullPage: boolean;
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

  public static displayName = 'SPRING';

  constructor(props: ISpringContainerProps) {
    super(props);
    this.state = {
      isFullPage: false,
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
    const { height, springUrl, width } = this.props;
    const { isFullPage, postMessageData } = this.state;

    const attributes: IframeCommAttributes = {
      allowFullScreen: true,
      height: typeof height === 'number' ? height * 1.5 : parseInt(height, 10) * 1.5,
      src: springUrl,
      width: typeof width === 'number' ? width * 1.5 : parseInt(width, 10) * 1.5,
    };

    const targetOriginPieces = springUrl.split('/');

    const fillAvailableStyle = {
      height: '-webkit-fill-available',
      transformOrigin: 'top left',
      width: '-webkit-fill-available',
    };

    const style: React.CSSProperties = isFullPage
      ? {
          ...fillAvailableStyle,
          transformOrigin: 'top left',
        }
      : {
          ...fillAvailableStyle,
          transform: `scale(${2 / 3},${2 / 3})`,
        };

    const expandPercentage = isFullPage ? '165%' : '110%';

    return (
      <div style={{ height, width }}>
        <Card
          className={'spring-container'}
          style={{
            height: expandPercentage,
            maxHeight: 'unset',
            maxWidth: 'unset',
            padding: isFullPage ? 0 : '0 0 0 6px',
            width: expandPercentage,
          }}
        >
          {this.renderTopMenu()}
          <div style={style}>
            <IframeComm
              attributes={attributes}
              postMessageData={postMessageData}
              handleReady={this.onReady}
              handleReceiveMessage={this.onReceiveMessage}
              targetOrigin={`${targetOriginPieces[0]}//${targetOriginPieces[2]}`}
            />
          </div>
        </Card>
      </div>
    );
  }

  protected renderTopMenu = () => (
    <Menu secondary={true} style={{ margin: 0 }}>
      <Menu.Item position={'left'} fitted={'horizontally'}>
        <ReactSVG src={'assets/spring-icon.svg'} svgStyle={{ height: '32px', width: '32px' }} />
        {SpringContainerClass.displayName}
      </Menu.Item>
      <Menu.Item position={'right'} fitted={'horizontally'}>
        <Icon name={'expand arrows alternate'} onClick={this.onFullscreenEnable} />
        <Icon name={'settings'} />
      </Menu.Item>
    </Menu>
  );

  protected onReady = () => {
    return;
  };

  protected onFullscreenEnable = () => {
    this.setState({
      isFullPage: !this.state.isFullPage,
      postMessageData: {
        // type: 'resize',
      },
    });
  };

  protected onFullscreenChange = (isFullPage: boolean) => {
    this.setState({
      isFullPage,
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
