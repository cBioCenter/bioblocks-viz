// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Matrix4 } from 'three';

  export interface IBufferInstance {
    matrix: Matrix4;
  }
}
