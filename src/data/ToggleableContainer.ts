export default class ToggleableContainer<T> {
  protected iteratorCounter = 0;
  protected elements = new Array<T>();

  public get length() {
    return this.elements.length;
  }

  public constructor(...items: T[]) {
    this.elements = new Array<T>(...items);
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  public add(...items: T[]) {
    this.elements.push(...items);
  }

  public clear() {
    this.elements.splice(0, this.length);
  }

  public next(value?: any): IteratorResult<T> {
    if (this.iteratorCounter === this.length) {
      this.iteratorCounter = 0;
      return {
        done: true,
        value: null as any,
      };
    } else {
      this.iteratorCounter++;
      return {
        done: false,
        value: this.elements[this.iteratorCounter - 1],
      };
    }
  }

  public remove(element: T) {
    const searchIndex = this.elements.indexOf(element);
    if (searchIndex >= 0) {
      this.elements.splice(searchIndex, 1);
    }
  }

  public toggle(element: T) {
    const searchIndex = this.elements.indexOf(element);
    if (searchIndex >= 0) {
      this.elements.splice(searchIndex, 1);
    } else {
      this.add(element);
    }
  }
}

export { ToggleableContainer };
