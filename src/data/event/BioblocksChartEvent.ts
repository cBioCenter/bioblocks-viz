import { BIOBLOCKS_CHART_EVENT_TYPE, BIOBLOCKS_CHART_PIECE } from '~bioblocks-viz~/data';

export class BioblocksChartEvent {
  public constructor(
    // tslint:disable-next-line:no-reserved-keywords
    readonly type: BIOBLOCKS_CHART_EVENT_TYPE,
    readonly chartPiece?: BIOBLOCKS_CHART_PIECE,
    readonly selectedPoints: number[] = [],
    readonly plotlyEvent:
      | Partial<Plotly.PlotMouseEvent>
      | Partial<Plotly.PlotSelectionEvent>
      | Partial<Plotly.LegendClickEvent> = {},
  ) {}

  public isAxis() {
    return this.chartPiece === BIOBLOCKS_CHART_PIECE.AXIS;
  }
}
