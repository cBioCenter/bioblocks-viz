// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Selection } from 'ngl';
  import { Signal } from 'signals';
  import { Box3, Vector3 } from 'three';

  /**
   * Enum mapping element to atomic number
   */
  // prettier-ignore
  export const enum Elements {
    H = 1, D = 1, T = 1, HE = 2, LI = 3, BE = 4, B = 5,
    C = 6, N = 7, O = 8, F = 9, NE = 10, NA = 11, MG = 12,
    AL = 13, SI = 14, P = 15, S = 16, CL = 17, AR = 18,
    K = 19, CA = 20, SC = 21, TI = 22, V = 23, CR = 24,
    MN = 25, FE = 26, CO = 27, NI = 28, CU = 29, ZN = 30,
    GA = 31, GE = 32, AS = 33, SE = 34, BR = 35, KR = 36,
    RB = 37, SR = 38, Y = 39, ZR = 40, NB = 41, MO = 42,
    TC = 43, RU = 44, RH = 45, PD = 46, AG = 47, CD = 48,
    IN = 49, SN = 50, SB = 51, TE = 52, I = 53, XE = 54,
    CS = 55, BA = 56, LA = 57, CE = 58, PR = 59, ND = 60,
    PM = 61, SM = 62, EU = 63, GD = 64, TB = 65, DY = 66,
    HO = 67, ER = 68, TM = 69, YB = 70, LU = 71, HF = 72,
    TA = 73, W = 74, RE = 75, OS = 76, IR = 77, PT = 78,
    AU = 79, HG = 80, TL = 81, PB = 82, BI = 83, PO = 84,
    AT = 85, RN = 86, FR = 87, RA = 88, AC = 89, TH = 90,
    PA = 91, U = 92, NP = 93, PU = 94, AM = 95, CM = 96,
    BK = 97, CF = 98, ES = 99, FM = 100, MD = 101, NO = 102,
    LR = 103, RF = 104, DB = 105, SG = 106, BH = 107,
    HS = 108, MT = 109, DS = 110, RG = 111, CN = 112,
    NH = 113, FL = 114, MC = 115, LV = 116, TS = 117, OG = 118
  }

  export interface IAtomData {
    position?: Float32Array;
    color?: Float32Array;
    picking?: AtomPicker;
    radius?: Float32Array;
    index?: Uint32Array;
  }

  export interface IAtomDataFields {
    position?: boolean;
    color?: boolean;
    picking?: boolean;
    radius?: boolean;
    index?: boolean;
  }

  export interface IAtomDataParams {
    what?: IAtomDataFields;
    colorParams?: { scheme: string } & IColormakerParameters;
    radiusParams?: IRadiusParams;
    atomSet?: BitArray;
  }

  export interface IBondData {
    position1?: Float32Array;
    position2?: Float32Array;
    color?: Float32Array;
    color2?: Float32Array;
    picking?: AtomPicker;
    radius?: Float32Array;
    radius2?: Float32Array;
  }

  export interface IBondDataFields {
    position?: boolean;
    color?: boolean;
    picking?: boolean;
    radius?: boolean;
    index?: boolean;
  }

  export interface IBondDataParams {
    what?: IBondDataFields;
    colorParams?: { scheme: string } & IColormakerParameters;
    radiusParams?: IRadiusParams;
    bondStore?: BondStore;
    bondSet?: BitArray;
    multipleBond?: 'off' | 'symmetric' | 'offset';
    bondScale?: number;
    bondSpacing?: number;
    radius2?: boolean;
  }

  export interface IData {
    structure: Structure;
    '@spatialLookup'?: SpatialHash;
    '@valenceModel'?: IValenceModel;
  }

  // tslint:disable-next-line:no-unnecessary-class
  export class Entity {}

  export interface IRadiusParams {
    scale: number;
    radius: number;
  }

  export interface IResidueBonds {
    atomIndices1: number[];
    atomIndices2: number[];
    bondOrders: number[];
  }

  /**
   * Structure
   *
   * @export
   */
  export class Structure {
    // Properties
    // tslint:disable:variable-name
    public _ap: AtomProxy;
    public _bp: BondProxy;
    public _cp: ChainProxy;
    public _hasCoords?: boolean;
    public _rp: ResidueProxy;
    // tslint:enable:variable-name

    public atomCount: number;
    public atomMap: AtomMap;
    public atomSet: BitArray;
    public atomSetCache: { [k: string]: BitArray };
    public atomSetDict: { [k: string]: BitArray };
    public atomStore: AtomStore;
    public backboneBondStore: BondStore;
    public biomolDict: { [k: string]: Assembly };
    public bondCount: number;
    public bondHash: BondHash;
    public bondSet: BitArray;
    public bondStore: BondStore;
    public boundingBox: Box3;
    public boxes: Float32Array[];
    public center: Vector3;
    public chainStore: ChainStore;
    public data: IData;
    public entityList: Entity[];
    public extraData: IStructureExtraData;
    public frames: Float32Array[];
    public header: IStructureHeader;
    public id: string;
    public modelStore: ModelStore;
    public name: string;
    public path: string;
    public residueMap: ResidueMap;
    public residueStore: ResidueStore;
    public rungBondStore: BondStore;
    public signals: {
      refreshed: Signal;
    };
    public spatialHash?: SpatialHash;
    public title: string;
    public trajectory?: object;
    public unitcell?: Unitcell;
    public validation?: Validation;

    // Accessors
    // tslint:disable-next-line:no-reserved-keywords
    public type: string;

    /**
     * Creates an instance of Structure.
     * @param [name] Structure name.
     * @param [path] Source path.
     */
    constructor(name?: string, path?: string);

    // Methods
    /**
     * Gets the center of the (selected) structure atoms.
     *
     * @returns The center.
     */
    public atomCenter(selection?: Selection): Vector3;

    /**
     * Calls dispose() method of property objects. Unsets properties to help garbage collection.
     */
    public dispose(): void;

    /**
     * Atom iterator.
     *
     * @param callback The callback.
     */
    public eachAtom(callback: (entity: AtomProxy) => void, selection?: Selection): void;

    /**
     * Bond iterator.
     *
     * @param callback The callback.
     */
    public eachBond(callback: (entity: BondProxy) => void, selection?: Selection): void;

    /**
     * Chain iterator.
     *
     * @param callback The callback.
     */
    public eachChain(callback: (entity: ChainProxy) => void, selection?: Selection): void;

    /**
     * Entity iterator.
     *
     * @param callback The callback.
     */
    public eachEntity(callback: (entity: Entity) => void, selection?: Selection): void;

    /**
     * Model iterator.
     *
     * @param callback The callback.
     */
    public eachModel(callback: (entity: ModelProxy) => void, selection?: Selection): void;

    /**
     * Polymer iterator
     *
     * @param callback The callback.
     */
    public eachPolymer(callback: (entity: Polymer) => void, selection?: Selection): void;

    /**
     * Residue iterator.
     *
     * @param callback The callback.
     */
    public eachResidue(callback: (entity: ResidueProxy) => void, selection?: Selection): void;

    /**
     * Multi-residue iterator.
     *
     * @param n Window size.
     * @param callback The callback.
     */
    public eachResidueN(n: number, callback: (...entityArray: ResidueProxy[]) => void): void;

    public finalizeAtoms(): void;
    public finalizeBonds(): void;
    public getAtomData(params: IAtomDataParams): IAtomData;
    public getAtomIndices(selection?: Selection): undefined | Uint32Array;
    public getAtomProxy(index?: undefined | number): AtomProxy;

    /**
     * Get a set of atoms.
     *
     * @param [selection] Object defining how to initialize the atom set
     *
     * Boolean: Init with value.
     *
     * Selection: Init with selection.
     *
     * BitArray: Return bit array.
     *
     * @returns Set of atoms.
     */
    public getAtomSet(selection?: boolean | Selection | BitArray): BitArray;

    /**
     * Get set of all atoms within the groups of a selection.
     *
     * @param selection The selection object.
     * @returns  Set of atoms.
     */
    public getAtomSetWithinGroup(selection: boolean | Selection): BitArray;

    /**
     * Get set of atoms around a point.
     *
     * @param point The point.
     * @param radius Radius to select within.
     * @returns Set of atoms.
     */
    public getAtomSetWithinPoint(point: Vector3 | AtomProxy, radius: number): BitArray;

    /**
     * Get set of atoms around a set of atoms from a selection.
     *
     * @param selection The selection object.
     * @param radius Radius to select within
     * @returns Set of atoms.
     */
    public getAtomSetWithinSelection(selection: boolean | Selection | BitArray, radius: number): BitArray;

    /**
     * Get set of atoms within a volume
     *
     * @param volume The volume.
     * @param radius Radius to select within.
     * @param minValue Minimum value to be considered as within the volume.
     * @param maxValue Maximum value to be considered as within the volume.
     * @param outside Use only values falling outside of the min/max values.
     * @returns Set of atoms.
     */
    public getAtomSetWithinVolume(
      volume: Volume,
      radius: number,
      minValue: number,
      maxValue: number,
      outside: boolean,
    ): BitArray;

    public getBackboneAtomData(params: IAtomDataParams): IAtomData;
    public getBackboneBondData(params: IBondDataParams): IBondData;
    public getBackboneBondSet(): BitArray;
    public getBondData(params: IBondDataParams): IBondData;
    public getBondProxy(index?: undefined | number): BondProxy;
    public getBondSet(): BitArray;

    /**
     * Gets the bounding box of the (selected) structure atoms.
     *
     * @returns The box.
     */
    public getBoundingBox(selection?: Selection, box?: Box3): Box3;

    public getChainProxy(index?: undefined | number): ChainProxy;

    /**
     * Get number of unique chainnames
     *
     * @param [selection] Limit count to selection.
     * @returns Count.
     */
    public getChainnameCount(selection?: Selection): number;

    public getModelProxy(index?: undefined | number): ModelProxy;

    /**
     * Gets the principal axes of the (selected) structure atoms.
     *
     * @returns The principal axes.
     */
    public getPrincipalAxes(selection?: Selection): PrincipalAxes;

    public getResidueProxy(index?: undefined | number): ResidueProxy;
    public getRungAtomData(params: IAtomDataParams): IAtomData;
    public getRungBondData(params: IBondDataParams): IBondData;
    public getRungBondSet(): BitArray;
    public getSelection(): false | Selection;
    public getSequence(selection?: Selection): string[];
    public getStructure(): Structure | StructureView;
    public getView(selection: Selection): StructureView;
    public hasCoords(): boolean;
    public init(name: string, path: string): void;
    public refreshPosition(): void;
    public updatePosition(position: Float32Array | number[]): void;
  }

  export interface IStructureExtraData {
    cif?: object;
    sdf?: object[];
  }

  export interface IStructureHeader {
    releaseDate?: string;
    depositionDate?: string;
    resolution?: number;
    rFree?: number;
    rWork?: number;
    experimentalMethods?: string[];
  }

  /**
   * View on the structure, restricted to the selection.
   *
   * @export
   */
  export class StructureView extends Structure {
    // Properties
    public selection: Selection;
    public structure: Structure;

    /**
     * Creates an instance of StructureView.
     *
     * @param structure The structure.
     * @param selection The selection.
     */
    constructor(structure: Structure, selection: Selection);

    // Methods
    /**
     * Updates atomSet, bondSet, atomSetCache, atomCount, bondCount, boundingBox, center.
     *
     * Emits {Structure.signals.refreshed} when refreshed.
     */
    public refresh(): void;

    public setSelection(selection: Selection): void;
  }

  export class Validation {
    // Properties
    public atomDict: { [k: string]: boolean | number };
    public clashArray: Array<{ [k: string]: string }>;
    public clashDict: { [k: string]: { [k: string]: string } };
    public clashSele: string;
    public geoAtomDict: { [k: string]: { [k: string]: number } };
    public geoDict: { [k: string]: number };
    public name: string;
    public path: string;
    public rsrzDict: { [k: string]: number };
    public rsccDict: { [k: string]: number };

    // Accessors
    // tslint:disable-next-line:no-reserved-keywords
    public type: string;

    constructor(name: string, path: string);

    public fromXml(xml: XMLDocument): void;
    public getClashData(params: {
      color: number | string | Color;
      structure: Structure;
    }): {
      position1: Float32Array;
      position2: Float32Array;
      color: Float32Array;
      color2: Float32Array;
      radius: Float32Array;
      picking: ClashPicker;
    };
  }
}
