import { Datum } from 'plotly.js';
import { IPlotlyData } from '../component/chart/PlotlyChart';
import { SECONDARY_STRUCTURE_KEYS, SECONDARY_STRUCTURE_SECTION } from './chell-data';

export interface IAxisMapping {
  x: Partial<IPlotlyData>;
  y: Partial<IPlotlyData>;
}

/**
 * Class to represent the x and y axis for a secondary structure on a Plotly graph.
 *
 * @export
 */
export default class SecondaryStructureAxis {
  protected axes: Map<SECONDARY_STRUCTURE_KEYS, IAxisMapping> = new Map();

  public get axis() {
    return this.axes;
  }

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
    sequence: SECONDARY_STRUCTURE_SECTION[],
    readonly colorMap: { [key: string]: string } = {
      C: 'red',
      E: 'green',
      H: 'blue',
    },
  ) {
    this.setupSecondaryStructureAxes(sequence);
  }

  protected setupSecondaryStructureAxes = (sections: SECONDARY_STRUCTURE_SECTION[]): void => {
    for (const chellSection of sections) {
      const { end, label, start } = chellSection;
      if (!this.axes.get(label)) {
        this.axes.set(label, {
          x: this.generateXAxisSecStructSegment(label),
          y: this.generateYAxisSecStructSegment(label),
        });
      }
      (this.axes.get(label)!.x.x! as Datum[]).push(start, start, end, end);
      (this.axes.get(label)!.x.y! as Datum[]).push(null, 1, 1, null);
      (this.axes.get(label)!.y.y! as Datum[]).push(start, start, end, end);
      (this.axes.get(label)!.y.x! as Datum[]).push(null, 1, 1, null);
    }
  };

  /**
   * Generate a Plotly data object to represent the secondary structure on the X axis.
   *
   * @param entry A Single residue-secondary structure element.
   */
  protected generateXAxisSecStructSegment = (code: SECONDARY_STRUCTURE_KEYS): Partial<IPlotlyData> => ({
    ...this.secondaryStructureAxisDefaults(code),
    orientation: 'h',
    x: [],
    xaxis: 'x',
    y: [],
    yaxis: 'y2',
  });

  /**
   * Generate a Plotly data object to represent the secondary structure on the Y axis.
   *
   * @param entry A Single residue-secondary structure element.
   */
  protected generateYAxisSecStructSegment = (code: SECONDARY_STRUCTURE_KEYS): Partial<IPlotlyData> => ({
    ...this.secondaryStructureAxisDefaults(code),
    orientation: 'v',
    x: [],
    xaxis: 'x2',
    y: [],
    yaxis: 'y',
  });

  protected secondaryStructureAxisDefaults = (code: SECONDARY_STRUCTURE_KEYS): Partial<IPlotlyData> => ({
    connectgaps: false,
    hoverinfo: 'name',
    line: {
      color: this.colorMap[code],
      // width: code === 'C' ? 0 : 5,
      width: 5,
    },
    mode: 'lines',
    name: code,
    showlegend: false,
    type: 'scatter',
  });
}

export { SecondaryStructureAxis };
