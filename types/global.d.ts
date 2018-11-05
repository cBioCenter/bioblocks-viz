/**
 * From T, get the set of properties that are not K.
 *
 * @link https://github.com/Microsoft/TypeScript/wiki/What%27s-new-in-TypeScript#predefined-conditional-types
 */
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

// Helpers found [here](https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript)
declare type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };
declare type RecursiveRequired<T> = { [P in keyof T]: Required<RecursiveRequired<T[P]>> };
declare type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>;

declare namespace NodeJS {
  // tslint:disable-next-line:interface-name
  export interface Global {
    window: any;
    dispatchEvent(event: Event): void;
  }
}

// Quick fix due to compilation issue with TS3.1 lib.dom type: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#typescript-31
// tslint:disable-next-line:interface-name
interface WebGLRenderingContext {
  getExtension(extensionName: any): any;
}

declare type FieldTypes = 'boolean' | 'object' | 'function' | 'number' | 'string' | 'symbol' | 'undefined';
