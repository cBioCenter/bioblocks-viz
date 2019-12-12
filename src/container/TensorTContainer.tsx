import * as tensorFlow from '@tensorflow/tfjs-core';
// tslint:disable-next-line:no-submodule-imports
import { TSNE } from '@tensorflow/tfjs-tsne/dist/tsne';
import { Set } from 'immutable';
import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Icon, Radio } from 'semantic-ui-react';

import { createContainerActions } from '~bioblocks-viz~/action';
import { ComponentCard, connectWithBBStore, TensorTComponent } from '~bioblocks-viz~/component';
import { BioblocksVisualization } from '~bioblocks-viz~/container';
import {
  BIOBLOCKS_CSS_STYLE,
  BioblocksChartEvent,
  BioblocksWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  IPlotlyData,
} from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION, fetchTensorTSneCoordinateData } from '~bioblocks-viz~/helper';
import { selectCurrentItems } from '~bioblocks-viz~/selector/ContainerSelectors';

export interface ITensorContainerProps {
  currentCells: Set<number>;
  datasetLocation: string;
  height: number | string | undefined;
  iconSrc?: string;
  isFullPage: boolean;
  pointColor: string;
  style: BIOBLOCKS_CSS_STYLE;
  setCurrentCells(cells: number[]): void;
}

export interface ITensorContainerState {
  coordsArray: number[][];
  isAnimating: boolean;
  isComputing: boolean;
  numIterations: number;
  tsne?: TSNE;
  plotlyCoords: Array<Partial<IPlotlyData>>;
}

export class TensorTContainerClass extends BioblocksVisualization<ITensorContainerProps, ITensorContainerState> {
  public static defaultProps = {
    currentCells: Set<number>(),
    datasetLocation: 'hpc/full',
    height: '525px',
    isFullPage: false,
    pointColor: '#aa0000',
    setCurrentCells: EMPTY_FUNCTION,
    style: {
      padding: 0,
    },
    width: 400,
  };

  public static displayName = 'tSNE - TensorFlow';

  protected canvasContext: CanvasRenderingContext2D | null = null;

  constructor(props: ITensorContainerProps) {
    super(props);
    this.state = {
      coordsArray: [],
      isAnimating: false,
      isComputing: false,
      numIterations: 0,
      plotlyCoords: [],
    };
  }

  public setupDataServices() {
    this.registerDataset('cells', []);
  }

  public async componentDidMount() {
    try {
      const tensorData = await fetchTensorTSneCoordinateData(this.props.datasetLocation);
      const tsneData = tensorFlow.tensor(tensorData);
      // Initialize the tsne optimizer
      const tsne = (await import('@tensorflow/tfjs-tsne')).tsne(tsneData);
      this.setState({
        tsne,
      });
      await this.computeTensorTsne(this.state.numIterations);
    } catch (e) {
      console.log(e);
    }
  }

  public async componentDidUpdate(prevProps: ITensorContainerProps) {
    const { currentCells, datasetLocation } = this.props;
    const { tsne } = this.state;
    if (datasetLocation !== prevProps.datasetLocation) {
      await this.setupTensorData();
    } else if (tsne) {
      if (currentCells !== prevProps.currentCells) {
        this.setState({
          plotlyCoords: this.getPlotlyCoordsFromTsne(await tsne.coordsArray()),
        });
      }
    }
  }

  public render() {
    const { height, iconSrc, isFullPage } = this.props;
    const { plotlyCoords } = this.state;

    return (
      <ComponentCard
        componentName={TensorTContainerClass.displayName}
        iconSrc={iconSrc}
        isFullPage={isFullPage}
        height={height}
      >
        <Grid centered={true} style={{ height: '100%', marginLeft: 0, width: '100%' }}>
          {this.renderPlaybackControls()}
          <Grid.Row style={{ height: `calc(100% - 3px)`, margin: 0 }}>
            <TensorTComponent onSelectedCallback={this.handlePointSelection} pointsToPlot={plotlyCoords} />
          </Grid.Row>
        </Grid>
      </ComponentCard>
    );
  }

  protected async computeTensorTsne(numIterations: number) {
    const { isComputing, tsne } = this.state;
    if (tsne && !isComputing) {
      this.setState({
        isComputing: true,
      });
      await tsne.compute(numIterations);
      const coordsArray = await tsne.coordsArray();
      const plotlyCoords = this.getPlotlyCoordsFromTsne(coordsArray);
      this.setState({
        coordsArray,
        isComputing: false,
        numIterations,
        plotlyCoords,
      });
    }
  }

  protected getPlotlyCoordsFromTsne = (coords: number[][]): Array<Partial<IPlotlyData>> => {
    const { currentCells, pointColor } = this.props;

    return [
      {
        marker: {
          color: pointColor,
        },
        mode: 'markers',
        type: 'scattergl',
        x: coords.map(coord => coord[0]),
        y: coords.map(coord => coord[1]),
      },
      {
        marker: {
          color: this.props.pointColor,
          line: {
            color: '#ffaa00',
            width: 2,
          },
        },
        mode: 'markers',
        type: 'scattergl',
        x: currentCells.toArray().map(cellIndex => coords[cellIndex][0]),
        y: currentCells.toArray().map(cellIndex => coords[cellIndex][1]),
      },
    ];
  };

  protected getPlotlyCoordsFromSpring = (coords: number[][], currentCells: number[]): Array<Partial<IPlotlyData>> => {
    return [
      {
        marker: {
          color: this.props.pointColor,
        },
        mode: 'markers',
        type: 'scattergl',
        x: coords.map(coord => coord[0]),
        y: coords.map(coord => coord[1]),
      },
      {
        marker: {
          color: this.props.pointColor,
          line: {
            color: '#ffaa00',
            width: 2,
          },
        },
        mode: 'markers',
        type: 'scattergl',
        x: currentCells.map(cellIndex => coords[cellIndex][0]),
        y: currentCells.map(cellIndex => coords[cellIndex][1]),
      },
    ];
  };

  protected getTensorConfigs = (): BioblocksWidgetConfig[] => [
    {
      name: 'Iterate Once',
      onClick: this.onIterateForward(),
      type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
    },
    {
      name: 'Iterate Ten Times',
      onClick: this.onIterateForward(10),
      type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
    },
    {
      name: 'Iterate Fifty Times',
      onClick: this.onIterateForward(50),
      type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
    },
    {
      name: 'Reset',
      onClick: this.onReset(),
      type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
    },
    {
      icon: 'hashtag',
      name: `Total Iterations: ${this.state.numIterations}`,
      type: CONFIGURATION_COMPONENT_TYPE.LABEL,
    },
  ];

  protected handlePointSelection = (event: BioblocksChartEvent) => {
    const { setCurrentCells } = this.props;
    const { coordsArray } = this.state;
    const selectedCells = new Array<number>();
    for (let i = 0; i < event.selectedPoints.length - 1; i += 2) {
      const x = event.selectedPoints[i];
      const y = event.selectedPoints[i + 1];
      const cellIndex = coordsArray.findIndex(coord => coord[0] === x && coord[1] === y);
      if (cellIndex >= 0) {
        selectedCells.push(cellIndex);
      }
    }

    setCurrentCells(selectedCells);
  };

  protected renderIterateLabel = () => <label>{`iterations: ${this.state.numIterations}`}</label>;

  /**
   * Renders the radio button responsible for toggling the animation on/off.
   */
  protected renderIterateButton = () => (
    <Radio
      label={<label style={{ fontSize: '14px', fontWeight: 'bold' }}>iterate</label>}
      onClick={this.onIterationToggle()}
      toggle={true}
    />
  );

  protected renderResetButton = () => <Icon name={'undo'} onClick={this.onReset()} />;

  protected onIterateForward = (amount: number = 1) => async () => {
    const { isComputing, tsne } = this.state;
    if (tsne && !isComputing) {
      this.setState({
        isComputing: true,
      });
      await tsne.iterate(amount);
      const coordsArray = await tsne.coordsArray();
      const plotlyCoords = this.getPlotlyCoordsFromTsne(coordsArray);
      this.setState({
        coordsArray,
        isComputing: false,
        numIterations: this.state.numIterations + amount,
        plotlyCoords,
      });
    }
  };

  protected onIterationToggle = () => () => {
    const isAnimating = !this.state.isAnimating;

    if (isAnimating) {
      const animationFrame = async () => {
        await this.onIterateForward(1)();
        if (this.state.isAnimating && this.state.numIterations < 500) {
          requestAnimationFrame(animationFrame);
        } else {
          this.setState({ isAnimating: false });
        }
      };
      requestAnimationFrame(animationFrame);
    }
    this.setState({ isAnimating });
  };

  protected onReset = () => async () => {
    await this.computeTensorTsne(0);
  };

  protected renderPlaybackControls = () => {
    return (
      <Grid.Row columns={'equal'} style={{ maxHeight: '42px', padding: '14px 0 0 0' }}>
        <Grid.Column floated={'left'}>{this.renderIterateButton()}</Grid.Column>
        <Grid.Column>{this.renderIterateLabel()}</Grid.Column>
        <Grid.Column floated={'right'}>{this.renderResetButton()}</Grid.Column>
      </Grid.Row>
    );
  };

  protected async setupTensorData() {
    try {
      this.setState({
        isAnimating: false,
        isComputing: true,
        plotlyCoords: [],
        tsne: undefined,
      });

      const tensorData = await fetchTensorTSneCoordinateData(this.props.datasetLocation);
      const tsneData = tensorFlow.tensor(tensorData);
      const tsne = new TSNE(tsneData);
      const numIterations = 0;
      await tsne.compute(numIterations);
      const coordsArray = await tsne.coordsArray();
      const plotlyCoords = this.getPlotlyCoordsFromTsne(coordsArray);

      this.setState({
        coordsArray,
        isComputing: false,
        numIterations,
        plotlyCoords,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  currentCells: selectCurrentItems<number>(state, 'cells'),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setCurrentCells: createContainerActions<number>('cells').set,
    },
    dispatch,
  );

export const TensorTContainer = connectWithBBStore(mapStateToProps, mapDispatchToProps, TensorTContainerClass);
