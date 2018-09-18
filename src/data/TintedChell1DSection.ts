import { Color } from 'plotly.js-gl2d-dist';
import Chell1DSection from './Chell1DSection';

/**
 * Class to encapsulate a 1 Dimensional data segment that has an associated color with it.
 *
 * @export
 * @extends Chell1DSection
 */
class TintedChell1DSection<T> extends Chell1DSection<T> {
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

export default TintedChell1DSection;

export { TintedChell1DSection };
