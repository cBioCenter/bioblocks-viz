// tslint:disable-next-line: no-submodule-imports
import * as plotly from 'plotly.js/lib/index-gl2d';

module.exports = {
  ...plotly,
  Plots: {
    resize: () => jest.fn(),
  },
  newPlot: (...args: any[]) => mockCanvas,
  purge: jest.fn(),
  react: (...args: any[]) => mockCanvas,
};

export interface IMockPlotlyCanvas {
  dispatchEvent(
    event: Event,
    data:
      | Partial<plotly.PlotScatterDataPoint>
      | Partial<plotly.PlotSelectionEvent>
      | Partial<plotly.SelectionRange>
      | RecursivePartial<plotly.PlotMouseEvent>,
  ): boolean;
}

export class MockPlotlyHTMLElement implements IMockPlotlyCanvas {
  protected callbacks = new Map<string, (...args: any[]) => void>();

  public on = (event: string, callback: (...args: any[]) => void) => {
    this.callbacks.set(event, callback);
  };

  public dispatchEvent(
    event: Event,
    data: Partial<plotly.PlotScatterDataPoint> | Partial<plotly.PlotSelectionEvent> | plotly.SelectionRange,
  ): boolean {
    const cb = this.callbacks.get(event.type);
    if (cb) {
      switch (event.type) {
        case 'plotly_click':
        case 'plotly_hover':
        case 'plotly_unhover':
          cb({ points: [{ ...data }] });
          break;
        case 'plotly_selected':
          cb(data);
          break;
        default:
          cb();
      }
    }

    return true;
  }
}

const mockCanvas = new MockPlotlyHTMLElement();
