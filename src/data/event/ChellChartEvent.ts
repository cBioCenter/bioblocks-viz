import { CHELL_CHART_EVENT_TYPE, CHELL_CHART_PIECE } from '~chell-viz~/data';

export class ChellChartEvent {
  public constructor(
    // tslint:disable-next-line:no-reserved-keywords
    readonly type: CHELL_CHART_EVENT_TYPE,
    readonly chartPiece?: CHELL_CHART_PIECE,
    readonly selectedPoints: number[] = [],
    readonly plotlyEvent: Partial<Plotly.PlotMouseEvent> | Partial<Plotly.PlotSelectionEvent> = {},
  ) {}

  public isAxis() {
    return this.chartPiece === CHELL_CHART_PIECE.AXIS;
  }
}
