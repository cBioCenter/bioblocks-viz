import * as d3 from 'd3';
import { ForceLink } from 'd3';
import * as React from 'react';
import { ISpringGraphData, ISpringLink, ISpringNode } from 'spring';

export interface ISpringComponentProps {
  data: ISpringGraphData;
}

export class SpringComponent extends React.Component<ISpringComponentProps, any> {
  public static defaultProps: Partial<ISpringComponentProps> = {
    data: {
      links: [],
      nodes: [],
    },
  };

  private canvas: HTMLCanvasElement | null = null;
  private svg: SVGSVGElement | null = null;
  private graph: SVGGElement | null = null;
  private svgLink: SVGGElement | null = null;
  private svgNode: SVGGElement | null = null;
  private height = 0;
  private width = 0;

  // @ts-ignore: Property has no initializer and is not definitely assigned in the constructor.
  private renderingContext: CanvasRenderingContext2D;

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    if (!this.canvas) {
      throw new Error('Unable to get canvas! Does the browser support WebGL?');
    }

    this.height = this.canvas.height;
    this.width = this.canvas.width;

    const context = this.canvas!.getContext('2d');
    if (!context) {
      throw new Error('Unable to get rendering context! Does the browser support WebGL?');
    }
    this.renderingContext = context;
  }

  public componentWillReceiveProps(nextProps: ISpringComponentProps) {
    const isNewData = nextProps && nextProps.data !== this.props.data;
    if (isNewData) {
      const { canvas, renderingContext } = this;
      const { data } = nextProps;
      const d3Canvas: any = d3.select('canvas');
      d3Canvas.call(
        d3
          .zoom()
          .scaleExtent([1 / 2, 4])
          .on('zoom', () => this.onZoom(renderingContext)),
      );

      this.instantiateSimulation(renderingContext, data);
    }
  }

  public render() {
    return (
      <div id="SpringComponent">
        {<canvas ref={el => (this.canvas = el)} style={{ width: 800, height: 600 }} />}
        {/*
          <svg ref={el => (this.svg = el)} style={{ width: 800, height: 600 }}>
            <g ref={el => (this.graph = el)} style={{ width: 700, height: 50 }}>
              <g ref={el => (this.svgLink = el)} className="link" />
              <g ref={el => (this.svgNode = el)} className="node" />
            </g>
          </svg>
        */}
      </div>
    );
  }

  private instantiateSimulation(context: CanvasRenderingContext2D, data: ISpringGraphData): void {
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
    simulation.nodes(data.nodes).on('tick', () => this.ticked(context));
    const force: ForceLink<any, any> | undefined = simulation.force('link');
    if (force) {
      force.links(data.links);
    }
  }

  private drawLink(context: CanvasRenderingContext2D, link: ISpringLink): void {
    const source = link.source as ISpringNode;
    const target = link.target as ISpringNode;
    context.moveTo(source.x, source.y);
    context.lineTo(target.x, target.y);
  }

  private drawNode(context: CanvasRenderingContext2D, node: ISpringNode): void {
    const radius = 5;
    context.moveTo(node.x + 3, node.y);
    context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
  }

  private drawGraph(context: CanvasRenderingContext2D): void {
    const { data } = this.props;
    context.beginPath();

    data.links.forEach(link => this.drawLink(context, link));
    context.strokeStyle = '#aaa';
    context.stroke();

    context.beginPath();
    data.nodes.forEach(node => this.drawNode(context, node));
    context.fill();
    context.strokeStyle = '#fff';
    context.stroke();
  }

  private ticked(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, this.width, this.height);
    context.save();
    context.translate(this.width / 2, this.height / 2);

    this.drawGraph(context);

    context.restore();
  }

  private onZoom(context: CanvasRenderingContext2D): void {
    const { canvas } = this;
    context.save();
    context.clearRect(0, 0, canvas!.width, canvas!.height);
    context.translate(d3.event.transform.x, d3.event.transform.y);
    context.scale(d3.event.transform.k, d3.event.transform.k);

    this.drawGraph(context);

    context.restore();
  }
}
