import * as tf from '@tensorflow/tfjs';
import * as tsne from '@tensorflow/tfjs-tsne';
import * as d3 from 'd3';

import * as React from 'react';
import CellContext, { ICellContext, initialCellContext } from '../context/CellContext';
import { T_SNE_DATA_TYPE } from '../data/chell-data';

export interface ITComponentProps {
  cellContext: ICellContext;
  data: T_SNE_DATA_TYPE;
  height: number;
  padding: number | string;
  pointColor: string;
  width: number;
}

class TensorTComponentClass extends React.Component<ITComponentProps, any> {
  public static defaultProps: ITComponentProps = {
    cellContext: {
      ...initialCellContext,
    },
    data: [[0], [0]],
    height: 400,
    padding: 0,
    pointColor: '#000000',
    width: 400,
  };

  protected canvas: any = null;
  protected canvasContext: any = null;
  protected coordinates: any = null;

  constructor(props: ITComponentProps) {
    super(props);
  }

  public async componentDidMount() {
    const { height, pointColor, width } = this.props;

    // Create some data
    const tsneData = tf.randomUniform([2000, 10]);
    // Initialize the tsne optimizer
    const tsneOpt = tsne.tsne(tsneData);

    // Compute a T-SNE embedding, returns a promise.
    // Runs for 1000 iterations by default.
    await tsneOpt.compute(500);
    this.coordinates = tsneOpt.coordinates();

    this.canvas = d3
      .select('#TensorTComponentDiv')
      .append('canvas')
      .attr('width', width)
      .attr('height', height);

    this.canvasContext = this.canvas.node().getContext('2d');

    const embedder = tsne.tsne(tsneData);
    await embedder.iterateKnn(5);

    for (let i = 0; i < 5; i++) {
      await embedder.iterate(1); // You could also do a few more iterations in
      // between downloading the data for display
      const embeddedCoords = await embedder.coordsArray();

      const x = d3
        .scaleLinear()
        .range([0, width])
        .domain([0, 1]);
      const y = d3
        .scaleLinear()
        .range([0, height])
        .domain([0, 1]);

      this.canvasContext.clearRect(0, 0, width, height);
      embeddedCoords.forEach((d: any) => {
        this.canvasContext.font = '10px sans';
        this.canvasContext.fillStyle = pointColor;
        this.canvasContext.fillText('a', x(d[0]), y(d[1]));
      });

      await tf.nextFrame();
    }

    await tf.nextFrame();
    this.forceUpdate();
  }

  public render() {
    const { padding } = this.props;
    return <div id="TensorTComponentDiv" style={{ padding }} />;
  }
}

type requiredProps = Omit<ITComponentProps, keyof typeof TensorTComponentClass.defaultProps> &
  Partial<ITComponentProps>;

const TensorTComponent = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => <TensorTComponentClass {...props} cellContext={{ ...cellContext, ...props.cellContext }} />}
  </CellContext.Consumer>
);

export default TensorTComponent;
export { TensorTComponent };
