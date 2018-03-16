// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Vector3 } from 'three';

  /**
   * Atom proxy.
   *
   * @export
   * @class AtomProxy
   */
  export class AtomProxy {
    // Accessors
    /** Alternate location identifier. */
    public altloc: string;

    /** Aromaticity flag. */
    public aromat: number;

    public atomType: AtomType;
    public atomname: string;

    /** B-factor value. */
    public bfactor: number;
    public bondCount: number;
    public bondHash: undefined | BondHash;
    public chainIndex: number;
    public chainid: string;

    /** Covalent radius. */
    public covalent: number;

    public element: string;

    /** Molecular entity. */
    public entity: Entity;

    public entityIndex: number;

    /** Formal charge. */
    public formalCharge: null | number;

    /** Hetero flag. */
    public hetero: number;

    /** Insertion code. */
    public inscode: string;
    public modelIndex: number;

    /** Atomic number. */
    public number: number;

    /** Occupancy value. */
    public occupancy: number;

    /** Partial charge. */
    public partialCharge: null | number;
    public residue: ResidueProxy;
    public residueAtomOffset: number;
    public residueIndex: number;
    public residueType: ResidueType;

    /** Residue name. */
    public resname: string;

    /** Residue number/label. */
    public resno: number;

    /** Serial number. */
    public serial: number;

    /** Secondary structure code. */
    public sstruc: string;

    /** Van-der-Waals radius. */
    public vdw: number;

    /** X coordinate. */
    public x: number;

    /** Y coordinate. */
    public y: number;

    /** Z coordinate. */
    public z: number;

    // Properties
    public atomMap: AtomMap;
    public atomStore: AtomStore;
    public chainStore: ChainStore;
    public index: number;
    public residueMap: ResidueMap;
    public residueStore: ResidueStore;
    public structure: Structure;

    /**
     * Creates an instance of AtomProxy.
     * @param {Structure} structure The structure.
     * @param {number} [index] The index.
     * @memberof AtomProxy
     */
    constructor(structure: Structure, index?: number);

    // Methods
    public bondToElementCount(element: Elements): number;
    public clone(): AtomProxy;

    /**
     * If connected to another atom.
     *
     * @param {AtomProxy} atom The other atom.
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public connectedTo(atom: AtomProxy): boolean;

    /**
     * Distance to another atom.
     *
     * @param {AtomProxy} atom The other atom.
     * @returns {number} The distance.
     * @memberof AtomProxy
     */
    public distanceTo(atom: AtomProxy): number;

    /**
     * Iterate over each bond.
     *
     * @param {() => void} callback Iterator callback function.
     * @param {BondProxy} [bp]
     * @memberof AtomProxy
     */
    public eachBond(callback: () => void, bp?: BondProxy): void;

    /**
     * Iterate over each bonded atom.
     *
     * @param {() => void} callback iterator callback function.
     * @param {AtomProxy} [ap]
     * @memberof AtomProxy
     */
    public eachBondedAtom(callback: () => void, ap?: AtomProxy): void;
    public getDefaultValence(): number;
    public getOuterShellElectronCount(): number;

    /**
     * Get intra group/residue bonds.
     *
     * @param {boolean} [firstOnly] Immediately return the first connected atomIndex.
     * @returns {(undefined | number | number[])} Connected atomIndices.
     * @memberof AtomProxy
     */
    public getResidueBonds(firstOnly?: boolean): undefined | number | number[];
    public getValenceList(): number[];

    /**
     * Check if this atom is bonded to the given atom, assumes both atoms are from the same structure.
     *
     * @param {AtomProxy} ap The given atom.
     * @returns {boolean}  Whether a bond exists or not.
     * @memberof AtomProxy
     */
    public hasBondTo(ap: AtomProxy): boolean;
    public hasBondToElement(element: Elements): boolean;
    public isActinide(): boolean;
    public isAlkaliMetal(): boolean;
    public isAlkalineEarthMetal(): boolean;
    public isAromatic(): boolean;

    /**
     * If atom is part of a backbone.
     *
     * @returns {boolean} Flag
     * @memberof AtomProxy
     */
    public isBackbone(): boolean;
    public isBonded(): boolean;

    /**
     * If atom is part of a coarse-grain group.
     *
     * @returns {boolean} Flag
     * @memberof AtomProxy
     */
    public isCg(): boolean;
    public isDiatomicNonmetal(): boolean;

    /**
     * If atom is part of a dna.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isDna(): boolean;
    public isHalogen(): boolean;

    /**
     * If atom is part of a helix.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isHelix(): boolean;

    /**
     * If atom is part of a hetero group.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isHetero(): boolean;

    /**
     * If atom is part of an ion.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isIon(): boolean;
    public isLanthanide(): boolean;
    public isMetal(): boolean;
    public isNobleGas(): boolean;
    public isNonmetal(): boolean;

    /**
     * If atom is part of a nucleic molecule.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isNucleic(): boolean;
    public isPolyatomicNonmetal(): boolean;

    /**
     * If atom is part of a polymer.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isPolymer(): boolean;
    public isPostTransitionMetal(): boolean;

    /**
     * If atom is part of a protein molecule.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isProtein(): boolean;

    /**
     * If atom is part of a ring.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isRing(): boolean;

    /**
     * If atom is part of a rna.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isRna(): boolean;

    /**
     * If atom is part of a saccharide.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isSaccharide(): boolean;

    /**
     * If atom is part of a sheet.
     *
     * @returns {boolean}
     * @memberof AtomProxy
     */
    public isSheet(): boolean;

    /**
     * If atom is part of a sidechain.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isSidechain(): boolean;
    public isTrace(): boolean;
    public isTransitionMetal(): boolean;

    /**
     * If atom is part of a turn.
     *
     * @returns {boolean} Flag
     * @memberof AtomProxy
     */
    public isTurn(): boolean;

    /**
     * If atom is part of a water molecule.
     *
     * @returns {boolean} Flag.
     * @memberof AtomProxy
     */
    public isWater(): boolean;

    /**
     * Add vector to atom position.
     *
     * @param {(Vector3 | AtomProxy)} v Input vector.
     * @returns {this} This object.
     * @memberof AtomProxy
     */
    public positionAdd(v: Vector3 | AtomProxy): this;

    /**
     * Set atom position from array
     *
     * @param {NumberArray} array Input array.
     * @param {number} [offset]
     * @returns {this} This object.
     * @memberof AtomProxy
     */
    public positionFromArray(array: NumberArray, offset?: number): this;

    /**
     * Set atom position from vector.
     *
     * @param {Vector3} v Input vector.
     * @returns {this} This object.
     * @memberof AtomProxy
     */
    public positionFromVector3(v: Vector3): this;

    /**
     * Subtract vector from atom position.
     *
     * @param {(Vector3 | AtomProxy)} v Input vector.
     * @returns {this} This object.
     * @memberof AtomProxy
     */
    public positionSub(v: Vector3 | AtomProxy): this;

    /**
     * Write atom position to array.
     *
     * @param {NumberArray} [array]
     * @param {number} [offset]
     * @returns {(number[]
     *       | Uint8Array
     *       | Int8Array
     *       | Int16Array
     *       | Int32Array
     *       | Uint16Array
     *       | Uint32Array
     *       | Float32Array
     *       | Uint8ClampedArray
     *       | Float64Array)} Target array.
     * @memberof AtomProxy
     */
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

    /**
     * Write atom position to vector.
     *
     * @param {Vector3} v
     * @returns {Vector3} Target vector.
     * @memberof AtomProxy
     */
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

  /**
   * Bond proxy.
   *
   * @export
   * @class BondProxy
   */
  export class BondProxy {
    // Properties
    public bondStore: BondStore;
    public index: number;
    public structure: Structure;

    // Accessors
    public atom1: AtomProxy;
    public atom2: AtomProxy;
    public atomIndex1: number;
    public atomIndex2: number;
    public bondOrder: number;

    /**
     * Creates an instance of BondProxy.
     *
     * @param {Structure} structure The structure.
     * @param {number} [index] The index.
     * @memberof BondProxy
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Calculate shift direction for displaying double/triple bonds.
     *
     * @param {Vector3} [v]
     * @returns {Vector3} The shift direction vector.
     * @memberof BondProxy
     */
    public calculateShiftDir(v?: Vector3): Vector3;

    /**
     * Clone object.
     *
     * @returns {BondProxy} Cloned bond.
     * @memberof BondProxy
     */
    public clone(): BondProxy;

    public getOtherAtom(atom: AtomProxy): AtomProxy;

    public getOtherAtomIndex(atomIndex: number): number;

    /**
     * Get reference atom index for the bond.
     *
     * @returns {(undefined | number)} Atom index, or undefined if unavailable.
     * @memberof BondProxy
     */
    public getReferenceAtomIndex(): undefined | number;

    public qualifiedName(): string;
    public toObject(): {
      atomIndex1: number;
      atomIndex2: number;
      bondOrder: number;
    };
  }

  /**
   * Chain proxy.
   *
   * @export
   * @class ChainProxy
   */
  export class ChainProxy {
    // Properties
    public chainStore: ChainStore;
    public index: number;
    public residueStore: ResidueStore;

    /** The structure. */
    public structure: Structure;

    // Accessors
    /** Atom count. */
    public atomCount: number;

    public atomEnd: number;
    public atomOffset: number;

    /** Chain ID. */
    public chainId: string;

    /** Chain name. */
    public chainname: string;

    public entity: Entity;
    public entityIndex: number;
    public model: ModelProxy;
    public modelIndex: number;
    public residueCount: number;
    public residueEnd: number;
    public residueOffset: number;

    /**
     * Creates an instance of ChainProxy.
     *
     * @param {Structure} structure The structure.
     * @param {number} [index] The index.
     * @memberof ChainProxy
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Clone object.
     *
     * @returns {ChainProxy} Cloned chain.
     * @memberof ChainProxy
     */
    public clone(): ChainProxy;

    /**
     * Atom iterator.
     *
     * @param {(ap: AtomProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ChainProxy
     */
    public eachAtom(callback: (ap: AtomProxy) => void, selection?: Selection): void;

    /**
     * Polymer iterator.
     *
     * @param {(p: Polymer) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ChainProxy
     */
    public eachPolymer(callback: (p: Polymer) => void, selection?: Selection): void;

    /**
     * Residue iterator.
     *
     * @param {(rp: ResidueProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ChainProxy
     */
    public eachResidue(callback: (rp: ResidueProxy) => void, selection?: Selection): void;

    /**
     * Multi-residue iterator.
     *
     * @param {number} n Window size.
     * @param {(...rpArray: ResidueProxy[]) => void} callback The callback.
     * @memberof ChainProxy
     */
    public eachResidueN(n: number, callback: (...rpArray: ResidueProxy[]) => void): void;

    public qualifiedName(): string;

    public toObject(): {
      chainname: string;
      index: number;
      residueCount: number;
      residueOffset: number;
    };
  }

  /**
   * Model proxy.
   *
   * @export
   * @class ModelProxy
   */
  export class ModelProxy {
    // Properties
    public chainStore: ChainStore;
    public index: number;
    public modelStore: ModelStore;
    public residueStore: ResidueStore;
    public structure: Structure;

    // Accessors
    public atomCount: number;
    public atomEnd: number;
    public atomOffset: number;
    public chainCount: number;
    public chainEnd: number;
    public chainOffset: number;
    public residueCount: number;
    public residueEnd: number;
    public residueOffset: number;

    /**
     * Creates an instance of ModelProxy.
     *
     * @param {Structure} structure The structure.
     * @param {number} [index] The index.
     * @memberof ModelProxy
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Clone object.
     *
     * @returns {ModelProxy} Cloned model.
     * @memberof ModelProxy
     */
    public clone(): ModelProxy;

    /**
     * Atom iterator.
     *
     * @param {(ap: AtomProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ModelProxy
     */
    public eachAtom(callback: (ap: AtomProxy) => void, selection?: Selection): void;

    /**
     * Chain iterator.
     *
     * @param {(p: ChainProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ModelProxy
     */
    public eachChain(callback: (p: ChainProxy) => void, selection?: Selection): void;

    /**
     * Polymer iterator.
     *
     * @param {(p: Polymer) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ModelProxy
     */
    public eachPolymer(callback: (p: Polymer) => void, selection?: Selection): void;

    /**
     * Residue iterator.
     *
     * @param {(rp: ResidueProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ModelProxy
     */
    public eachResidue(callback: (rp: ResidueProxy) => void, selection?: Selection): void;

    public qualifiedName(): string;

    public toObject(): {
      chainCount: number;
      chainOffset: number;
      index: number;
    };
  }

  /**
   * Polymer
   *
   * @export
   * @class Polymer
   */
  export class Polymer {
    // Properties
    public atomStore: AtomStore;
    public chainStore: ChainStore;
    public isCyclic: boolean;
    public isNextConnected: boolean;
    public isNextNextConnected: boolean;
    public isPrevConnected: boolean;
    public residueCount: number;

    /** The index of the last residue. */
    public residueIndexEnd: number;

    /** The index of the first. residue */
    public residueIndexStart: number;

    public residueStore: ResidueStore;
    public structure: Structure;

    // Accessors
    public chainIndex: number;
    public chainname: string;
    public modelIndex: number;

    /**
     * Creates an instance of Polymer.
     *
     * @param {Structure} structure The structure.
     * @param {number} residueIndexStart The index of the first residue.
     * @param {number} residueIndexEnd The index of the last residue.
     * @memberof Polymer
     */
    constructor(structure: Structure, residueIndexStart: number, residueIndexEnd: number);

    // Methods
    /**
     * Atom iterator.
     *
     * @param {(ap: AtomProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof Polymer
     */
    public eachAtom(callback: (ap: AtomProxy) => void, selection?: Selection): void;

    public eachAtomN(n: number, callback: (...apArray: AtomProxy[]) => void, type: string): void;

    /**
     * Polymer iterator.
     *
     * @param {(p: Polymer) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof Polymer
     */
    public eachPolymer(callback: (p: Polymer) => void, selection?: Selection): void;

    /**
     * Residue iterator.
     *
     * @param {(rp: ResidueProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof Polymer
     */
    public eachResidue(callback: (rp: ResidueProxy) => void, selection?: Selection): void;

    public getAtomIndexByType(index: number, type: string): undefined | number;
    public getBackboneType(position: number): number;
    public getMoleculeType(): number;

    /**
     * If atom is part of a coarse-grain group.
     *
     * @returns {boolean} Flag.
     * @memberof Polymer
     */
    public isCg(): boolean;

    /**
     * If atom is part of a nucleic molecule.
     *
     * @returns {boolean} Flag.
     * @memberof Polymer
     */
    public isNucleic(): boolean;

    /**
     * If first residue is from a protein.
     *
     * @returns {boolean} Flag.
     * @memberof Polymer
     */
    public isProtein(): boolean;

    public qualifiedName(): string;
  }

  /**
   * Residue proxy.
   *
   * @export
   * @class ResidueProxy
   */
  export class ResidueProxy {
    // Properties
    public atomMap: AtomMap;
    public atomStore: AtomStore;
    public chainStore: ChainStore;
    public index: number;
    public residueMap: ResidueMap;
    public residueStore: ResidueStore;
    public structure: Structure;

    // Accessors
    public atomCount: number;
    public atomEnd: number;
    public atomOffset: number;
    public backboneEndAtomIndex: number;
    public backboneStartAtomIndex: number;
    public backboneStartType: number;
    public backboneType: number;
    public chain: ChainProxy;
    public chainIndex: number;
    public chainId: string;
    public chainname: string;
    public direction1AtomIndex: number;
    public direction2AtomIndex: number;
    public entity: Entity;
    public entityIndex: number;
    public hetero: number;

    /** Insertion code. */
    public inscode: string;

    public modelIndex: number;
    public moleculeType: number;
    public residueType: ResidueType;

    /** Residue name. */
    public resname: string;

    /** Residue number/label. */
    public resno: number;

    public rungEndAtomIndex: number;

    /** Secondary structure code. */
    public sstruc: string;

    public traceAtomIndex: number;

    public x: number;
    public y: number;
    public z: number;

    /**
     * Creates an instance of ResidueProxy.
     *
     * @param {Structure} structure The structure.
     * @param {number} [index] The index.
     * @memberof ResidueProxy
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Clone object.
     *
     * @returns {ResidueProxy} Cloned residue.
     * @memberof ResidueProxy
     */
    public clone(): ResidueProxy;

    /**
     * If residue is connected to another.
     *
     * @param {ResidueProxy} rNext The other residue.
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public connectedTo(rNext: ResidueProxy): boolean;

    /**
     * Atom iterator.
     *
     * @param {(ap: AtomProxy) => void} callback The callback.
     * @param {Selection} [selection]
     * @memberof ResidueProxy
     */
    public eachAtom(callback: (ap: AtomProxy) => void, selection?: Selection): void;

    public getAromaticRings(): undefined | number[][];
    public getAtomIndexByName(atomname: string): undefined | number;
    public getAtomType(index: number): AtomType;
    public getAtomnameList(): any[];
    public getBackboneType(position: number): number;
    public getBonds(): IResidueBonds;
    public getNextConnectedResidue(): undefined | ResidueProxy;
    public getPreviousConnectedResidue(residueProxy?: ResidueProxy): any;
    public getResname1(): string;
    public getRings(): undefined | IRingData;
    public hasAtomWithName(atomname: string): boolean;

    /**
     * If residue is coarse-grain.
     *
     * @returns {boolean} Flag
     * @memberof ResidueProxy
     */
    public isCg(): boolean;

    /**
     * If residue is dna.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isDna(): boolean;

    /**
     * If residue is part of a helix.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isHelix(): boolean;

    /**
     * If residue is hetero.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isHetero(): boolean;

    /**
     * If residue is an ion.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isIon(): boolean;

    /**
     * If residue is nucleic.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isNucleic(): boolean;

    /**
     * If residue is from a polymer.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isPolymer(): boolean;

    /**
     * If residue is from a protein.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isProtein(): boolean;

    /**
     * If residue is rna.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isRna(): boolean;

    /**
     * If residue is a saccharide.
     *
     * @returns {boolean}Flag.
     * @memberof ResidueProxy
     */
    public isSaccharide(): boolean;

    /**
     * If residue is part of a sheet.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isSheet(): boolean;

    /**
     * If residue is part of a turn
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isTurn(): boolean;

    /**
     * If residue is a water molecule.
     *
     * @returns {boolean} Flag.
     * @memberof ResidueProxy
     */
    public isWater(): boolean;

    /**
     * Write residue center position to array.
     *
     * @param {NumberArray} [array]
     * @param {number} [offset]
     * @returns {(number[]
     *       | Uint8Array
     *       | Int8Array
     *       | Int16Array
     *       | Int32Array
     *       | Uint16Array
     *       | Uint32Array
     *       | Float32Array
     *       | Uint8ClampedArray
     *       | Float64Array)} Target array.
     * @memberof ResidueProxy
     */
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

    public qualifiedName(noResname?: boolean): string;
    public toObject(): {
      atomCount: number;
      atomOffset: number;
      chainIndex: number;
      index: number;
      resname: string;
      resno: number;
      sstruc: string;
    };
  }
}
