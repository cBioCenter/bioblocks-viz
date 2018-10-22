import {
  Counter,
  ShapeRepresentationType,
  StructureRepresentationType,
  SurfaceRepresentationType,
  Viewer,
  VolumeRepresentationType,
} from 'ngl';
import { Vector3 } from 'three';

// tslint:disable:max-classes-per-file
declare module 'ngl' {
  export type REPRESENTATION_TYPE =
    | ShapeRepresentationType
    | StructureRepresentationType
    | VolumeRepresentationType
    | SurfaceRepresentationType;

  export interface IRepresentationParameters {
    /**
     * Position of camera for spherical clipping.
     */
    clipCenter: Vector3;

    /**
     * Position of camera near/front clipping plane in percent of scene bounding box.
     */
    clipNear: number;

    /**
     * Radius of clipping sphere.
     */
    clipRadius: number;

    /**
     * Scale value range.
     */
    colorDomain: number[];

    /**
     * Min value.
     */

    'colorDomain.0': number;

    /**
     * Max value.
     */
    'colorDomain.1': number;

    /**
     * Color mode, one of rgb, hsv, hsl, hsi, lab, hcl.
     */
    colorMode: 'hcl' | 'hsi' | 'hsl' | 'hsv' | 'lab' | 'rgb';

    /**
     * Reverse color scale.
     */
    colorReverse: boolean;

    /**
     * color scale, either a string for a predefined scale or an array of colors to be used as the scale.
     */
    colorScale: string;

    /**
     * Color scheme.
     */
    colorScheme: string;

    /**
     * Color value.
     */
    colorValue: Color;

    /**
     * Depth write.
     */
    depthWrite: boolean;

    /**
     * Diffuse color for lighting.
     */
    diffuse: Color;

    /**
     * Diffuse interior, i.e. ignore normal.
     */
    diffuseInterior: Color;

    /**
     * Disable picking.
     */
    disablePicking: boolean;

    /**
     * Render flat shaded.
     */
    flatShaded: boolean;

    /**
     * Interior color.
     */
    interiorColor: Color;

    /**
     * Interior darkening: 0 no darking, 1 fully darkened.
     */
    interiorDarkening: Color;

    /**
     * Only build & update the representation when visible otherwise defer changes until set visible again.
     */
    lazy: boolean;

    /**
     * How metallic the material is, between 0 and 1.
     */
    metalness: number;

    /**
     * Translucency: 1 is fully opaque, 0 is fully transparent
     */
    opacity: number;

    /**
     * How rough the material is, between 0 and 1.
     */
    roughness: number;

    /**
     * Which triangle sides to render, "front" front-side, "back" back-side, "double" front- and back-side
     */
    side: 'front' | 'back' | 'double';

    /**
     * Use interior color.
     */
    useInteriorColor: Color;

    /**
     * Render as wireframe.
     */
    wireframe: boolean;
  }

  export class Representation {
    public bufferList: any[];
    public viewer: Viewer;
    public tasks: Counter;
    // tslint:disable-next-line:no-reserved-keywords
    public type: REPRESENTATION_TYPE;

    constructor(object: any, viewer: any, params: any);

    // Methods
    public attach(callback: any): void;
    public build(updateWhat: any): void;
    public clear(): void;
    public create(): void;
    public dispose(): void;
    public getBufferParams(p: any): any;
    public getColorParams(p: any): any;
    public getParameters(): {
      lazy: any;
      quality: any;
      visible: any;
    };
    public init(params: any): void;
    public make(updateWhat: any, callback: any): void;
    public setColor(value: any, p: any): this;
    public setParameters(params: object, what?: object, rebuild?: boolean): Representation;
    public setVisibility(value: boolean, noRenderRequest: boolean): Representation;
    public update(): void;
    public updateParameters(bufferParams: object, what: any): void;
  }

  export function makeRepresentation(
    // tslint:disable-next-line:no-reserved-keywords
    type: REPRESENTATION_TYPE,
    object: any,
    viewer: Viewer,
    params: IRepresentationParameters,
  ): Representation;
}
