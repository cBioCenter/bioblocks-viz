// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Matrix4, Quaternion, Vector3 } from 'three';

  export class Matrix {
    // Properties
    public cols: number;
    public data: Float32Array;
    public rows: number;
    public size: number;

    constructor(cols: number, rows: number);

    public copyTo(matrix: Matrix): void;
  }

  export interface IProjectedScale {
    d1a: number;
    d2a: number;
    d3a: number;
    d1b: number;
    d2b: number;
    d3b: number;
  }

  /**
   * Principal axes.
   *
   * @export
   * @class PrincipalAxes
   */
  export class PrincipalAxes {
    // Properties
    public begA: Vector3;
    public begB: Vector3;
    public begC: Vector3;

    public center: Vector3;

    public endA: Vector3;
    public endB: Vector3;
    public endC: Vector3;

    public normVecA: Vector3;
    public normVecB: Vector3;
    public normVecC: Vector3;

    public vecA: Vector3;
    public vecB: Vector3;
    public vecC: Vector3;

    /**
     * Creates an instance of PrincipalAxes.
     * @param {Matrix} points - 3 by N matrix
     * @memberof PrincipalAxes
     */
    constructor(points: Matrix);

    // Methods
    /**
     * Get the basis matrix describing the axes.
     *
     * @param {Matrix4} [optionalTarget]
     * @returns {Matrix4}
     * @memberof PrincipalAxes
     */
    public getBasisMatrix(optionalTarget?: Matrix4): Matrix4;

    /**
     * Get a quaternion describing the axes rotation.
     *
     * @param {any} [optionalTarget=new Quaternion()]
     * @memberof PrincipalAxes
     */
    public getRotationQuaternion(optionalTarget?: Quaternion): Quaternion;

    /**
     * Get the scale/length for each dimension for a box around the axes to enclose the atoms of a structure.
     *
     * @param {Structure} structure The structure.
     * @return {IProjectedScale} scale
     * @memberof PrincipalAxes
     */
    public getProjectedScaleForAtoms(structure: Structure): IProjectedScale;
  }
}
