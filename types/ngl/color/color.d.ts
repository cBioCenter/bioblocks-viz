// tslint:disable:max-classes-per-file
declare module 'ngl' {
  export type ColormakerScale = (v: number) => number;
  export type StuctureColormakerParams = { structure: Structure } & Partial<IColormakerParameters>;
  export type VolumeColormakerParams = { volume: Volume } & Partial<IColormakerParameters>;

  export interface IColormakerParameters extends IScaleParameters {
    structure?: Structure;
    volume?: Volume;
    surface?: Surface;
  }

  export class Color {
    // Properties
    /** Red channel value between 0 and 1. Default is 1. */
    public r: number;

    /** Green channel value between 0 and 1. Default is 1. */
    public g: number;

    /** Blue channel value between 0 and 1. Default is 1. */
    public b: number;

    constructor(color?: Color | string | number);
    constructor(r: number, g: number, b: number);

    // Methods
    public set(color?: Color | string | number): Color;
    public setScalar(scalar: number): Color;
    public setHex(hex: number): Color;

    /**
     * Sets this color from RGB values.
     *
     * @param {number} r Red channel value between 0 and 1.
     * @param {number} g Green channel value between 0 and 1.
     * @param {number} b Blue channel value between 0 and 1.
     * @returns {Color}
     * @memberof Color
     */
    public setRGB(r: number, g: number, b: number): Color;

    /**
     * Sets this color from HSL values.
     * Based on MochiKit implementation by Bob Ippolito.
     *
     * @param {number} h Hue channel value between 0 and 1.
     * @param {number} s Hue channel value between 0 and 1.
     * @param {number} l Value channel value between 0 and 1.
     * @returns {Color}
     * @memberof Color
     */
    public setHSL(h: number, s: number, l: number): Color;

    /**
     * Sets this color from a CSS context style string.
     *
     * @param {string} style Color in CSS context style format.
     * @returns {Color}
     * @memberof Color
     */
    public setStyle(style: string): Color;

    /**
     * Clones this color.
     *
     * @returns {this}
     * @memberof Color
     */
    public clone(): this;

    /**
     * Copies given color.
     *
     * @param {this} color Color to copy.
     * @returns {this}
     * @memberof Color
     */
    public copy(color: this): this;

    /**
     * Copies given color making conversion from gamma to linear space.
     *
     * @param {Color} color Color to copy.
     * @param {number} [gammaFactor]
     * @returns {Color}
     * @memberof Color
     */
    public copyGammaToLinear(color: Color, gammaFactor?: number): Color;

    /**
     * Copies given color making conversion from linear to gamma space.
     *
     * @param {Color} color Color to copy.
     * @param {number} [gammaFactor]
     * @returns {Color}
     * @memberof Color
     */
    public copyLinearToGamma(color: Color, gammaFactor?: number): Color;

    /**
     * Converts this color from gamma to linear space.
     *
     * @returns {Color}
     * @memberof Color
     */
    public convertGammaToLinear(): Color;

    /**
     *  Converts this color from linear to gamma space.
     *
     * @returns {Color}
     * @memberof Color
     */
    public convertLinearToGamma(): Color;

    /**
     * Returns the hexadecimal value of this color.
     *
     * @returns {number}
     * @memberof Color
     */
    public getHex(): number;

    /**
     * Returns the string formated hexadecimal value of this color.
     *
     * @returns {string}
     * @memberof Color
     */
    public getHexString(): string;

    public getHSL(): HSL;

    /**
     * Returns the value of this color in CSS context style.
     * Example: rgb(r, g, b)
     *
     * @returns {string}
     * @memberof Color
     */
    public getStyle(): string;

    public offsetHSL(h: number, s: number, l: number): Color;

    public add(color: Color): Color;
    public addColors(color1: Color, color2: Color): Color;
    public addScalar(s: number): Color;
    public sub(color: Color): Color;
    public multiply(color: Color): Color;
    public multiplyScalar(s: number): Color;
    public lerp(color: Color, alpha: number): Color;
    public equals(color: Color): boolean;
    public fromArray(rgb: number[], offset?: number): Color;
    public toArray(array?: number[], offset?: number): number[];
  }

  export interface IScaleParameters {
    scale: string | string[];
    mode: 'hcl' | 'rgb' | 'hsv' | 'hsl' | 'hsi' | 'lab' | 'hcl';
    domain: number[];
    value: 0xffffff;
    reverse: false;
  }

  // tslint:disable-next-line:interface-name
  export interface HSL {
    h: number;
    s: number;
    l: number;
  }
}
