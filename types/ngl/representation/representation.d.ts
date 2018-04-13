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
  export interface IRepresentationParameters {
    /**
     * Position of camera for spherical clipping.
     *
     * @type {Vector3}
     * @memberof IRepresentationParameters
     */
    clipCenter: Vector3;

    /**
     * Position of camera near/front clipping plane in percent of scene bounding box.
     *
     * @type {number}
     * @memberof IRepresentationParameters
     */
    clipNear: number;

    /**
     * Radius of clipping sphere.
     *
     * @type {number}
     * @memberof IRepresentationParameters
     */
    clipRadius: number;

    /**
     * Scale value range.
     *
     * @type {number[]}
     * @memberof IRepresentationParameters
     */
    colorDomain: number[];

    /**
     * Min value.
     *
     * @type {number}
     * @memberof IRepresentationParameters
     */

    'colorDomain.0': number;
    /**
     * Max value.
     *
     * @type {number}
     * @memberof IRepresentationParameters
     */
    'colorDomain.1': number;

    /**
     * Color mode, one of rgb, hsv, hsl, hsi, lab, hcl.
     *
     * @type {('hcl' | 'hsi' | 'hsl' | 'hsv' | 'lab' | 'rgb')}
     * @memberof IRepresentationParameters
     */
    colorMode: 'hcl' | 'hsi' | 'hsl' | 'hsv' | 'lab' | 'rgb';

    /**
     * Reverse color scale.
     *
     * @type {boolean}
     * @memberof IRepresentationParameters
     */
    colorReverse: boolean;

    /**
     * color scale, either a string for a predefined scale or an array of colors to be used as the scale.
     *
     * @type {string}
     * @memberof IRepresentationParameters
     */
    colorScale: string;

    /**
     * Color scheme.
     *
     * @type {string}
     * @memberof IRepresentationParameters
     */
    colorScheme: string;

    /**
     * Color value.
     *
     * @type {Color}
     * @memberof IRepresentationParameters
     */
    colorValue: Color;

    /**
     * Depth write.
     *
     * @type {boolean}
     * @memberof IRepresentationParameters
     */
    depthWrite: boolean;

    /**
     * Diffuse color for lighting.
     *
     * @type {Color}
     * @memberof IRepresentationParameters
     */
    diffuse: Color;

    /**
     * Diffuse interior, i.e. ignore normal.
     *
     * @type {Color}
     * @memberof IRepresentationParameters
     */
    diffuseInterior: Color;

    /**
     * Disable picking.
     *
     * @type {boolean}
     * @memberof IRepresentationParameters
     */
    disablePicking: boolean;

    /**
     * Render flat shaded.
     *
     * @type {boolean}
     * @memberof IRepresentationParameters
     */
    flatShaded: boolean;

    /**
     * Interior color.
     *
     * @type {Color}
     * @memberof IRepresentationParameters
     */
    interiorColor: Color;

    /**
     * Interior darkening: 0 no darking, 1 fully darkened.
     *
     * @type {Color}
     * @memberof IRepresentationParameters
     */
    interiorDarkening: Color;

    /**
     * Only build & update the representation when visible otherwise defer changes until set visible again.
     *
     * @type {boolean}
     * @memberof IRepresentationParameters
     */
    lazy: boolean;

    /**
     * How metallic the material is, between 0 and 1.
     *
     * @type {number}
     * @memberof IRepresentationParameters
     */
    metalness: number;

    /**
     * Translucency: 1 is fully opaque, 0 is fully transparent
     *
     * @type {number}
     * @memberof IRepresentationParameters
     */
    opacity: number;

    /**
     * How rough the material is, between 0 and 1.
     *
     * @type {number}
     * @memberof IRepresentationParameters
     */
    roughness: number;

    /**
     * Which triangle sides to render, "front" front-side, "back" back-side, "double" front- and back-side
     *
     * @type {('front' | 'back' | 'double')}
     * @memberof IRepresentationParameters
     */
    side: 'front' | 'back' | 'double';

    /**
     * Use interior color.
     *
     * @type {Color}
     * @memberof IRepresentationParameters
     */
    useInteriorColor: Color;

    /**
     * Render as wireframe.
     *
     * @type {boolean}
     * @memberof IRepresentationParameters
     */
    wireframe: boolean;
  }

  export class Representation {
    public bufferList: any[];
    public viewer: Viewer;
    public tasks: Counter;
    public type:
      | ShapeRepresentationType
      | StructureRepresentationType
      | VolumeRepresentationType
      | SurfaceRepresentationType;

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
}
