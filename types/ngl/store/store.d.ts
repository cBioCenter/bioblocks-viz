// tslint:disable:max-classes-per-file
declare module 'ngl' {
  export class AtomMap extends Store {}

  export class AtomStore extends Store {}

  export class AtomType extends Store {}

  export class BondHash extends Store {}

  export class BondStore extends Store {}

  export class ChainStore extends Store {}

  export class ModelStore extends Store {}

  export class ResidueMap extends Store {}

  export class ResidueStore extends Store {}

  export class ResidueType extends Store {}

  export interface IRingData {
    flags: Int8Array;
    rings: number[][];
  }

  export class Store {}
}
