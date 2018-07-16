import { IContactMapChartData } from '../component/chart/ContactMapChart';
import { IPlotlyData, PLOTLY_CHART_TYPE } from '../component/chart/PlotlyChart';

/**
 * Generate data in the expected format for a WebGL Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export const generateScatterGLData = (
  entry: IContactMapChartData,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => ({
  ...generateScatterData(entry, mirrorPoints),
  type: PLOTLY_CHART_TYPE.scattergl,
});

/**
 * Generate data in the expected format for a Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export const generateScatterData = (
  entry: IContactMapChartData,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => {
  const { marker, points, subtitle, name } = entry;
  const xValues = points.map(data => data.i);
  const yValues = points.map(data => data.j);
  const zValues = points.map(data => data.dist);

  let color = new Array<string | number>(mirrorPoints ? zValues.length * 2 : zValues.length);

  if (entry.marker && typeof entry.marker.color === 'string') {
    color.fill(entry.marker.color);
  } else {
    color = mirrorPoints ? zValues.concat(zValues) : zValues;
  }

  return {
    hoverinfo: 'x+y+z',
    marker: Object.assign(
      {
        color,
        size: entry.nodeSize,
      },
      marker,
    ),
    mode: 'markers',
    name: `${name} ${subtitle}`,
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
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export const generatePointCloudData = (
  entry: IContactMapChartData,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => {
  const { points } = entry;
  const coords = generateFloat32ArrayFromContacts(points);
  return {
    marker: {
      ...entry.marker,
      sizemax: entry.nodeSize * 2,
      sizemin: entry.nodeSize,
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
