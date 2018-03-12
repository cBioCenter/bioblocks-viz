// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Vector3 } from 'three';

  export class AtomProxy {
    // Accessors
    public altloc: string;
    public aromat: number;
    public atomType: AtomType;
    public atomname: string;
    public bfactor: number;
    public bondCount: number;
    public bondHash: undefined | BondHash;
    public chainIndex: number;
    public chainid: string;
    public covalent: number;
    public element: string;
    public entity: Entity;
    public entityIndex: number;
    public formalCharge: null | number;
    public hetero: number;
    public inscode: string;
    public modelIndex: number;
    public number: number;
    public occupancy: number;
    public partialCharge: null | number;
    public residue: ResidueProxy;
    public residueAtomOffset: number;
    public residueIndex: number;
    public residueType: ResidueType;
    public resname: string;
    public resno: number;
    public serial: number;
    public sstruc: string;
    public vdw: number;
    public x: number;
    public y: number;
    public z: number;

    // Properties
    public atomMap: AtomMap;
    public atomStore: AtomStore;
    public chainStore: ChainStore;
    public index: number;
    public residueMap: ResidueMap;
    public residueStore: ResidueStore;
    public structure: Structure;

    constructor(structure: Structure, index?: number);

    // Methods
    public bondToElementCount(element: Elements): number;
    public clone(): AtomProxy;
    public connectedTo(atom: AtomProxy): boolean;
    public distanceTo(atom: AtomProxy): number;
    public eachBond(callback: () => void, bp?: BondProxy): void;
    public eachBondedAtom(callback: () => void, ap?: AtomProxy): void;
    public getDefaultValence(): number;
    public getOuterShellElectronCount(): number;
    public getResidueBonds(firstOnly?: boolean): undefined | number | number[];
    public getValenceList(): number[];
    public hasBondTo(ap: AtomProxy): boolean;
    public hasBondToElement(element: Elements): boolean;
    public isActinide(): boolean;
    public isAlkaliMetal(): boolean;
    public isAlkalineEarthMetal(): boolean;
    public isAromatic(): boolean;
    public isBackbone(): boolean;
    public isBonded(): boolean;
    public isCg(): boolean;
    public isDiatomicNonmetal(): boolean;
    public isDna(): boolean;
    public isHalogen(): boolean;
    public isHelix(): boolean;
    public isHetero(): boolean;
    public isIon(): boolean;
    public isLanthanide(): boolean;
    public isMetal(): boolean;
    public isNobleGas(): boolean;
    public isNonmetal(): boolean;
    public isNucleic(): boolean;
    public isPolyatomicNonmetal(): boolean;
    public isPolymer(): boolean;
    public isPostTransitionMetal(): boolean;
    public isProtein(): boolean;
    public isRing(): boolean;
    public isRna(): boolean;
    public isSaccharide(): boolean;
    public isSheet(): boolean;
    public isSidechain(): boolean;
    public isTrace(): boolean;
    public isTransitionMetal(): boolean;
    public isTurn(): boolean;
    public isWater(): boolean;
    public positionAdd(v: Vector3 | AtomProxy): this;
    public positionFromArray(array: NumberArray, offset?: number): this;
    public positionFromVector3(v: Vector3): this;
    public positionSub(v: Vector3 | AtomProxy): this;
    public positionToArray(
      array?: NumberArray,
      offset?: number,
    ):
      | number[]
      | Uint8Array
      | Int8Array
      | Int16Array
      | Int32Array
      | Uint16Array
      | Uint32Array
      | Float32Array
      | Uint8ClampedArray
      | Float64Array;
    public positionToVector3(v: Vector3): Vector3;
    public qualifiedName(noResname?: boolean): string;
    public toObject(): {
      altloc: string;
      atomname: string;
      bfactor: number;
      chainname: string;
      covalent: number;
      element: string;
      hetero: number;
      index: number;
      modelIndex: number;
      residueIndex: number;
      resname: string;
      resno: number;
      serial: number;
      vdw: number;
      x: number;
      y: number;
      z: number;
    };
  }

  export class BondProxy {}

  export class ResidueProxy {}
}
