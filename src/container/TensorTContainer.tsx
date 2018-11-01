import * as React from 'react';

// tslint:disable-next-line:no-submodule-imports
import { TSNE } from '@tensorflow/tfjs-tsne/dist/tsne';
import { SettingsPanel, TensorTComponent } from '~chell-viz~/component';
import { CellContext, ICellContext, initialCellContext } from '~chell-viz~/context';
import {
  CHELL_CSS_STYLE,
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
  isComputing: boolean;
  numIterations: number;
  tsne?: TSNE;
  plotlyCoords: Array<Partial<IPlotlyData>>;
}

class TensorTContainerClass extends React.Component<ITensorContainerProps, ITensorContainerState> {
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

  public render() {
    const { height, style, width } = this.props;
    const { plotlyCoords } = this.state;

    return (
      <div id="TensorTContainerDiv" style={style}>
        <SettingsPanel configurations={this.getTensorConfigs()} opacity={0.8}>
          <TensorTComponent height={height} pointsToPlot={plotlyCoords} style={style} width={width} />
        </SettingsPanel>
      </div>
    );
  }

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
      name: `Total Iterations: ${this.state.numIterations}`,
      type: CONFIGURATION_COMPONENT_TYPE.LABEL,
    },
  ];

  protected onIterateForward = (amount: number = 1) => async () => {
    const { isComputing, tsne } = this.state;
    if (tsne && !isComputing) {
      this.setState({
        isComputing: true,
      });
      await tsne.iterate(amount);
      const plotlyCoords = await this.getPlotlyCoordsFromTsne(tsne);
      this.setState({
        isComputing: false,
        numIterations: this.state.numIterations + amount,
        plotlyCoords,
      });
    }
  };

  protected onReset = () => async () => {
    await this.computeTensorTsne(0);
  };

  protected onNumIterationsChange = () => async (numIterations: number) => {
    await this.computeTensorTsne(numIterations);
  };

  protected async computeTensorTsne(numIterations: number) {
    const { isComputing, tsne } = this.state;
    if (tsne && !isComputing) {
      this.setState({
        isComputing: true,
      });
      await tsne.compute(numIterations);
      const plotlyCoords = await this.getPlotlyCoordsFromTsne(tsne);
      this.setState({
        isComputing: false,
        numIterations,
        plotlyCoords,
      });
    }
  }

  protected getPlotlyCoordsFromTsne = async (tsne: TSNE): Promise<Array<Partial<IPlotlyData>>> => {
    const coords = await tsne.coordsArray();

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
    ];
  };
}

type requiredProps = Omit<ITensorContainerProps, keyof typeof TensorTContainerClass.defaultProps> &
  Partial<ITensorContainerProps>;

export const TensorTContainer = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => <TensorTContainerClass {...props} cellContext={{ ...cellContext, ...props.cellContext }} />}
  </CellContext.Consumer>
);
