import { Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

// tslint:disable:import-name match-default-export-name
import IframeComm, { IframeCommAttributes } from 'react-iframe-comm';
// tslint:enable:import-name match-default-export-name

import { createContainerActions, createSpringActions } from '~chell-viz~/action';
import { ComponentCard } from '~chell-viz~/component';
import { ChellVisualization } from '~chell-viz~/container';
import { ISpringLink, ISpringNode } from '~chell-viz~/data';
import { createSpringReducer } from '~chell-viz~/reducer';
import { getCategories, selectCurrentItems } from '~chell-viz~/selector';

export interface ISpringContainerProps {
  categories: Set<string>;
  currentCells: Set<number>;
  datasetLocation: string;
  headerHeight: number;
  isFullPage: boolean;
  padding: number | string;
  selectedCategory: string;
  springHeight: number;
  springWidth: number;
  setCurrentCategory(category: string): void;
  setCurrentCells(cells: number[]): void;
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

export class SpringContainerClass extends ChellVisualization<ISpringContainerProps, ISpringContainerState> {
  public static defaultProps = {
    categories: Set<string>(),
    currentCells: Set<number>(),
    data: {
      links: new Array<ISpringLink>(),
      nodes: new Array<ISpringNode>(),
    },
    datasetLocation: 'hpc/full',
    headerHeight: 18,
    isFullPage: false,
    padding: 0,
    selectedCategory: '',
    setCurrentCategory: () => {
      return;
    },
    setCurrentCells: () => {
      return;
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

  public setupDataServices() {
    createSpringReducer();
  }

  public componentDidUpdate(prevProps: ISpringContainerProps, prevState: ISpringContainerState) {
    const { currentCells } = this.props;
    if (currentCells !== prevProps.currentCells) {
      this.setState({
        postMessageData: {
          payload: {
            indices: currentCells.toArray(),
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
    const { categories, currentCells, setCurrentCategory, setCurrentCells } = this.props;
    const data = msg.data as ISpringMessage;
    switch (data.type) {
      case 'selected-category-update':
      case 'selected-cells-update': {
        setCurrentCategory(data.payload.currentCategory);
        setCurrentCells(data.payload.indices);
        break;
      }
      case 'loaded': {
        setCurrentCategory(categories.first());
        this.setState({
          postMessageData: {
            payload: {
              indices: currentCells.toArray(),
            },
            type: 'init',
          },
        });
      }
      default: {
        if (msg.isTrusted && Object.keys(msg).length === 1) {
          return;
        } else {
          console.log(`Got this msg for ya: ${JSON.stringify(msg)}`);
        }
      }
    }
  };

  protected generateSpringURL = (dataset: string) =>
    `${window.location.origin}/${window.location.pathname.substr(
      0,
      window.location.pathname.lastIndexOf('/'),
    )}/springViewer.html?datasets/${dataset}`;
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  categories: getCategories(state, undefined),
  currentCells: selectCurrentItems<number>(state, 'cells'),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setCurrentCategory: createSpringActions().category.set,
      setCurrentCells: createContainerActions<number>('cells').set,
    },
    dispatch,
  );

export const SpringContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpringContainerClass);
