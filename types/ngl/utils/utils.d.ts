// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';

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

  export type NumberArray = number[] | TypedArray;

  export type Partial<T> = { [p in keyof T]?: T[p] };

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
}
