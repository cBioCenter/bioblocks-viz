// tslint:disable:max-classes-per-file
declare module 'ngl' {
  export class Surface {
    // Accessors
    public type: string;

    /**
     * Creates an instance of Surface.
     * @param {string} name Surface name.
     * @param {string} path Source path.
     * @param {object} data Surface data.
     * @memberof Surface
     */
    constructor(name: string, path: string, data: object);

    // Methods
    public dispose(): void;
    public fromGeometry(geometry: any): void;
    public getAtomindex(): undefined | Int32Array;
    public getColor(params: any): Float32Array;
    public getFilteredIndex(sele: any, structure: any): undefined | Uint16Array | Uint32Array;
    public getIndex(): undefined | Uint16Array | Uint32Array;
    public getNormal(): undefined | Float32Array;
    public getPicking(structure: any): AtomPicker | SurfacePicker;
    public getPosition(): undefined | Float32Array;
    public getSize(
      size: any,
      scale: any,
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
     * Set surface data.
     *
     * @param {Float32Array} position Surface positions.
     * @param {Int32Array} index Surface indices.
     * @param {Float32Array} normal Surface normals.
     * @param {Float32Array} color Surface colors.
     * @param {Int32Array} atomindex atom indices.
     * @param {boolean} contour Contour mode flag.
     * @returns {undefined}
     * @memberof Surface
     */
    public set(
      position: Float32Array,
      index: Int32Array,
      normal: Float32Array,
      color: Float32Array,
      atomindex: Int32Array,
      contour: boolean,
    ): undefined;
  }

  export class Volume {}
}
