// ~bb-viz~
// Spring Container
// Responsible for communication with SPRING instance that lives inside an iFrame.
// ~bb-viz~

import { Set } from 'immutable';
import * as React from 'react';
// tslint:disable:import-name match-default-export-name
import IframeComm, { IframeCommAttributes } from 'react-iframe-comm';
import { bindActionCreators, Dispatch } from 'redux';

import { createContainerActions, createSpringActions, fetchSpringGraphData } from '~bioblocks-viz~/action';
import { ComponentCard, connectWithBBStore } from '~bioblocks-viz~/component';
import { BioblocksVisualization } from '~bioblocks-viz~/container';
import { IFrameEvent, ISpringGraphData, ISpringLink, ISpringNode, VIZ_TYPE } from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION, fetchSpringData } from '~bioblocks-viz~/helper';
import { createSpringReducer } from '~bioblocks-viz~/reducer';
import { getCategories, getGraphData, selectCurrentItems } from '~bioblocks-viz~/selector';

export interface ISpringContainerProps {
  categories: Set<string>;
  currentCells: Set<number>;
  datasetLocation: string;
  datasetsURI: string;
  headerHeight: number;
  iconSrc?: string;
  isFullPage: boolean;
  padding: number | string;
  selectedCategory: string;
  springGraphData: ISpringGraphData;
  springHeight: number;
  springSrc: string;
  springWidth: number;
  dispatchSpringFetch(fetchFn: () => Promise<ISpringGraphData>): void;
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
    currentCategory?: string;
    indices: number[];
    selectedLabel: string;
  };
}

export class SpringContainerClass extends BioblocksVisualization<ISpringContainerProps, ISpringContainerState> {
  public static defaultProps = {
    categories: Set<string>(),
    currentCells: Set<number>(),
    datasetLocation: '../datasets/hpc/full',
    datasetsURI: '',
    dispatchSpringFetch: EMPTY_FUNCTION,
    headerHeight: 0,
    isFullPage: false,
    padding: 0,
    selectedCategory: '',
    setCurrentCategory: EMPTY_FUNCTION,
    setCurrentCells: EMPTY_FUNCTION,
    springGraphData: {
      links: new Array<ISpringLink>(),
      nodes: new Array<ISpringNode>(),
    },
    springHeight: 1150,
    springSrc: `${window.location.origin}/${window.location.pathname.substr(
      0,
      window.location.pathname.lastIndexOf('/'),
    )}/SPRING/springViewer.html`,
    springWidth: 1150,
  };

  public static displayName = 'SPRING';

  constructor(props: ISpringContainerProps) {
    super(props);
    console.log('SpringContainer class');
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
    this.registerDataset('cells', []);
    this.registerDataset('labels', []);
  }

  public componentDidMount() {
    const { datasetLocation, datasetsURI, dispatchSpringFetch } = this.props;
    // TODO Investigate why window.location.href is necessary - difference in fetch path while page is loading?
    dispatchSpringFetch(async () => fetchSpringData(`${window.location.href}/${datasetsURI}/${datasetLocation}`));
  }

  public componentDidUpdate(prevProps: ISpringContainerProps, prevState: ISpringContainerState) {
    const { currentCells, datasetLocation } = this.props;
    if (currentCells !== prevProps.currentCells) {
      this.setState({
        postMessageData: {
          payload: {
            indices: currentCells.toArray(),
          },
          type: 'selected-cells-update',
        },
      });
    } else if (prevProps.datasetLocation !== datasetLocation) {
      const springUrl = this.generateSpringURL(datasetLocation);
      this.setState({
        springUrl,
      });
    }
  }

  public render() {
    const { headerHeight, iconSrc, isFullPage, springHeight, springWidth } = this.props;
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
        iconSrc={iconSrc}
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

  protected onReceiveMessage = (msg: IFrameEvent<VIZ_TYPE.SPRING>) => {
    const { currentCells, setCurrentCategory, setCurrentCells } = this.props;
    const data = msg.data;
    switch (data.type) {
      case 'selected-category-update':
      case 'selected-cells-update': {
        const { currentCategory, indices } = data.payload;
        setCurrentCategory(currentCategory ? currentCategory : '');
        setCurrentCells(indices);
        break;
      }
      case 'loaded': {
        this.setState({
          postMessageData: {
            payload: {
              indices: currentCells.toArray(),
            },
            type: 'init',
          },
        });
        break;
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

  protected generateSpringURL = (dataset: string) => `${this.props.springSrc}?../${dataset}`;
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  categories: getCategories(state, undefined),
  currentCells: selectCurrentItems<number>(state, 'cells'),
  springGraphData: getGraphData(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchSpringFetch: fetchSpringGraphData,
      setCurrentCategory: createSpringActions().category.set,
      setCurrentCells: createContainerActions<number>('cells').set,
    },
    dispatch,
  );

export const SpringContainer = connectWithBBStore(mapStateToProps, mapDispatchToProps, SpringContainerClass);
