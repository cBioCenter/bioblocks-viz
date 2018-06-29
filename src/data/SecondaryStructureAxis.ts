import { Datum } from 'plotly.js';
import { IPlotlyData } from '../component/chart/PlotlyChart';
import { ISecondaryStructureData, SECONDARY_STRUCTURE_KEYS } from './chell-data';

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
    sequence: ISecondaryStructureData[],
    readonly colorMap: { [key: string]: string } = {
      C: 'red',
      E: 'green',
      H: 'blue',
    },
  ) {
    this.setupSecondaryStructureAxes(sequence);
  }

  protected setupSecondaryStructureAxes = (sequence: ISecondaryStructureData[]): void => {
    for (let i = 0; i < sequence.length; ++i) {
      const seq = sequence[i];
      if (!this.axes.get(seq.structId)) {
        this.axes.set(seq.structId, {
          x: this.generateXAxisSecStructSegment(seq.structId),
          y: this.generateYAxisSecStructSegment(seq.structId),
        });
      }
      (this.axes.get(seq.structId)!.x.x! as Datum[]).push(seq.resno);
      (this.axes.get(seq.structId)!.x.y! as Datum[]).push(1);
      (this.axes.get(seq.structId)!.y.y! as Datum[]).push(seq.resno);
      (this.axes.get(seq.structId)!.y.x! as Datum[]).push(1);
      if (i + 1 < sequence.length && sequence[i + 1].structId !== seq.structId) {
        (this.axes.get(seq.structId)!.x.x! as Datum[]).push(seq.resno);
        (this.axes.get(seq.structId)!.x.y! as Datum[]).push(null as any);
        (this.axes.get(seq.structId)!.y.y! as Datum[]).push(seq.resno);
        (this.axes.get(seq.structId)!.y.x! as Datum[]).push(null as any);
      }
    }
  };

  protected addSequenceToAxis = (sequence: ISecondaryStructureData): void => {
    return;
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
