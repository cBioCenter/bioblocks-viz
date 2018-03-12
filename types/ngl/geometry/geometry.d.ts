// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Box3 } from 'three';

  export interface IPositions {
    x: ArrayLike<number>;
    y: ArrayLike<number>;
    z: ArrayLike<number>;
  }

  export interface IShapeParameters {
    aspectRatio: number;
    sphereDetail: number;
    radialSegments: number;
    disableImpostor: boolean;
    openEnded: boolean;
    dashedCylinder: boolean;
    labelParams: Partial<
      {
        fontFamily: 'sans-serif' | 'monospace' | 'serif';
        fontStyle: 'normal' | 'italic';
        fontWeight: 'normal' | 'bold';
        fontSize: number;
        xOffset: number;
        yOffset: number;
        zOffset: number;
        attachment:
          | 'bottom-left'
          | 'bottom-center'
          | 'bottom-right'
          | 'middle-left'
          | 'middle-center'
          | 'middle-right'
          | 'top-left'
          | 'top-center'
          | 'top-right';
        showBorder: boolean;
        borderColor: string | number;
        borderWidth: number;
        showBackground: boolean;
        backgroundColor: string | number;
        backgroundMargin: number;
        backgroundOpacity: number;
        forceTransparent: boolean;
        fixedSize: boolean;
      } & {
        opaqueBack: boolean;
        side: 'double' | 'front' | 'back';
        opacity: number;
        depthWrite: boolean;
        clipNear: number;
        clipRadius: number;
        clipCenter: any;
        flatShaded: boolean;
        wireframe: boolean;
        roughness: number;
        metalness: number;
        diffuse: number;
        diffuseInterior: boolean;
        useInteriorColor: boolean;
        interiorColor: number;
        interiorDarkening: number;
        forceTransparent: boolean;
        matrix: any;
        disablePicking: boolean;
        sortParticles: boolean;
        background: boolean;
      }
    >;
    pointSize: number;
    sizeAttenuation: boolean;
    useTexture: boolean;
    lineWidth: number;
  }

  export class Shape {
    constructor(name?: string, params?: Partial<IShapeParameters>);
  }

  export class ShapePrimitive {}

  export class SpatialHash {
    // Properties
    public exp: number;

    public minX: number;
    public minY: number;
    public minZ: number;

    public boundX: number;
    public boundY: number;
    public boundZ: number;

    public grid: Uint32Array;
    public bucketCount: Uint16Array;
    public bucketOffset: Uint32Array;
    public bucketArray: Int32Array;

    public xArray: ArrayLike<number>;
    public yArray: ArrayLike<number>;
    public zArray: ArrayLike<number>;

    constructor(positions: IPositions, boundingBox?: Box3);

    // Methods
    public within(x: number, y: number, z: number, r: number): number[];
    public eachWithin(
      x: number,
      y: number,
      z: number,
      r: number,
      callback: (atomIndex: number, dSq: number) => void,
    ): void;
  }
}
