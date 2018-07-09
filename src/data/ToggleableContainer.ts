/**
 * An array providing an API to easily toggle-insert an element - meaning, add the item if it isn't present, or remove it if it is.
 *
 * @export
 */
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
    this.elements = [...this.elements, ...items];
  }

  public clear() {
    this.elements = [];
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
      this.elements = [...this.elements.slice(0, searchIndex), ...this.elements.slice(searchIndex + 1)];
    }
  }

  public toArray() {
    return Array.from(this.elements);
  }

  /**
   * Either adds or removes an element from this container - whatever is opposite of the current state.
   *
   * @example const result = new ToggleableContainer<number>();
   * result.toggle(4);
   * console.log(result.toArray()); // [4]
   * result.toggle(4);
   * console.log(result.toArray()); // []
   *
   * @param element Element to be toggled in/out.
   */
  public toggle(element: T) {
    if (this.elements.includes(element)) {
      this.remove(element);
    } else {
      this.add(element);
    }
  }
}

export { ToggleableContainer };
