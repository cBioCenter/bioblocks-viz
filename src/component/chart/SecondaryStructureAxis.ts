// ~bb-viz~
// Class to represent the x and y axis for a secondary structure on a Plotly graph.
// ~bb-viz~

// tslint:disable-next-line:no-relative-imports
import { AuxiliaryAxis } from './';

// import { AuxiliaryAxis } from '~bioblocks-viz~/component'; // TODO Fix the circular dependency this causes.

import {
  IPlotlyData,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_KEYS,
  SECONDARY_STRUCTURE_SECTION,
} from '~bioblocks-viz~/data';
import { ColorMapper } from '~bioblocks-viz~/helper';

/**
 * Class to represent the x and y axis for a secondary structure on a Plotly graph.
 *
 * @export
 */
export class SecondaryStructureAxis extends AuxiliaryAxis<SECONDARY_STRUCTURE_KEYS> {
  protected static centerSectionPositionFn = (section: SECONDARY_STRUCTURE_SECTION, index: number) => ({
    main: index,
    opposite: 0,
  });

  constructor(
    readonly sections: SECONDARY_STRUCTURE,
    readonly minimumRequiredResidues: number = 3,
    readonly axisIndex: number = 2,
    readonly colorMap = new ColorMapper<SECONDARY_STRUCTURE_KEYS>(
      new Map([
        ['C', 'red'],
        ['E', 'green'],
        ['H', 'blue'],
      ]),
      'black',
    ),
    readonly dataTransformFn = {
      C: SecondaryStructureAxis.centerSectionPositionFn,
      E: SecondaryStructureAxis.centerSectionPositionFn,
      H: (section: SECONDARY_STRUCTURE_SECTION, index: number) => ({
        main: index,
        opposite: Math.sin(index),
      }),
    },
    readonly filterFn = (section: SECONDARY_STRUCTURE_SECTION) => section.length <= minimumRequiredResidues,
  ) {
    super(sections, axisIndex, colorMap, dataTransformFn);
  }

  protected setupAuxiliaryAxis() {
    super.setupAuxiliaryAxis();
    const sheetAxis = this.getAxisById('E');
    const BLANK_LINE = 'line-ne';
    const TRIANGLE_RIGHT = 'triangle-right';
    const TRIANGLE_DOWN = 'triangle-down';

    if (sheetAxis && sheetAxis.x.x && sheetAxis.x.y) {
      const symbols = {
        main: new Array<string>(sheetAxis.x.x.length).fill(BLANK_LINE),
        opposite: new Array<string>(sheetAxis.x.x.length).fill(BLANK_LINE),
      };

      for (let i = 1; i < sheetAxis.x.x.length - 1; ++i) {
        if (sheetAxis.x.y[i + 1] === null) {
          symbols.main[i] = TRIANGLE_RIGHT;
          symbols.opposite[i] = TRIANGLE_DOWN;
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

  /**
   * Generate the Plotly layout specific to beta sheet representation.
   *
   * @param data Data for this axis.
   * @param symbols The symbols that make up this axis. Should be an array of empty lines with an arrow at the end.
   * @returns Plotly layout specific to beta sheet representation.
   */
  protected generateBetaSheetStyle(data: Partial<IPlotlyData>, symbols: string[]): Partial<IPlotlyData> {
    return {
      line: {
        ...data.line,
        width: 5,
      },
      marker: {
        ...data.marker,
        color: this.colorMap.getColorFor('E'),
        size: 10,
        symbol: symbols,
      },
      mode: 'lines+markers',
    };
  }
}
