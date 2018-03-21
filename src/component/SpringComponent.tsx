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

  private svg?: d3.Selection<SVGSVGElement | null, {}, null, undefined>;
  private link?: d3.Selection<d3.BaseType, ISpringLink, d3.BaseType, {}>;
  private node?: d3.Selection<d3.BaseType, ISpringNode, d3.BaseType, {}>;

  private height = 400;
  private width = 400;

  constructor(props: any) {
    super(props);
  }

  public componentWillReceiveProps(nextProps: ISpringComponentProps) {
    const isNewData = nextProps && nextProps.data !== this.props.data;
    if (isNewData) {
      const { data } = nextProps;

      if (!this.svg) {
        throw new Error('Unable to get svg element!');
      }

      this.link = this.svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke-width', 1)
        .attr('stroke', d => '#000000');

      this.node = this.svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', d => '#660000')
        .attr('opacity', 0.6);

      this.instantiateSimulation(data);
    }
  }

  public render() {
    const style = { width: this.width, height: this.height };
    return (
      <div id="SpringComponent" style={style}>
        {<svg ref={el => (this.svg = d3.select(el))} style={style} />}
      </div>
    );
  }

  private instantiateSimulation(data: ISpringGraphData): void {
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
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .velocityDecay(0.95);
    simulation.nodes(data.nodes).on('tick', () => this.ticked());
    const force: ForceLink<any, any> | undefined = simulation.force('link');
    if (force) {
      force.links(data.links);
    }
  }

  private ticked(): void {
    this.link!.attr('x1', d => {
      return (d.source as ISpringNode).x;
    })
      .attr('y1', d => {
        return (d.source as ISpringNode).y;
      })
      .attr('x2', d => {
        return (d.target as ISpringNode).x;
      })
      .attr('y2', d => {
        return (d.target as ISpringNode).y;
      });

    this.node!.attr('cx', d => {
      return d.x;
    }).attr('cy', d => {
      return d.y;
    });
  }
}
