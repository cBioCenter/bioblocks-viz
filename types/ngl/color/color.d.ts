// tslint:disable:max-classes-per-file
declare module 'ngl' {
  export type ColormakerScale = (v: number) => number;
  export type StructureColormakerParams = { structure: Structure } & Partial<IColormakerParameters>;
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
    // tslint:disable-next-line: no-reserved-keywords
    public set(color?: Color | string | number): Color;
    public setScalar(scalar: number): Color;
    public setHex(hex: number): Color;

    /**
     * Sets this color from RGB values.
     *
     * @param r Red channel value between 0 and 1.
     * @param g Green channel value between 0 and 1.
     * @param b Blue channel value between 0 and 1.
     */
    public setRGB(r: number, g: number, b: number): Color;

    /**
     * Sets this color from HSL values.
     * Based on MochiKit implementation by Bob Ippolito.
     *
     * @param h Hue channel value between 0 and 1.
     * @param s Hue channel value between 0 and 1.
     * @param l Value channel value between 0 and 1.
     */
    public setHSL(h: number, s: number, l: number): Color;

    /**
     * Sets this color from a CSS context style string.
     *
     * @param style Color in CSS context style format.
     */
    public setStyle(style: string): Color;

    /**
     * Clones this color.
     */
    public clone(): this;

    /**
     * Copies given color.
     *
     * @param color Color to copy.
     */
    public copy(color: this): this;

    /**
     * Copies given color making conversion from gamma to linear space.
     *
     * @param color Color to copy.
     */
    public copyGammaToLinear(color: Color, gammaFactor?: number): Color;

    /**
     * Copies given color making conversion from linear to gamma space.
     *
     * @param color Color to copy.
     */
    public copyLinearToGamma(color: Color, gammaFactor?: number): Color;

    /**
     * Converts this color from gamma to linear space.
     */
    public convertGammaToLinear(): Color;

    /**
     *  Converts this color from linear to gamma space.
     */
    public convertLinearToGamma(): Color;

    /**
     * Returns the hexadecimal value of this color.
     */
    public getHex(): number;

    /**
     * Returns the string formated hexadecimal value of this color.
     */
    public getHexString(): string;

    public getHSL(): HSL;

    /**
     * Returns the value of this color in CSS context style.
     * Example: rgb(r, g, b)
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
