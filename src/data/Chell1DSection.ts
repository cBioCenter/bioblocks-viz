/**
 * Class to encapsulate a 1 Dimensional data segment.
 * This is defined as a numerical range with inclusive start, inclusive end, and label associated with it.
 * Additionally, a Section is defined such that [start <= end] - meaning values will be flipped to keep this constraint.
 *
 * @export
 */
class Chell1DSection<T> {
  protected end: number = 0;
  protected start: number = 0;

  public get section() {
    const { end, label, start } = this;
    return {
      end,
      label,
      length: end - start + 1,
      start,
    };
  }

  public constructor(readonly label: T, start: number, end: number = start) {
    this.end = Math.max(end, start);
    this.start = Math.min(start, end);
  }

  public updateStart(newNum: number) {
    if (newNum > this.end) {
      this.start = this.end;
      this.end = newNum;
    } else {
      this.start = newNum;
    }
  }

  public updateEnd(newNum: number) {
    if (newNum < this.start) {
      this.end = this.start;
      this.start = newNum;
    } else {
      this.end = newNum;
    }
  }
}

export default Chell1DSection;

export { Chell1DSection };
