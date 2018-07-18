// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Vector3 } from 'three';

  /**
   * Atom proxy.
   *
   * @export
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
     * @param structure The structure.
     * @param [index] The index.
     */
    constructor(structure: Structure, index?: number);

    // Methods
    public bondToElementCount(element: Elements): number;
    public clone(): AtomProxy;

    /**
     * If connected to another atom.
     *
     * @param atom The other atom.
     * @returns Flag.
     */
    public connectedTo(atom: AtomProxy): boolean;

    /**
     * Distance to another atom.
     *
     * @param atom The other atom.
     * @returns The distance.
     */
    public distanceTo(atom: AtomProxy): number;

    /**
     * Iterate over each bond.
     *
     * @param callback Iterator callback function.
     */
    public eachBond(callback: () => void, bp?: BondProxy): void;

    /**
     * Iterate over each bonded atom.
     *
     * @param callback iterator callback function.
     */
    public eachBondedAtom(callback: () => void, ap?: AtomProxy): void;
    public getDefaultValence(): number;
    public getOuterShellElectronCount(): number;

    /**
     * Get intra group/residue bonds.
     *
     * @param [firstOnly] Immediately return the first connected atomIndex.
     * @returns Connected atomIndices.
     */
    public getResidueBonds(firstOnly?: boolean): undefined | number | number[];
    public getValenceList(): number[];

    /**
     * Check if this atom is bonded to the given atom, assumes both atoms are from the same structure.
     *
     * @param ap The given atom.
     * @returns Whether a bond exists or not.
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
     * @returns Flag
     */
    public isBackbone(): boolean;
    public isBonded(): boolean;

    /**
     * If atom is part of a coarse-grain group.
     *
     * @returns Flag
     */
    public isCg(): boolean;
    public isDiatomicNonmetal(): boolean;

    /**
     * If atom is part of a dna.
     *
     * @returns Flag.
     */
    public isDna(): boolean;
    public isHalogen(): boolean;

    /**
     * If atom is part of a helix.
     *
     * @returns Flag.
     */
    public isHelix(): boolean;

    /**
     * If atom is part of a hetero group.
     *
     * @returns Flag.
     */
    public isHetero(): boolean;

    /**
     * If atom is part of an ion.
     *
     * @returns Flag.
     */
    public isIon(): boolean;
    public isLanthanide(): boolean;
    public isMetal(): boolean;
    public isNobleGas(): boolean;
    public isNonmetal(): boolean;

    /**
     * If atom is part of a nucleic molecule.
     *
     * @returns Flag.
     */
    public isNucleic(): boolean;
    public isPolyatomicNonmetal(): boolean;

    /**
     * If atom is part of a polymer.
     *
     * @returns Flag.
     */
    public isPolymer(): boolean;
    public isPostTransitionMetal(): boolean;

    /**
     * If atom is part of a protein molecule.
     *
     * @returns Flag.
     */
    public isProtein(): boolean;

    /**
     * If atom is part of a ring.
     *
     * @returns Flag.
     */
    public isRing(): boolean;

    /**
     * If atom is part of a rna.
     *
     * @returns Flag.
     */
    public isRna(): boolean;

    /**
     * If atom is part of a saccharide.
     *
     * @returns Flag.
     */
    public isSaccharide(): boolean;

    /**
     * If atom is part of a sheet.
     */
    public isSheet(): boolean;

    /**
     * If atom is part of a sidechain.
     *
     * @returns Flag.
     */
    public isSidechain(): boolean;
    public isTrace(): boolean;
    public isTransitionMetal(): boolean;

    /**
     * If atom is part of a turn.
     *
     * @returns Flag.
     */
    public isTurn(): boolean;

    /**
     * If atom is part of a water molecule.
     *
     * @returns Flag.
     */
    public isWater(): boolean;

    /**
     * Add vector to atom position.
     *
     * @param v Input vector.
     * @returns This object.
     */
    public positionAdd(v: Vector3 | AtomProxy): this;

    /**
     * Set atom position from array
     *
     * @param array Input array.
     * @returns This object.
     */
    public positionFromArray(array: NumberArray, offset?: number): this;

    /**
     * Set atom position from vector.
     *
     * @param v Input vector.
     * @returns This object.
     */
    public positionFromVector3(v: Vector3): this;

    /**
     * Subtract vector from atom position.
     *
     * @param v Input vector.
     * @returns This object.
     */
    public positionSub(v: Vector3 | AtomProxy): this;

    /**
     * Write atom position to array.
     *
     * @returns Target array.
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
     * @returns Target vector.
     */
    public positionToVector3(v?: Vector3): Vector3;
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
     * @param structure The structure.
     * @param [index] The index.
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Calculate shift direction for displaying double/triple bonds.
     * @returns The shift direction vector.
     */
    public calculateShiftDir(v?: Vector3): Vector3;

    /**
     * Clone object.
     *
     * @returns Cloned bond.
     */
    public clone(): BondProxy;

    public getOtherAtom(atom: AtomProxy): AtomProxy;

    public getOtherAtomIndex(atomIndex: number): number;

    /**
     * Get reference atom index for the bond.
     *
     * @returns Atom index, or undefined if unavailable.
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
     * @param structure The structure.
     * @param [index] The index.
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Clone object.
     *
     * @returns Cloned chain.
     */
    public clone(): ChainProxy;

    /**
     * Atom iterator.
     *
     * @param callback The callback.
     */
    public eachAtom(callback: (ap: AtomProxy) => void, selection?: Selection): void;

    /**
     * Polymer iterator.
     *
     * @param callback The callback.
     */
    public eachPolymer(callback: (p: Polymer) => void, selection?: Selection): void;

    /**
     * Residue iterator.
     *
     * @param callback The callback.
     */
    public eachResidue(callback: (rp: ResidueProxy) => void, selection?: Selection): void;

    /**
     * Multi-residue iterator.
     *
     * @param n Window size.
     * @param callback The callback.
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
     * @param structure The structure.
     * @param [index] The index.
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Clone object.
     *
     * @returns Cloned model.
     */
    public clone(): ModelProxy;

    /**
     * Atom iterator.
     *
     * @param callback The callback.
     */
    public eachAtom(callback: (ap: AtomProxy) => void, selection?: Selection): void;

    /**
     * Chain iterator.
     *
     * @param callback The callback.
     */
    public eachChain(callback: (p: ChainProxy) => void, selection?: Selection): void;

    /**
     * Polymer iterator.
     *
     * @param callback The callback.
     */
    public eachPolymer(callback: (p: Polymer) => void, selection?: Selection): void;

    /**
     * Residue iterator.
     *
     * @param callback The callback.
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
     * @param structure The structure.
     * @param residueIndexStart The index of the first residue.
     * @param residueIndexEnd The index of the last residue.
     */
    constructor(structure: Structure, residueIndexStart: number, residueIndexEnd: number);

    // Methods
    /**
     * Atom iterator.
     *
     * @param callback The callback.
     */
    public eachAtom(callback: (ap: AtomProxy) => void, selection?: Selection): void;

    public eachAtomN(n: number, callback: (...apArray: AtomProxy[]) => void, type: string): void;

    /**
     * Polymer iterator.
     *
     * @param callback The callback.
     */
    public eachPolymer(callback: (p: Polymer) => void, selection?: Selection): void;

    /**
     * Residue iterator.
     *
     * @param callback The callback.
     */
    public eachResidue(callback: (rp: ResidueProxy) => void, selection?: Selection): void;

    public getAtomIndexByType(index: number, type: string): undefined | number;
    public getBackboneType(position: number): number;
    public getMoleculeType(): number;

    /**
     * If atom is part of a coarse-grain group.
     *
     * @returns Flag.
     */
    public isCg(): boolean;

    /**
     * If atom is part of a nucleic molecule.
     *
     * @returns Flag.
     */
    public isNucleic(): boolean;

    /**
     * If first residue is from a protein.
     *
     * @returns Flag.
     */
    public isProtein(): boolean;

    public qualifiedName(): string;
  }

  /**
   * Residue proxy.
   *
   * @export
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
     * @param structure The structure.
     * @param [index] The index.
     */
    constructor(structure: Structure, index?: number);

    // Methods
    /**
     * Clone object.
     *
     * @returns Cloned residue.
     */
    public clone(): ResidueProxy;

    /**
     * If residue is connected to another.
     *
     * @param rNext The other residue.
     * @returns Flag.
     */
    public connectedTo(rNext: ResidueProxy): boolean;

    /**
     * Atom iterator.
     *
     * @param callback The callback.
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
     * @returns Flag.
     */
    public isCg(): boolean;

    /**
     * If residue is dna.
     *
     * @returns Flag.
     */
    public isDna(): boolean;

    /**
     * If residue is part of a helix.
     *
     * @returns Flag.
     */
    public isHelix(): boolean;

    /**
     * If residue is hetero.
     *
     * @returns Flag.
     */
    public isHetero(): boolean;

    /**
     * If residue is an ion.
     *
     * @returns Flag.
     */
    public isIon(): boolean;

    /**
     * If residue is nucleic.
     *
     * @returns Flag.
     */
    public isNucleic(): boolean;

    /**
     * If residue is from a polymer.
     *
     * @returns Flag.
     */
    public isPolymer(): boolean;

    /**
     * If residue is from a protein.
     *
     * @returns Flag.
     */
    public isProtein(): boolean;

    /**
     * If residue is rna.
     *
     * @returns Flag.
     */
    public isRna(): boolean;

    /**
     * If residue is a saccharide.
     *
     * @returns Flag.
     */
    public isSaccharide(): boolean;

    /**
     * If residue is part of a sheet.
     *
     * @returns Flag.
     */
    public isSheet(): boolean;

    /**
     * If residue is part of a turn
     *
     * @returns Flag.
     */
    public isTurn(): boolean;

    /**
     * If residue is a water molecule.
     *
     * @returns Flag.
     */
    public isWater(): boolean;

    /**
     * Write residue center position to array.
     *
     * @returns Target array.
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
