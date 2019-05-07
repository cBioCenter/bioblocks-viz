// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import { Vector3 } from 'three';

  export type TypedArray =
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8ClampedArray
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Float32Array
    | Float64Array;

  export type TypedArrayString = 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'float32';

  export type NumberArray = number[] | TypedArray;

  export class AtomPicker extends Picker {}

  /**
   * Bit array
   * Based heavily on https://github.com/lemire/FastBitSet.js which is licensed under the Apache License, Version 2.0.
   *
   * @export
   */
  export class BitArray {
    // Properties
    public length: number;

    /**
     * Creates an instance of BitArray.
     * @param length Array length.
     */
    constructor(length: number, setAll?: SVGAnimatedBoolean);

    // Methods
    public _assignRange(start: number, end: number, value: boolean): undefined | this;
    public _isRangeValue(start: number, end: number, value: boolean): undefined | boolean;

    /**
     * Set value at index to false.
     *
     * @param index The index.
     */
    public clear(index: number): void;

    /**
     * Clear all bits of the array.
     *
     * @returns This object.
     */
    public clearAll(): undefined | this;

    /**
     * Clear bits at all given indices.
     *
     * @returns This object.
     */
    public clearBits(...indices: number[]): this;

    /**
     * Clear bits of the given range.
     *
     * @param start Start index.
     * @param end End index.
     * @returns This object.
     */
    public clearRange(start: number, end: number): undefined | this;

    /**
     * Clone this object.
     *
     * @returns The cloned object.
     */
    public clone(): any;

    /**
     * Calculate difference between this and another bit array. Store result in this object.
     *
     * @param otherBitarray The other bit array.
     * @returns This object.
     */
    public difference(otherBitarray: BitArray): this;

    /**
     * Flip value at index.
     *
     * @param index The index.
     */
    public flip(index: number): void;

    /**
     * Flip all the values in the array.
     *
     * @returns This object.
     */
    public flipAll(): this;

    /**
     * Iterate over all set bits in the array.
     *
     * @param callback The callback.
     */
    public forEach(callback: (index: number, i: number) => any): void;

    /**
     * Get value at index.
     *
     * @param index The index.
     * @returns Value
     */
    // tslint:disable-next-line: no-reserved-keywords
    public get(index: number): boolean;

    /**
     * Calculate the number of bits in common between this and another bit array.
     *
     * @param otherBitarray The other bit array.
     * @returns Size.
     */
    public getIntersectionSize(otherBitarray: BitArray): number;

    /**
     * How many set bits?
     *
     * @returns Number of set bits.
     */
    public getSize(): number;

    /**
     * Calculate intersection between this and another bit array. Store result in this object.
     *
     * @param otherBitarray The other bit array.
     * @returns This object.
     */
    public intersection(otherBitarray: BitArray): this;

    /**
     * Test if there is any intersection between this and another bit array.
     *
     * @param otherBitarray The other bit array.
     * @returns Test result
     */
    public intersects(otherBitarray: BitArray): boolean;

    /**
     * Test if all bits in the array are clear.
     *
     * @returns Test result.
     */
    public isAllClear(): undefined | true | false;

    /**
     * Test if all bits in the array are set.
     *
     * @returns Test result.
     */
    public isAllSet(): undefined | true | false;

    /**
     * Test if bits at all given indices are clear.
     *
     * @returns Test result.
     */
    public isClear(...indices: number[]): boolean;

    /**
     * Test if two BitArrays are identical in all their values.
     *
     * @param otherBitarray The other BitArray
     * @returns Test result.
     */
    public isEqualTo(otherBitarray: BitArray): boolean;

    /**
     * Test if bits in given range are clear.
     *
     * @param start Start index.
     * @param end End index.
     * @returns This object.
     */
    public isRangeClear(start: number, end: number): undefined | true | false;

    /**
     * Test if bits in given range are set.
     *
     * @param start Start index.
     * @param end End index.
     * @returns This object.
     */
    public isRangeSet(start: number, end: number): undefined | true | false;

    /**
     * Test if bits at all given indices are set
     *
     * @returns Test result.
     */
    public isSet(...indices: number[]): boolean;

    /**
     * Calculate intersection between this and another bit array. Store result in a new bit array.
     *
     * @param otherBitarray The other bit array
     * @returns The new bit array
     */
    public makeIntersection(otherBitarray: BitArray): any;

    /**
     * Set value at index to true.
     *
     * @param index The index.
     */
    // tslint:disable-next-line: no-reserved-keywords
    public set(index: number): void;

    /**
     * Set all bits of the array.
     *
     * @returns This object.
     */
    public setAll(): undefined | this;

    /**
     * Set bits at all given indices.
     *
     * @returns This object.
     */
    public setBits(...indices: number[]): this;

    /**
     * Set bits of the given range.
     *
     * @param start Start index.
     * @param end End index.
     * @returns This object.
     */
    public setRange(start: number, end: number): undefined | this;

    /**
     * Get an array with the set bits.
     *
     * @returns Bit indices.
     */
    public toArray(): any[];
    public toSeleString(): string;
    public toString(): string;

    /**
     * Calculate union between this and another bit array. Store result in this object.
     *
     * @param otherBitarray The other bit array.
     * @returns This object.
     */
    public union(otherBitarray: BitArray): this;
  }

  class ConePicker extends ShapePicker {}

  class ClashPicker extends Picker {
    constructor(array: any[] | TypedArray, validation: Validation, structure: Structure);
  }

  export class Counter {
    // Properties
    public count: number;
    public signals: {
      countChanged: Signal;
    };

    // Methods
    public change(delta: number): void;
    public clear(): void;
    public decrement(): void;
    public dispose(): void;
    public increment(): void;
    public listen(counter: Counter): void;
    public onZeroOnce(callback: () => void, context?: any): void;
    public unlisten(counter: Counter): void;
  }

  export class Picker {
    // Accessors
    public data: object;
    // tslint:disable-next-line: no-reserved-keywords
    public type: string;

    constructor(array: any[] | TypedArray);

    // Methods
    /**
     * Get the index for the given picking id.
     *
     * @param  pid The picking id.
     * @returns The index.
     */
    public getIndex(pid: number): number;

    /**
     * Get object data.
     *
     * @param pid The picking id.
     * @returns  The object data.
     */
    public getObject(pid: number): object;

    /**
     * Get position for the given picking id.
     *
     * @param pid The picking id.
     * @param instance The instance that should be applied.
     * @param component The component of the picked object.
     * @returns The position.
     */
    public getPosition(pid: number, instance: object, component: Component): Vector3;
  }

  export interface IRingBuffer<T> {
    count: number;
    data: T[];
    clear(): void;
    get(index: number): T;
    has(value: T): boolean;
    push(value: T): void;
  }

  export interface ISimpleDict<K, V> {
    values: V[];
    add(k: K, v: V): void;
    del(k: K): void;
    has(k: K): boolean;
  }

  /**
   * Shape picker class.
   *
   * @export
   * @extends {Picker}
   */
  export class ShapePicker extends Picker {
    // Properties
    public shape: Shape;

    // Accessors
    public primitive: Shape;

    constructor(shape: Shape);
  }

  /**
   * Surface picker class.
   *
   * @export
   * @extends {Picker}
   */
  export class SurfacePicker extends Picker {
    // Properties
    public surface: Surface;

    constructor(array: any[] | TypedArray, surface: Surface);
  }
}
