import * as d3 from 'd3';
import * as React from 'react';

import { ISpringGraphData } from 'spring';
import { SpringComponent } from '../component/SpringComponent';

export interface ISpringContainerState {
  data: ISpringGraphData;
}

export class SpringContainer extends React.Component<any, ISpringContainerState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      data: {
        links: [],
        nodes: [],
      },
    };
  }

  public async componentDidMount() {
    const coordinateText: string = await d3.text('assets/centroids/coordinates.txt');

    const coordinates: number[][] = [];
    coordinateText!.split('\n').forEach((entry, index, array) => {
      const items = entry.split(',');
      if (items.length >= 3) {
        const xx = parseFloat(items[1].trim());
        const yy = parseFloat(items[2].trim());
        const nn = parseInt(items[0].trim(), 10);
        coordinates[nn] = [xx, yy];
      }
    });

    const data: ISpringGraphData = (await d3.json('assets/centroids/graph_data.json')) as ISpringGraphData;
    if (!data.nodes || !data.links) {
      throw new Error('Unable to parse graph_data - does it have node key(s)?');
    }
    const nodeDict: any = {};
    data.nodes.forEach(node => {
      nodeDict[node.number] = node;
      if (node.number in coordinates) {
        node.fixed = true;
        node.x = coordinates[node.number][0];
        node.y = coordinates[node.number][1];
      }
    });

    data.links.forEach(link => {
      link.source = nodeDict[link.source as string];
      link.target = nodeDict[link.target as string];
    });

    this.setState({
      data,
    });
  }

  public render() {
    return <SpringComponent data={this.state.data} />;
  }
}
