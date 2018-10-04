// tslint:disable:max-classes-per-file no-reserved-keywords
declare module 'ngl' {
  export class AtomMap extends Store {
    public dict: { [k: string]: number };
  }

  export class AtomStore extends Store {
    // Properties
    public altloc: Uint8Array;
    public atomTypeId: Uint16Array;
    public bfactor: Float32Array;
    public formalCharge: Uint8Array;
    public occupancy: Float32Array;
    public partialCharge: Float32Array;
    public residueIndex: Uint32Array;
    public serial: Int32Array;
    public x: Float32Array;
    public y: Float32Array;
    public z: Float32Array;

    // Methods
    public getAltloc(i: number): string;
    public setAltloc(i: number, str: string): void;
  }

  export class AtomType extends Store {}

  export interface IBondGraph {
    [k: number]: number[];
  }

  export class BondHash extends Store {}

  export class BondStore extends Store {
    // Properties
    public atomIndex1: Uint32Array;
    public atomIndex2: Uint32Array;
    public bondOrder: Uint8Array;

    // Methods
    public addBond(atom1: AtomProxy, atom2: AtomProxy, bondOrder?: undefined | number): void;
    public addBondIfConnected(atom1: AtomProxy, atom2: AtomProxy, bondOrder?: undefined | number): boolean;
  }

  export class ChainStore extends Store {
    // Properties
    public chainid: Uint8Array;
    public chainname: Uint8Array;
    public entityIndex: Uint16Array;
    public modelIndex: Uint16Array;
    public residueCount: Uint32Array;
    public residueOffset: Uint32Array;

    // Methods
    public getChainid(i: number): string;
    public getChainname(i: number): string;
    public setChainid(i: number, str: string): void;
    public setChainname(i: number, str: string): void;
  }

  export class ContactStore extends Store {
    // Properties
    public index1: Uint32Array;
    public index2: Uint32Array;
    public type: Uint8Array;

    // Methods
    public addContact(index1: number, index2: number, type?: undefined | number): void;
  }

  export class ModelStore extends Store {
    // Properties
    public chainCount: Uint32Array;
    public chainOffset: Uint32Array;
  }

  export class ResidueMap extends Store {
    // Properties
    public dict: { [k: string]: number };
    public list: ResidueType[];
    public structure: Structure;

    /**
     * Creates an instance of ResidueMap.
     */
    constructor(structure: Structure);

    // Methods
    public add(
      resname: string,
      atomTypeIdList: number[],
      hetero: boolean,
      chemCompType?: string,
      bonds?: IResidueBonds,
    ): number;

    public get(id: number): ResidueType;
  }

  export class ResidueStore extends Store {
    public atomCount: Uint16Array;
    public atomOffset: Uint32Array;
    public chainIndex: Uint32Array;
    public inscode: Uint8Array;
    public residueTypeId: Uint16Array;
    public resno: Uint32Array;
    public sstruc: Uint8Array;

    // Methods
    public getInscode(i: number): string;
    public getSstruc(i: number): string;
    public setInscode(i: number, str: string): void;
    public setSstruc(i: number, str: string): void;
  }

  export class ResidueType extends Store {
    // Properties
    public aromaticAtoms: Uint8Array;
    public aromaticRings: number[][];
    public atomCount: number;
    public atomTypeIdList: number[];
    public backboneEndAtomIndex: number;
    public backboneEndType: number;
    public backboneIndexList: number[];
    public backboneStartAtomIndex: number;
    public backboneStartType: number;
    public backboneType: number;
    public bondGraph: IBondGraph;
    public bondReferenceAtomIndices: number[];
    public bonds: IResidueBonds;
    public chemCompType: string;
    public direction1AtomIndex: number;
    public direction2AtomIndex: number;
    public hetero: number;
    public moleculeType: number;
    public resname: string;
    public rings: IRingData;
    public rungEndAtomIndex: number;
    public structure: Structure;
    public traceAtomIndex: number;

    /**
     * Creates an instance of ResidueType.
     * @param structure The structure object.
     * @param resname Name of the residue.
     * @param atomTypeIdList List of IDs of AtomTypes corresponding to the atoms of the residue.
     * @param hetero Hetero flag.
     * @param chemCompType Chemical component type.
     */
    constructor(
      structure: Structure,
      resname: string,
      atomTypeIdList: number[],
      hetero: boolean,
      chemCompType: string,
      bonds?: IResidueBonds,
    );

    // Methods
    /**
     * For bonds with order > 1, pick a reference atom.
     */
    public assignBondReferenceAtomIndices(): void;

    public calculateAromatic(r: ResidueProxy): void;

    /**
     * BondGraph - represents the bonding in this residue: { ai1: [ ai2, ai3, ...], ...}
     */
    public calculateBondGraph(): void;

    /**
     * Find all rings up to 2 * RingFinderMaxDepth.
     */
    public calculateRings(): void;

    public getAromatic(a?: AtomProxy): undefined | Uint8Array;

    public getAromaticRings(r?: ResidueProxy): undefined | number[][];

    public getAtomIndexByName(atomname: string | string[]): undefined | number;

    public getBackboneIndexList(): number[];

    public getBackboneType(position: number): 1 | 0 | 4 | 2 | 3 | 6 | 5;

    public getBondGraph(): undefined | IBondGraph;

    public getBondIndex(atomIndex1: number, atomIndex2: number): undefined | number;

    public getBondReferenceAtomIndex(atomIndex1: number, atomIndex2: number): undefined | number;

    public getBonds(r?: ResidueProxy): IResidueBonds;

    public getMoleculeType(): 1 | 0 | 4 | 2 | 3 | 6 | 5;

    public getRings(): undefined | IRingData;

    public hasAtomWithName(...atomnames: Array<string | string[]>): boolean;

    public hasBackbone(position: number): boolean;

    public hasBackboneAtoms(position: number, type: number): boolean;

    public hasCgDnaBackbone(position: number): boolean;

    public hasCgProteinBackbone(position: number): boolean;

    public hasCgRnaBackbone(position: number): boolean;

    public hasDnaBackbone(position: number): boolean;

    public hasProteinBackbone(position: number): boolean;

    public hasRnaBackbone(position: number): boolean;

    public isAromatic(atom: AtomProxy): boolean;

    public isCg(): boolean;

    public isDna(): boolean;

    public isHetero(): boolean;

    public isIon(): boolean;

    public isNucleic(): boolean;

    public isProtein(): boolean;

    public isRna(): boolean;

    public isSaccharide(): boolean;

    public isWater(): boolean;
  }

  export interface IRingData {
    flags: Int8Array;
    rings: number[][];
  }

  /**
   * Store base class.
   */
  export class Store {
    [k: string]: any;

    // Properties
    // tslint:disable:variable-name
    public _defaultFields: StoreField[];
    public _fields: StoreField[];
    // tslint:enable:variable-name

    public count: number;
    public length: number;

    /**
     * Creates an instance of Store.
     */
    public constructor(size?: number);

    // Methods
    /**
     * Initialize the store.
     *
     * @param size Size to initialize.
     */
    public _init(size: number): void;

    /**
     * Initialize a field.
     *
     * @param name Field name.
     * @param size Element size.
     * @param type Data type, one of int8, int16, int32, uint8, uint16, uint32, float32.
     */
    public _initField(name: string, size: number, type: TypedArrayString): void;

    /**
     * Add a field.
     *
     * @param name Field name.
     * @param size Element size.
     * @param type Data type, one of int8, int16, int32, uint8, uint16, uint32, float32.
     */
    public addField(name: string, size: number, type: TypedArrayString): void;

    /**
     * Empty the store.
     */
    public clear(): void;

    /**
     * Copy data from one store to another.
     *
     * @param other Store to copy from.
     * @param thisOffset Offset to start copying to.
     * @param otherOffset Offset to start copying from.
     * @param length Number of entries to copy.
     */
    public copyFrom(other: Store, thisOffset: number, otherOffset: number, length: number): void;

    /**
     * Copy data within this store.
     *
     * @param length Number of entries to copy.
     */
    public copyWithin(offsetTarget: number, offsetSource: number, length: number): void;

    /**
     * Dispose of the store entries and fields.
     */
    public dispose(): void;

    /**
     * Resize the store to 1.5 times its current size if full.
     */
    public growIfFull(): void;

    /**
     * Resize the store to the new size.
     *
     * @param [size] New size.
     */
    public resize(size?: undefined | number): void;

    /**
     * Sort entries in the store given the compare function.
     *
     * @param compareFunction Function to sort by.
     */
    public sort(compareFunction: (a: any, b: any) => number): void;
  }

  export type StoreField = [string, number, TypedArrayString];
}
