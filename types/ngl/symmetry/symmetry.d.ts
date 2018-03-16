// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Box3, Matrix4, Vector3 } from 'three';

  /**
   * Assembly of transformed parts of a Structure
   *
   * @export
   * @class Assembly
   */
  export class Assembly {
    // Properties
    /** Assembly name. */
    public name: string;
    public partList: AssemblyPart[];

    // Accessors
    public type: string;

    /**
     * Creates an instance of Assembly.
     * @param {string} [name] Assembly name.
     * @memberof Assembly
     */
    constructor(name?: string);

    // Methods
    /**
     * Add transformed parts to the assembly
     * @example const m1 = new NGL.Matrix4().set(...);
     * const m2 = new NGL.Matrix4().set(...);
     * const assembly = new NGL.Assembly("myAssembly");
     * // Add part that transforms chain 'A' and 'B' using matrices m1 and m2.
     * assembly.addPart([ m1, m2 ], [ "A", "B" ]);
     *
     * @param {Matrix4[]} [matrixList] Array of 4x4 transformation matrices.
     * @param {string[]} [chainList] Array of chain names.
     * @returns {AssemblyPart} The added assembly part.
     * @memberof Assembly
     */
    public addPart(matrixList?: Matrix4[], chainList?: string[]): AssemblyPart;

    /**
     * Get the number of atom for a given structure
     *
     * @param {Structure} structure The given structure.
     * @returns {number} Number of atoms in the assembly.
     * @memberof Assembly
     */
    public getAtomCount(structure: Structure): number;

    public getBoundingBox(structure: Structure): Box3;
    public getCenter(structure: Structure): Vector3;

    /**
     * Get number of instances the assembly will produce, i.e. the number of transformations performed by the assembly.
     *
     * @returns {number} Number of instances.
     * @memberof Assembly
     */
    public getInstanceCount(): number;

    /**
     * Get the number of residues for a given structure.
     *
     * @param {Structure} structure The given structure.
     * @returns {number} Number of residues in the assembly.
     * @memberof Assembly
     */
    public getResidueCount(structure: Structure): number;

    public getSelection(): Selection;

    /**
     * Determine if the assembly is the full and untransformed structure.
     *
     * @param {Structure} structure The given structure
     * @returns {boolean} Whether the assembly is identical to the structure.
     * @memberof Assembly
     */
    public isIdentity(structure: Structure): boolean;
  }

  export class AssemblyPart {
    // Accessors
    public type: string;

    // Properties
    public chainList: string[];
    public matrixList: Matrix4[];

    constructor(matrixList: Matrix4[], chainList: string[]);

    public getAtomCount(structure: Structure): number;

    public getResidueCount(structure: Structure): number;

    public getBoundingBox(structure: Structure): Box3;

    public getSelection(): Selection;

    public getView(structure: Structure): Structure | StructureView;

    public getInstanceList(): Array<{ id: number; matrix: Matrix4; name: number }>;
  }

  export class Unitcell {}
}
