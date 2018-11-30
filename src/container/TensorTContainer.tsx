import { isEqual } from 'lodash';
import * as React from 'react';

import * as tensorFlow from '@tensorflow/tfjs-core';
// tslint:disable-next-line:no-submodule-imports
import { TSNE } from '@tensorflow/tfjs-tsne/dist/tsne';
import { Grid, Icon, Radio } from 'semantic-ui-react';
import { ComponentCard, TensorTComponent } from '~chell-viz~/component';
import {
  CellContext,
  ICellContext,
  initialCellContext,
  initialSpringContext,
  ISpringContext,
  SpringContext,
} from '~chell-viz~/context';
import {
  CHELL_CSS_STYLE,
  ChellChartEvent,
  ChellWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  IPlotlyData,
} from '~chell-viz~/data';
import { fetchTensorTSneCoordinateData } from '~chell-viz~/helper';

export interface ITensorContainerProps {
  cellContext: ICellContext;
  datasetLocation: string;
  isFullPage: boolean;
  pointColor: string;
  springContext: ISpringContext;
  style: CHELL_CSS_STYLE;
}

export interface ITensorContainerState {
  coordsArray: number[][];
  isAnimating: boolean;
  isComputing: boolean;
  numIterations: number;
  tsne?: TSNE;
  plotlyCoords: Array<Partial<IPlotlyData>>;
}

export class TensorTContainerClass extends React.Component<ITensorContainerProps, ITensorContainerState> {
  public static defaultProps = {
    cellContext: {
      ...initialCellContext,
    },
    datasetLocation: 'hpc/full',
    height: 400,
    isFullPage: false,
    pointColor: '#aa0000',
    springContext: {
      ...initialSpringContext,
    },
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

  public async componentDidMount() {
    try {
      const tensorData = await fetchTensorTSneCoordinateData(`datasets/${this.props.datasetLocation}`);
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
    const { cellContext, springContext } = this.props;
    const { tsne } = this.state;
    if (tsne) {
      if (this.props.datasetLocation !== prevProps.datasetLocation) {
        await this.setupTensorData();
      } else if (cellContext.currentCells !== prevProps.cellContext.currentCells) {
        this.setState({
          plotlyCoords: this.getPlotlyCoordsFromTsne(await tsne.coordsArray()),
        });
      } else if (!isEqual(springContext.selectedCategories, prevProps.springContext.selectedCategories)) {
        const indices = new Array<number>();
        for (let i = 0; i < springContext.graphData.nodes.length; ++i) {
          if (springContext.selectedCategories.includes(springContext.graphData.nodes[i].category)) {
            indices.push(i);
          }
        }

        this.setState({
          plotlyCoords: this.getPlotlyCoordsFromSpring(await tsne.coordsArray(), indices),
        });
      }
    }
  }

  public render() {
    const { isFullPage, style } = this.props;
    const { plotlyCoords } = this.state;

    return (
      <ComponentCard
        componentName={TensorTContainerClass.displayName}
        iconSrc={'assets/icons/tfjs-tsne-icon.png'}
        isFullPage={isFullPage}
      >
        <Grid centered={true} style={{ marginLeft: 0, width: '100%' }}>
          <Grid.Row columns={'equal'} style={{ maxHeight: '23px' }}>
            <Grid.Column floated={'left'}>{this.renderIterateButton()}</Grid.Column>
            <Grid.Column>{this.renderIterateLabel()}</Grid.Column>
            <Grid.Column floated={'right'}>{this.renderResetButton()}</Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ height: '5%' }}>
            <Grid.Column>
              <TensorTComponent
                onSelectedCallback={this.handlePointSelection}
                pointsToPlot={plotlyCoords}
                style={style}
              />
            </Grid.Column>
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
    const { cellContext } = this.props;

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
          color: '#ffaa00',
        },
        mode: 'markers',
        type: 'scattergl',
        x: cellContext.currentCells.map(cellIndex => coords[cellIndex][0]),
        y: cellContext.currentCells.map(cellIndex => coords[cellIndex][1]),
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
          color: '#ffaa00',
        },
        mode: 'markers',
        type: 'scattergl',
        x: currentCells.map(cellIndex => coords[cellIndex][0]),
        y: currentCells.map(cellIndex => coords[cellIndex][1]),
      },
    ];
  };

  protected getTensorConfigs = (): ChellWidgetConfig[] => [
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

  protected handlePointSelection = (event: ChellChartEvent) => {
    const { cellContext } = this.props;
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
    cellContext.addCells(selectedCells);
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

  protected async setupTensorData() {
    try {
      const tensorData = await fetchTensorTSneCoordinateData(`datasets/${this.props.datasetLocation}`);
      const tsneData = tensorFlow.tensor(tensorData);
      this.setState({
        tsne: new TSNE(tsneData),
      });
      await this.computeTensorTsne(this.state.numIterations);
    } catch (e) {
      console.log(e);
    }
  }
}

type requiredProps = Omit<ITensorContainerProps, keyof typeof TensorTContainerClass.defaultProps> &
  Partial<ITensorContainerProps>;

export const TensorTContainer = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => (
      <SpringContext.Consumer>
        {springContext => <TensorTContainerClass {...props} cellContext={cellContext} springContext={springContext} />}
      </SpringContext.Consumer>
    )}
  </CellContext.Consumer>
);
