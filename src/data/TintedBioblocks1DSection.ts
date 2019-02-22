import { Color } from 'plotly.js-gl2d-dist';

import { Bioblocks1DSection } from '~bioblocks-viz~/data';

/**
 * Class to encapsulate a 1 Dimensional data segment that has an associated color with it.
 *
 * @export
 * @extends Bioblocks1DSection
 */
export class TintedBioblocks1DSection<T> extends Bioblocks1DSection<T> {
  protected sectionColor: Color = 'orange';

  public get color() {
    return this.sectionColor;
  }

  public constructor(readonly label: T, start: number, end: number = start, color: Color = 'orange') {
    super(label, start, end);
    this.sectionColor = color;
  }

  public updateColor(color: Color) {
    this.sectionColor = color;
  }
}
