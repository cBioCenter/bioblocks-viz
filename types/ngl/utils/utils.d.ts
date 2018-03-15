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

  export type Partial<T> = { [p in keyof T]?: T[p] };

  export class AtomPicker extends Picker {}

  /**
   * Bit array
   * Based heavily on https://github.com/lemire/FastBitSet.js which is licensed under the Apache License, Version 2.0.
   *
   * @export
   * @class BitArray
   */
  export class BitArray {
    // Properties
    public length: number;

    /**
     * Creates an instance of BitArray.
     * @param {number} length Array length.
     * @param {SVGAnimatedBoolean} [setAll]
     * @memberof BitArray
     */
    constructor(length: number, setAll?: SVGAnimatedBoolean);

    // Methods
    public _assignRange(start: number, end: number, value: boolean): undefined | this;
    public _isRangeValue(start: number, end: number, value: boolean): undefined | boolean;

    /**
     * Set value at index to false.
     *
     * @param {number} index The index.
     * @memberof BitArray
     */
    public clear(index: number): void;

    /**
     * Clear all bits of the array.
     *
     * @returns {(undefined | this)} This object.
     * @memberof BitArray
     */
    public clearAll(): undefined | this;

    /**
     * Clear bits at all given indices.
     *
     * @param {...number[]} indices
     * @returns {this} This object.
     * @memberof BitArray
     */
    public clearBits(...indices: number[]): this;

    /**
     * Clear bits of the given range.
     *
     * @param {number} start Start index.
     * @param {number} end End index.
     * @returns {(undefined | this)} This object.
     * @memberof BitArray
     */
    public clearRange(start: number, end: number): undefined | this;

    /**
     * Clone this object.
     *
     * @returns {*} The cloned object.
     * @memberof BitArray
     */
    public clone(): any;

    /**
     * Calculate difference between this and another bit array. Store result in this object.
     *
     * @param {BitArray} otherBitarray The other bit array.
     * @returns {this} This object.
     * @memberof BitArray
     */
    public difference(otherBitarray: BitArray): this;

    /**
     * Flip value at index.
     *
     * @param {number} index The index.
     * @memberof BitArray
     */
    public flip(index: number): void;

    /**
     * Flip all the values in the array.
     *
     * @returns {this} This object.
     * @memberof BitArray
     */
    public flipAll(): this;

    /**
     * Iterate over all set bits in the array.
     *
     * @param {(index: number, i: number) => any} callback The callback.
     * @memberof BitArray
     */
    public forEach(callback: (index: number, i: number) => any): void;

    /**
     * Get value at index.
     *
     * @param {number} index The index.
     * @returns {boolean} Value
     * @memberof BitArray
     */
    public get(index: number): boolean;

    /**
     * Calculate the number of bits in common between this and another bit array.
     *
     * @param {BitArray} otherBitarray The other bit array.
     * @returns {number} Size.
     * @memberof BitArray
     */
    public getIntersectionSize(otherBitarray: BitArray): number;

    /**
     * How many set bits?
     *
     * @returns {number} Number of set bits.
     * @memberof BitArray
     */
    public getSize(): number;

    /**
     * Calculate intersection between this and another bit array. Store result in this object.
     *
     * @param {BitArray} otherBitarray The other bit array.
     * @returns {this} This object.
     * @memberof BitArray
     */
    public intersection(otherBitarray: BitArray): this;

    /**
     * Test if there is any intersection between this and another bit array.
     *
     * @param {BitArray} otherBitarray The other bit array.
     * @returns {boolean} Test result
     * @memberof BitArray
     */
    public intersects(otherBitarray: BitArray): boolean;

    /**
     * Test if all bits in the array are clear.
     *
     * @returns {(undefined | true | false)} Test result.
     * @memberof BitArray
     */
    public isAllClear(): undefined | true | false;

    /**
     * Test if all bits in the array are set.
     *
     * @returns {(undefined | true | false)} Test result.
     * @memberof BitArray
     */
    public isAllSet(): undefined | true | false;

    /**
     * Test if bits at all given indices are clear.
     *
     * @param {...number[]} indices
     * @returns {boolean} Test result.
     * @memberof BitArray
     */
    public isClear(...indices: number[]): boolean;

    /**
     * Test if two BitArrays are identical in all their values.
     *
     * @param {BitArray} otherBitarray The other BitArray
     * @returns {boolean} Test result.
     * @memberof BitArray
     */
    public isEqualTo(otherBitarray: BitArray): boolean;

    /**
     * Test if bits in given range are clear.
     *
     * @param {number} start Start index.
     * @param {number} end End index.
     * @returns {(undefined | true | false)} This object.
     * @memberof BitArray
     */
    public isRangeClear(start: number, end: number): undefined | true | false;

    /**
     * Test if bits in given range are set.
     *
     * @param {number} start Start index.
     * @param {number} end End index.
     * @returns {(undefined | true | false)} This object.
     * @memberof BitArray
     */
    public isRangeSet(start: number, end: number): undefined | true | false;

    /**
     * Test if bits at all given indices are set
     *
     * @param {...number[]} indices
     * @returns {boolean} Test result.
     * @memberof BitArray
     */
    public isSet(...indices: number[]): boolean;

    /**
     * Calculate intersection between this and another bit array. Store result in a new bit array.
     *
     * @param {BitArray} otherBitarray The other bit array
     * @returns {*} The new bit array
     * @memberof BitArray
     */
    public makeIntersection(otherBitarray: BitArray): any;

    /**
     * Set value at index to true.
     *
     * @param {number} index The index.
     * @memberof BitArray
     */
    public set(index: number): void;

    /**
     * Set all bits of the array.
     *
     * @returns {(undefined | this)} This object.
     * @memberof BitArray
     */
    public setAll(): undefined | this;

    /**
     * Set bits at all given indices.
     *
     * @param {...number[]} indices
     * @returns {this} This object.
     * @memberof BitArray
     */
    public setBits(...indices: number[]): this;

    /**
     * Set bits of the given range.
     *
     * @param {number} start Start index.
     * @param {number} end End index.
     * @returns {(undefined | this)} This object.
     * @memberof BitArray
     */
    public setRange(start: number, end: number): undefined | this;

    /**
     * Get an array with the set bits.
     *
     * @returns {any[]} Bit indices.
     * @memberof BitArray
     */
    public toArray(): any[];
    public toSeleString(): string;
    public toString(): string;

    /**
     * Calculate union between this and another bit array. Store result in this object.
     *
     * @param {BitArray} otherBitarray The other bit array.
     * @returns {this} This object.
     * @memberof BitArray
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
    public type: string;

    constructor(array: any[] | TypedArray);

    // Methods
    /**
     * Get the index for the given picking id.
     *
     * @param {number} pid The picking id.
     * @returns {number} The index.
     * @memberof Picker
     */
    public getIndex(pid: number): number;

    /**
     * Get object data.
     *
     * @param {number} pid The picking id.
     * @returns {object} The object data.
     * @memberof Picker
     */
    public getObject(pid: number): object;

    /**
     * Get position for the given picking id.
     *
     * @param {number} pid The picking id.
     * @param {object} instance The instance that should be applied.
     * @param {Component} component The component of the picked object.
     * @returns {Vector3} The position.
     * @memberof Picker
     */
    public getPosition(pid: number, instance: object, component: Component): Vector3;
  }

  export interface IRingBuffer<T> {
    clear: () => void;
    count: number;
    data: T[];
    get: (index: number) => T;
    has: (value: T) => boolean;
    push: (value: T) => void;
  }

  export interface ISimpleDict<K, V> {
    add: (k: K, v: V) => void;
    del: (k: K) => void;
    has: (k: K) => boolean;
    values: V[];
  }

  /**
   * Shape picker class.
   *
   * @export
   * @class ShapePicker
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
   * @class SurfacePicker
   * @extends {Picker}
   */
  export class SurfacePicker extends Picker {
    // Properties
    public surface: Surface;

    constructor(array: any[] | TypedArray, surface: Surface);
  }
}
