import { IContactMapChartData } from '../component/chart/ContactMapChart';
import { IPlotlyData, PLOTLY_CHART_TYPE } from '../component/chart/PlotlyChart';

/**
 * Generate data in the expected format for a WebGL Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param nodeSize How big to make the nodes on the graph?
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export const generateScatterGLData = (
  entry: IContactMapChartData,
  nodeSize: number,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => ({
  ...generateScatterData(entry, nodeSize, mirrorPoints),
  type: PLOTLY_CHART_TYPE.scattergl,
});

/**
 * Generate data in the expected format for a Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param nodeSize How big to make the nodes on the graph?
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export const generateScatterData = (
  entry: IContactMapChartData,
  nodeSize: number,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => {
  const { marker, name, points } = entry;
  const xValues = points.map(data => data.i);
  const yValues = points.map(data => data.j);
  const zValues = points.map(data => data.dist);
  return {
    hoverinfo: 'none',
    marker: Object.assign(
      {
        color: mirrorPoints ? zValues.concat(zValues) : zValues,
        size: nodeSize * 2,
      },
      marker,
    ),
    mode: 'markers',
    name,
    type: PLOTLY_CHART_TYPE.scatter,
    x: mirrorPoints ? [...xValues, ...yValues] : xValues,
    y: mirrorPoints ? [...yValues, ...xValues] : yValues,
    z: mirrorPoints ? [...zValues, ...zValues] : zValues,
  };
};

export const generateFloat32ArrayFromContacts = (array: Array<{ i: number; j: number }>) => {
  const result = new Float32Array(array.length * 2);
  array.forEach((item, index) => {
    result[index * 2] = item.i;
    result[index * 2 + 1] = item.j;
  });
  return result;
};

/**
 * Generate data in the expected format for a Plotly PointCloud.
 *
 * @param entry A unit of Plotly data containing points, color, and any extras.
 * @param nodeSize Sets min/max to nodeSize/nodeSize * 2.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @param [extra] Explicit extra configuration to add / replace the default data configuration with.
 * @returns Data suitable for consumption by Plotly.
 */
export const generatePointCloudData = (
  entry: IContactMapChartData,
  nodeSize: number,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => {
  const { points } = entry;
  const coords = generateFloat32ArrayFromContacts(points);
  return {
    marker: {
      ...entry.marker,
      sizemax: nodeSize * 2,
      sizemin: nodeSize,
    },
    mode: 'markers',
    type: PLOTLY_CHART_TYPE.pointcloud,
    xy: mirrorPoints
      ? new Float32Array([
          ...Array.from(coords),
          ...Array.from(coords)
            .slice()
            .reverse(),
        ])
      : coords,
  };
};
