import * as React from 'react';

// tslint:disable-next-line:no-submodule-imports
import { TSNE } from '@tensorflow/tfjs-tsne/dist/tsne';
import { Button, Icon } from 'semantic-ui-react';
import { SettingsPanel, TensorTComponent } from '~chell-viz~/component';
import { CellContext, ICellContext, initialCellContext } from '~chell-viz~/context';
import {
  CHELL_CSS_STYLE,
  ChellChartEvent,
  ChellWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  IPlotlyData,
  T_SNE_DATA_TYPE,
} from '~chell-viz~/data';

export interface ITensorContainerProps {
  cellContext: ICellContext;
  data: T_SNE_DATA_TYPE;
  height: number;
  pointColor: string;
  style: CHELL_CSS_STYLE;
  width: number;
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
    data: [[0], [0]],
    height: 400,
    pointColor: '#aa0000',
    style: {
      padding: 0,
    },
    width: 400,
  };

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
    const tensorFlow = await import('@tensorflow/tfjs-core');
    const tsneData = tensorFlow.tensor(this.props.data);
    // Initialize the tsne optimizer
    const tsne = (await import('@tensorflow/tfjs-tsne')).tsne(tsneData);
    this.setState({
      tsne,
    });
    await this.computeTensorTsne(this.state.numIterations);
  }

  public async componentDidUpdate(prevProps: ITensorContainerProps) {
    const { tsne } = this.state;
    if (this.props.cellContext.currentCells !== prevProps.cellContext.currentCells && tsne) {
      this.setState({
        plotlyCoords: this.getPlotlyCoordsFromTsne(await tsne.coordsArray()),
      });
    }
  }

  public render() {
    const { height, style, width } = this.props;
    const { plotlyCoords } = this.state;

    return (
      <div id="TensorTContainerDiv" style={style}>
        {this.renderPlaybackButtons()}
        <SettingsPanel configurations={this.getTensorConfigs()} opacity={0.8}>
          <TensorTComponent
            height={height}
            onSelectedCallback={this.handlePointSelection}
            pointsToPlot={plotlyCoords}
            style={style}
            width={width}
          />
        </SettingsPanel>
      </div>
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

  protected renderPlaybackButtons = () =>
    this.state.isAnimating ? (
      <Button compact={true} onClick={this.onPauseAnimation()}>
        <Icon name={'pause'} />
        Pause
      </Button>
    ) : (
      <Button compact={true} onClick={this.onPlayIteration()}>
        <Icon name={'play'} />
        Play
      </Button>
    );

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

  protected onPauseAnimation = () => () => {
    this.setState({ isAnimating: false });
  };

  protected onPlayIteration = () => async () => {
    const animationFrame = async () => {
      const { isAnimating, numIterations } = this.state;
      await this.onIterateForward(1)();
      if (isAnimating && numIterations < 500) {
        requestAnimationFrame(animationFrame);
      } else {
        this.setState({ isAnimating: false });
      }
    };

    this.setState({ isAnimating: true });
    requestAnimationFrame(animationFrame);
  };

  protected onReset = () => async () => {
    await this.computeTensorTsne(0);
  };
}

type requiredProps = Omit<ITensorContainerProps, keyof typeof TensorTContainerClass.defaultProps> &
  Partial<ITensorContainerProps>;

export const TensorTContainer = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => <TensorTContainerClass {...props} cellContext={cellContext} />}
  </CellContext.Consumer>
);
