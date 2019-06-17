import { IContactMapChartData } from '~bioblocks-viz~/component';
import { ICouplingScore, IPlotlyData, PLOTLY_CHART_TYPE } from '~bioblocks-viz~/data';

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
  const { marker, points, hoverinfo, subtitle, name, text } = entry;
  const xValues = points.map(data => data.i);
  const yValues = points.map(data => data.j);
  const zValues = points.map(data => (data.dist ? data.dist : -1));
  const textValues = text ? (Array.isArray(text) ? text : [text]) : [];

  return {
    hoverinfo: hoverinfo ? hoverinfo : 'x+y+z',
    marker: {
      color: derivePlotlyColor(mirrorPoints, zValues, entry),
      size: entry.nodeSize,
      ...marker,
    },
    mode: 'markers',
    name: `${name} ${subtitle}`,
    text: deriveScatterText(mirrorPoints, textValues),
    type: PLOTLY_CHART_TYPE.scatter,
    x: derivePoints(mirrorPoints, xValues, yValues),
    y: derivePoints(mirrorPoints, yValues, xValues),
    z: derivePoints(mirrorPoints, zValues, zValues),
  };
};

const derivePlotlyColor = (mirrorPoints: boolean, zValues: number[], entry: IContactMapChartData) => {
  const totalColors = mirrorPoints ? zValues.length * 2 : zValues.length;
  const result = new Array<Plotly.Color>(totalColors);

  if (entry.marker && typeof entry.marker.color === 'string') {
    return result.fill(entry.marker.color);
  } else {
    const zStrings = zValues.map(val => val.toString());

    return mirrorPoints ? [...zStrings, ...zStrings] : zStrings;
  }
};

const derivePoints = (mirrorPoints: boolean, points: number[], oppositePoints?: number[]) =>
  mirrorPoints ? [...points, ...oppositePoints] : points;

const deriveScatterText = (mirrorPoints: boolean, textValues: string[]) => {
  return mirrorPoints
    ? [
        ...textValues,
        ...textValues.map(
          // Given a coordinate '(x, y)', create '(y, x)' - needed because we have custom hover labels.
          coord => {
            if (coord.includes('<br>') && coord.includes('(')) {
              const breakIndex = coord.indexOf('<br>');

              return `(${coord
                .substr(1, breakIndex - 2)
                .split(', ')
                .reverse()
                .join(', ')})${coord.substring(breakIndex)}`;
            } else if (coord.includes('(')) {
              return `(${coord
                .substr(1, coord.length - 2)
                .split(', ')
                .reverse()
                .join(', ')})`;
            } else {
              return `${coord
                .split(', ')
                .reverse()
                .join(', ')}`;
            }
          },
        ),
      ]
    : textValues;
};
/**
 * Determines the appropriate hover text in plotly for this coupling score.
 *
 * Currently the following 3 fields will be appended if present:
 * - Amino acid (A_i, A_j)
 * - Score
 * - Probability
 */
export const generateCouplingScoreHoverText = (point: ICouplingScore) => {
  let hoverText = '';
  if (point) {
    // Yields the format '(2B, 9S)' if amino acid is known, otherwise just '(2, 9)'
    hoverText =
      point.A_i && point.A_j ? `(${point.i}${point.A_i}, ${point.j}${point.A_j})` : `(${point.i}, ${point.j})`;

    if (point.score) {
      hoverText = `${hoverText}<br>Score: ${point.score}`;
    }
    if (point.probability) {
      hoverText = `${hoverText}<br>Probability: ${point.probability.toFixed(1)}`;
    }
  }

  return hoverText;
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
