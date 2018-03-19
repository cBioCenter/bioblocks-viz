import * as d3 from 'd3';
import { ForceLink } from 'd3';
import * as React from 'react';

export interface ISpringComponentState {
  data?: {
    nodes: any[];
    links: any[];
  };
}

export class SpringComponent extends React.Component<any, ISpringComponentState> {
  private canvas: HTMLCanvasElement | null = null;
  private renderingContext: CanvasRenderingContext2D | null = null;
  private height = 0;
  private width = 0;

  constructor(props: any) {
    super(props);
    this.state = {
      data: undefined,
    };
  }

  public async componentDidMount() {
    this.renderingContext = this.canvas!.getContext('2d');
    if (!this.renderingContext) {
      throw new Error('Unable to get rendering context! Does the browser support WebGL?');
    }
    const { canvas, renderingContext } = this;

    const data: any = await d3.json('assets/centroids/graph_data.json');
    const text: string = await d3.text('assets/centroids/coordinates.txt');

    const coordinates: any = [];
    text.split('\n').forEach((entry, index, array) => {
      const items = entry.split(',');
      if (items.length >= 3) {
        const xx = parseFloat(items[1].trim());
        const yy = parseFloat(items[2].trim());
        const nn = parseInt(items[0].trim(), 10);
        coordinates[nn] = [xx, yy];
      }
    });

    const nodeGraph = data;

    const nodeDict: any = {};
    data.nodes.forEach((d: any) => {
      nodeDict[d.number] = d;
      if (d.number in coordinates) {
        d.fixed = true;
        d.x = coordinates[d.number][0];
        d.y = coordinates[d.number][1];
      }
    });

    data.links.forEach((d: any) => {
      d.source = nodeDict[d.source];
      d.target = nodeDict[d.target];
    });

    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .id((d: any) => d.id)
          .distance(4)
          .strength(2),
      )
      .force('charge', d3.forceManyBody().strength(-5))
      .force('center', d3.forceCenter())
      .velocityDecay(0.95);

    const d3Canvas: any = d3.select('canvas');
    const radius = 5;

    this.renderingContext = canvas!.getContext('2d');
    this.height = canvas!.height;
    this.width = canvas!.width;

    const zoomed = () => {
      console.log('Zooming ? ' + d3.event.transform.k);
      renderingContext.save();
      renderingContext.clearRect(0, 0, canvas!.width, canvas!.height);
      renderingContext.translate(d3.event.transform.x, d3.event.transform.y);
      renderingContext.scale(d3.event.transform.k, d3.event.transform.k);

      drawGraph();

      renderingContext.restore();
    };

    d3Canvas.call(
      d3
        .zoom()
        .scaleExtent([1 / 2, 4])
        .on('zoom', zoomed),
    );

    const drawLink = (d: any) => {
      renderingContext.moveTo(d.source.x, d.source.y);
      renderingContext.lineTo(d.target.x, d.target.y);
    };

    const drawNode = (d: any) => {
      renderingContext.moveTo(d.x + 3, d.y);
      renderingContext.arc(d.x, d.y, radius, 0, 2 * Math.PI);
    };

    const drawGraph = () => {
      renderingContext.beginPath();

      data.links.forEach(drawLink);
      renderingContext.strokeStyle = '#aaa';
      renderingContext.stroke();

      renderingContext.beginPath();
      data.nodes.forEach(drawNode);
      renderingContext.fill();
      renderingContext.strokeStyle = '#fff';
      renderingContext.stroke();
    };

    const ticked = () => {
      renderingContext.clearRect(0, 0, this.width, this.height);
      renderingContext.save();
      renderingContext.translate(this.width / 2, this.height / 2);
      const scale = 0.5;
      renderingContext.scale(scale, scale);

      drawGraph();

      renderingContext.restore();
    };

    simulation.nodes(data.nodes).on('tick', ticked);
    const force: ForceLink<any, any> | undefined = simulation.force('link');
    if (force) {
      force.links(data.links);
    }

    this.setState({
      data,
    });
  }

  public render() {
    return (
      <div id="SpringComponent">
        <canvas ref={el => (this.canvas = el)} style={{ width: 800, height: 600 }} />
      </div>
    );
  }
}
