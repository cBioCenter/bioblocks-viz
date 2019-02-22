/**
 * Class to encapsulate a 1 Dimensional data segment.
 * This is defined as a numerical range with inclusive start, inclusive end, and label associated with it.
 * Additionally, a Section is defined such that [start <= end] - meaning values will be flipped to keep this constraint.
 *
 * @export
 */
export class Bioblocks1DSection<T> {
  protected sectionEnd: number = 0;
  protected sectionStart: number = 0;

  public get end() {
    return this.sectionEnd;
  }

  public get length() {
    return this.sectionEnd - this.sectionStart + 1;
  }

  public get start() {
    return this.sectionStart;
  }

  public constructor(readonly label: T, start: number, end: number = start) {
    this.sectionEnd = Math.max(end, start);
    this.sectionStart = Math.min(start, end);
  }

  public contains(...values: number[]) {
    for (const value of values) {
      if (value < this.sectionStart || value > this.sectionEnd || value === undefined) {
        return false;
      }
    }

    return true;
  }

  public updateStart(newNum: number) {
    if (newNum > this.sectionEnd) {
      this.sectionStart = this.sectionEnd;
      this.sectionEnd = newNum;
    } else {
      this.sectionStart = newNum;
    }
  }

  public updateEnd(newNum: number) {
    if (newNum < this.sectionStart) {
      this.sectionEnd = this.sectionStart;
      this.sectionStart = newNum;
    } else {
      this.sectionEnd = newNum;
    }
  }
}
