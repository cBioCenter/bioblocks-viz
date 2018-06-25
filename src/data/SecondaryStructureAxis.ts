import { Datum } from 'plotly.js';
import { IPlotlyData } from '../component/chart/PlotlyChart';
import { ISecondaryStructureData, SECONDARY_STRUCTURE_CODES } from './chell-data';

/**
 * Class to represent the x and y axis for a secondary structure on a Plotly graph.
 *
 * @export
 */
export default class SecondaryStructureAxis {
  /** The axis in Plotly parlance, pass this along to have it drawn. */
  public readonly axis = Array<Partial<IPlotlyData>>();

  /**
   * Creates an instance of SecondaryStructureAxis.
   * @param sequence Sequence of secondary structures.
   * @param [colorMap={
   *       C: 'red',
   *       E: 'green',
   *       H: 'blue',
   *     }] How to color the different secondary structure types.
   */
  constructor(
    sequence: ISecondaryStructureData[],
    readonly colorMap: { [key: string]: string } = {
      C: 'red',
      E: 'green',
      H: 'blue',
    },
  ) {
    this.axis = this.generateSecondaryStructureAxis(sequence);
  }

  /**
   * Generate all of the scatter plots for the secondary structure of a sequence.
   *
   * @example
   * Given: `[{resno: 0, 'C'}, {resno: 1, 'C'}, {resno: 2, 'H'}, {resno: 3, 'H'}, {resno: 4, 'C'}, {resno: 5, 'E'}];`
   * This will create an array of 4 Plotly data objects, such that:
   * - result[0] is a scatter plot with x === [0, 1, 2] and named 'COIL'.
   * - result[1] is a scatter plot with x === [2,3] and named 'ALPHA HELIX'.
   * - result[2] is a scatter plot with x === [4] and named 'COIL'.
   * - result[2] is a scatter plot with x === [5] and named 'BETA SHEET'.
   *
   * @param sequence All of the pairs of residue numbers with corresponding secondary structure codes.
   * @returns An array of data objects where each element represents a secondary structure chunk.
   */
  protected generateSecondaryStructureAxis = (sequence: ISecondaryStructureData[]): Array<Partial<IPlotlyData>> =>
    sequence.length >= 1
      ? sequence.slice(1, sequence.length).reduce((resultingAxis, current, index) => {
          if (sequence[index].structId !== current.structId) {
            resultingAxis.push(...this.generateSecondaryStructAxisSegments(current));
          } else {
            (resultingAxis[resultingAxis.length - 2].x as Datum[]).push(current.resno - 1);
            (resultingAxis[resultingAxis.length - 2].y as Datum[]).push(1);
            (resultingAxis[resultingAxis.length - 1].x as Datum[]).push(1);
            (resultingAxis[resultingAxis.length - 1].y as Datum[]).push(current.resno - 1);
          }
          return resultingAxis;
        }, this.generateSecondaryStructAxisSegments(sequence[0]))
      : [];

  /**
   * Generate a Plotly data object to represent the secondary structure on the X axis.
   *
   * @param entry A Single residue-secondary structure element.
   */
  protected generateXAxisSecStructSegment = (entry: ISecondaryStructureData): Partial<IPlotlyData> => ({
    ...this.secondaryStructureAxisDefaults(entry),
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
  protected generateYAxisSecStructSegment = (entry: ISecondaryStructureData): Partial<IPlotlyData> => ({
    ...this.secondaryStructureAxisDefaults(entry),
    orientation: 'v',
    x: [1, 1],
    xaxis: 'x2',
    y: [entry.resno - 1, entry.resno],
    yaxis: 'y',
  });

  /**
   * Generate the X and Y axis data object to represent the secondary structure.
   *
   * @param entry A Single residue-secondary structure element.
   */
  protected generateSecondaryStructAxisSegments = (entry: ISecondaryStructureData) => [
    this.generateXAxisSecStructSegment(entry),
    this.generateYAxisSecStructSegment(entry),
  ];

  /**
   * Generate a Plotly data object with elements shared between x/y axis.
   *
   * @param entry A Single residue-secondary structure element.
   * @returns Plotly data object with axis options shared between x and y axis.
   */
  protected secondaryStructureAxisDefaults = (entry: ISecondaryStructureData): Partial<IPlotlyData> => ({
    hoverinfo: 'name',
    line: {
      color: this.colorMap[entry.structId],
      width: entry.structId === 'C' ? 0 : 5,
    },
    mode: 'lines',
    name: SECONDARY_STRUCTURE_CODES[entry.structId],
    showlegend: false,
    type: 'scatter',
  });
}

export { SecondaryStructureAxis };
