import { SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_KEYS, SECONDARY_STRUCTURE_SECTION } from '../../data/chell-data';
import AuxiliaryAxis from './AuxiliaryAxis';
import { IPlotlyData } from './PlotlyChart';

/**
 * Class to represent the x and y axis for a secondary structure on a Plotly graph.
 *
 * @export
 */
export default class SecondaryStructureAxis extends AuxiliaryAxis<SECONDARY_STRUCTURE_KEYS> {
  constructor(
    readonly sections: SECONDARY_STRUCTURE,
    readonly minimumRequiredResidues: number = 2,
    readonly axisIndex: number = 2,
    readonly defaultColor = 'black',
    readonly colorMap: { [key: string]: string } = {
      C: 'red',
      E: 'green',
      H: 'blue',
    },
    readonly dataTransformFn = {
      E: (section: SECONDARY_STRUCTURE_SECTION, index: number) => ({ main: index, opposite: 0 }),
      H: (section: SECONDARY_STRUCTURE_SECTION, index: number) => ({
        main: index,
        opposite: Math.sin(index - section.start),
      }),
    },
    readonly filterFn = (section: SECONDARY_STRUCTURE_SECTION) => section.length <= minimumRequiredResidues,
  ) {
    super(sections, axisIndex, defaultColor, colorMap, dataTransformFn, filterFn);
  }

  protected setupAuxiliaryAxis() {
    super.setupAuxiliaryAxis();
    const sheetAxis = this.axes.get('E');
    if (sheetAxis && sheetAxis.x.x && sheetAxis.x.y) {
      const symbols = {
        main: new Array<string>(sheetAxis.x.x.length).fill('line-ne'),
        opposite: new Array<string>(sheetAxis.x.x.length).fill('line-ne'),
      };

      for (let i = 1; i < sheetAxis.x.x.length - 1; ++i) {
        if (sheetAxis.x.y[i + 1] === null) {
          symbols.main[i] = 'triangle-right';
          symbols.opposite[i] = 'triangle-down';
        }
      }

      sheetAxis.x = {
        ...sheetAxis.x,
        ...this.generateBetaSheetStyle(sheetAxis.x, symbols.main),
      };

      sheetAxis.y = {
        ...sheetAxis.y,
        ...this.generateBetaSheetStyle(sheetAxis.y, symbols.opposite),
      };
    }
  }

  protected generateBetaSheetStyle(data: Partial<IPlotlyData>, symbols: string[]): Partial<IPlotlyData> {
    return {
      line: {
        ...data.line,
        width: 5,
      },
      marker: {
        ...data.marker,
        color: this.colorMap.E,
        size: 10,
        symbol: symbols,
      },
      mode: 'lines+markers',
    };
  }
}

export { SecondaryStructureAxis };
