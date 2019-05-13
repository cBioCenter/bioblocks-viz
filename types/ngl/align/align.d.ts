// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Matrix4 } from 'three';

  export type SubstitutionMatrix = '' | 'blosum62' | 'blosum62x';

  export class Alignment {
    constructor(
      readonly seq1: string,
      readonly seq2: string,
      readonly gapPenalty = -10,
      readonly gapExtensionPenalty = -1,
      substMatrix: SubstitutionMatrix = 'blosum62',
    );
    public initMatrices(): void;
    public gap(len: number): number;
    public makeScoreFn(): (i: number, j: number) => number;
    public calc(): void;
    public trace(): void;
  }

  export class Superposition {
    public A: Matrix;
    public R: Matrix;
    public U: Matrix;
    public V: Matrix;
    public VH: Matrix;
    public W: Matrix;
    public coords1t: Matrix;
    public coords2t: Matrix;
    public mean1: number[];
    public mean2: number[];
    public transformationMatrix: Matrix4;

    constructor(atoms1: Structure | Float32Array, atoms2: Structure | Float32Array);

    public _superpose(coords1: Matrix, coords2: Matrix): void;
    public prepCoords(atoms: Structure | Float32Array, coords: Matrix, n: number, is4X4: boolean);
    public transform(atoms: Structure | Float32Array): number | Matrix4 | undefined;
  }

  export function superpose(
    s1: Structure,
    s2: Structure,
    align = false,
    sele1 = '',
    sele2 = '',
  ): number | Matrix4 | undefined;
}
