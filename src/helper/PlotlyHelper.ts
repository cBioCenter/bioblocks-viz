import { Datum } from 'plotly.js';
import { IContactMapChartData } from '../component/chart/ContactMapChart';
import { IPlotlyData, PLOTLY_CHART_TYPE } from '../component/chart/PlotlyChart';
import { ISecondaryStructureData, SECONDARY_STRUCTURE_CODES } from '../data/chell-data';

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
  return {
    hoverinfo: 'x+y+z',
    marker: Object.assign(
      {
        color: mirrorPoints ? zValues.concat(zValues) : zValues,
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

const secStructColorMap: { [key: string]: string } = {
  C: 'red',
  E: 'green',
  H: 'blue',
};

/**
 * Generate a Plotly data object with elements shared between x/y axis.
 *
 * @param entry A Single residue-secondary structure element.
 * @returns Plotly data object with axis options shared between x and y axis.
 */
export const secondaryStructureAxisDefaults = (entry: ISecondaryStructureData): Partial<IPlotlyData> => ({
  hoverinfo: 'name',
  line: {
    color: secStructColorMap[entry.structId],
    width: 5,
  },
  mode: 'lines',
  name: SECONDARY_STRUCTURE_CODES[entry.structId],
  showlegend: false,
  type: 'scatter',
});

/**
 * Generate a Plotly data object to represent the secondary structure on the X axis.
 *
 * @param entry A Single residue-secondary structure element.
 */
export const generateSecStructXAxisSegment = (entry: ISecondaryStructureData): Partial<IPlotlyData> => ({
  ...secondaryStructureAxisDefaults(entry),
  orientation: 'h',
  x: [entry.resno - 1, entry.resno],
  xaxis: 'x',
  y: [1, 1],
  yaxis: 'y2',
});

/**
 * Generate a Plotly data object to represent the secondary structure on the Y axis.
 *
 * @param entry A Single residue-secondary structure element.
 */
export const generateSecStructYAxisSegment = (entry: ISecondaryStructureData): Partial<IPlotlyData> => ({
  ...secondaryStructureAxisDefaults(entry),
  orientation: 'v',
  x: [1, 1],
  xaxis: 'x2',
  y: [entry.resno - 1, entry.resno],
  yaxis: 'y',
});

/**
 * Generate all of the box plots for the secondary structure of a sequence.
 *
 * @example
 * Given: `[{resno: 0, 'C'}, {resno: 1, 'C'}, {resno: 2, 'H'}, {resno: 3, 'H'}, {resno: 4, 'C'}, {resno: 5, 'E'}];`
 * This will create an array of 4 Plotly data objects, such that:
 * - result[0] is a box plot with x === [0, 1, 2] and named 'COIL'.
 * - result[1] is a box plot with x === [2,3] and named 'ALPHA HELIX'.
 * - result[2] is a box plot with x === [4] and named 'COIL'.
 * - result[2] is a box plot with x === [5] and named 'BETA SHEET'.
 *
 * @param sequence All of the pairs of residue numbers with corresponding secondary structure codes.
 * @returns An array of data objects where each element represents a secondary structure chunk.
 */
export const generateSecondaryStructureAxis = (sequence: ISecondaryStructureData[]): Array<Partial<IPlotlyData>> =>
  sequence.length >= 1
    ? sequence.slice(1, sequence.length).reduce(
        (prev, current, index) => {
          if (sequence[index].structId !== current.structId) {
            prev.push(generateSecStructXAxisSegment(current));
            prev.push(generateSecStructYAxisSegment(current));
          } else {
            (prev[prev.length - 2].x as Datum[]).push(current.resno - 1);
            (prev[prev.length - 2].y as Datum[]).push(1);
            (prev[prev.length - 1].x as Datum[]).push(1);
            (prev[prev.length - 1].y as Datum[]).push(current.resno - 1);
          }
          return prev;
        },
        [
          {
            ...generateSecStructXAxisSegment(sequence[0]),
          },
          {
            ...generateSecStructYAxisSegment(sequence[0]),
          },
        ],
      )
    : [];
