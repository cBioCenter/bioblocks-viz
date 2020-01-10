import { AtomProxy, ColormakerScale } from 'ngl';
import { Vector3 } from 'three';

// tslint:disable:max-classes-per-file
declare module 'ngl' {
  /**
   * Class for making colors.
   * @export
   */
  export class Colormaker {
    public atomProxy?: AtomProxy;
    public parameters: IColormakerParameters;

    constructor(params?: Partial<IColormakerParameters>);

    public atomColor?(atom: AtomProxy): number;

    /**
     * Save a atom color to an array.
     *
     * @param atom Atom to get color for.
     * @param array Destination.
     * @param offset Index into the array.
     * @returns The destination array.
     */
    public atomColorToArray(
      atom: AtomProxy,
      array: NumberArray,
      offset: number,
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
     * Return the color for an bond
     *
     * @param bond Bond to get color for.
     * @param fromTo Whether to use the first or second atom of the bond.
     * @returns Hex bond color.
     */
    public bondColor(bond: BondProxy, fromTo: boolean): number;

    /**
     * Save a bond color to an array.
     *
     * @param bond Bond to get color for.
     * @param fromTo Whether to use the first or second atom of the bond.
     * @param array Destination.
     * @param offset Index into the array.
     * @returns The destination array.
     */
    public bondColorToArray(
      bond: BondProxy,
      fromTo: boolean,
      array: NumberArray,
      offset: number,
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
     * Save a color to an array
     *
     * @param color Hex color value.
     * @param [array] Destination.
     * @param [offset] Index into the array.
     * @returns The destination array.
     */
    public colorToArray(
      color: number,
      array?: NumberArray,
      offset?: number,
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

    public getScale(params?: Partial<IScaleParameters>): Scale<any>;

    public positionColor?(position: Vector3): number;

    /**
     * Save a color for coordinates in space to an array.
     *
     * @param coords xyz coordinates.
     * @param array Destination.
     * @param offset Index into the array.
     * @returns the destination array
     */
    public positionColorToArray(
      coords: Vector3,
      array: NumberArray,
      offset: number,
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

    public volumeColor?(index: number): number;

    /**
     * Save a volume cell color to an array.
     *
     * @param index Volume cell index.
     * @param array Destination.
     * @param offset Index into the array.
     * @returns The destination array.
     */
    public volumeColorToArray(
      index: number,
      array: NumberArray,
      offset: number,
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
  }

  /**
   * Color based on Selection.
   * @export
   * @extends {Colormaker}
   */
  export class SelectionColormaker extends Colormaker {
    public colormakerList: any[] = [];
    public selectionList: Selection[] = [];
    constructor(params: object & Partial<ColormakerParameters>): SelectionColormaker;
    public atomColor(a: AtomProxy): any;
  }

  /**
   * Color by atom index. The AtomProxy.index property is used for coloring.
   * Each ModelProxy of a Structure is colored separately. The params.domain parameter is ignored.
   *
   * @extends {Colormaker}
   * @example
   * stage.loadFile('rcsb://1crn').then(function(o) {
   *   o.addRepresentation('ball+stick', { colorScheme: 'atomindex' });
   *   o.autoView();
   * });
   */
  export class AtomindexColormaker extends Colormaker {
    public scalePerModel: Record<number, ColormakerScale>;
    constructor(params: StructureColormakerParams): AtomindexColormaker;

    /**
     * Get color for an atom.
     * @param atom Atom to get color for
     * @returns Hex atom color
     */
    public atomColor(atom: AtomProxy): number;
  }

  /**
   * Color by b-factor.
   * The AtomProxy.bfactor property is used for coloring.
   * By default the min and max b-factor values are used for the scale`s domain.
   *
   * @extends {Colormaker}
   * @example
   * stage.loadFile('rcsb://1crn').then(function(o) {
   *   o.addRepresentation('ball+stick', { colorScheme: 'bfactor' });
   *   o.autoView();
   * });
   */
  export class BfactorColormaker extends Colormaker {
    public bfactorScale: ColormakerScale;
    constructor(params: object & StuctureColormakerParams): BfactorColormaker;
    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by chain id.
   *
   * @extends {Colormaker}
   */
  export class ChainidColormaker extends Colormaker {
    public chainidDictPerModel: Record<number, Record<string, number>>;
    public scalePerModel: Record<number, ColormakerScale>;

    constructor(params: StructureColormakerParams): ChainidColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by chain index.
   *
   * @extends {Colormaker}
   */
  export class ChainindexColormaker extends Colormaker {
    public scalePerModel: Record<number, ColormakerScale>;

    constructor(params: StuctureColormakerParams): ChainindexColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by chain name.
   *
   * @extends {Colormaker}
   */
  export class ChainnameColormaker extends Colormaker {
    public chainnameDictPerModel: Record<number, Record<string, number>>;
    public scalePerModel: Record<number, ColormakerScale>;

    constructor(params: StuctureColormakerParams): ChainnameColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by validation density fit.
   *
   * @extends {Colormaker}
   */
  export class DensityfitColormaker extends Colormaker {
    public rsccDict: Record<string, number | undefined>;
    public rsccScale: ColormakerScale;
    public rsrzDict: Record<string, number | undefined>;
    public rsrzScale: ColormakerScale;

    constructor(params: StructureColormakerParams): DensityfitColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color a surface by electrostatic charge.
   * This is a highly approximate calculation!
   * The partial charges are CHARMM with hydrogens added to heavy atoms and hydrogen positions generated for amides.
   *
   * @extends {Colormaker}
   *
   * @example
   * stage.loadFile('rcsb://3dqb').then(function(o) {
   *   o.addRepresentation('surface', { colorScheme: 'electrostatic' });
   *   o.autoView();
   * });
   */
  export class ElectrostaticColormaker extends Colormaker {
    public atomProxy: AtomProxy;
    public charges: Float32Array;
    public delta: Vector3;
    public hCharges: number[];
    public hHash: SpatialHash;
    public hStore: {
      count: number;
      x: Float32Array;
      y: Float32Array;
      z: Float32Array;
    };
    public hash: SpatialHash;
    public scale: ColormakerScale;

    constructor(params: StructureColormakerParams): ElectrostaticColormaker;

    public positionColor(v: Vector3): number;
  }

  /**
   * Color by element.
   *
   * @extends {Colormaker}
   */
  export class ElementColormaker extends Colormaker {
    constructor(params: ColormakerParameters): ElementColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by entity index.
   *
   * @extends {Colormaker}
   */
  export class EntityindexColormaker extends Colormaker {
    public entityindexScale: ColormakerScale;

    constructor(params: StuctureColormakerParams): EntityindexColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by entity type.
   *
   * @extends {Colormaker}
   */
  export class EntitytypeColormaker extends Colormaker {
    public atomColor(a: AtomProxy): 8374655 | 16629894 | 12496596 | 3697840 | 16777113;
  }

  /**
   * Color by validation geometry quality.
   *
   * @extends {Colormaker}
   */
  export class GeoqualityColormaker extends Colormaker {
    public geoAtomDict: Record<string, Record<string, number>>;
    public geoDict: Record<string, number | undefined>;

    constructor(params: StuctureColormakerParams): GeoqualityColormaker;

    public atomColor(atom: AtomProxy): 9474192 | 2188972 | 16703627 | 16018755 | 10813478;
  }

  /**
   * Color by hydrophobicity.
   *
   * @extends {Colormaker}
   */
  export class HydrophobicityColormaker extends Colormaker {
    public defaultResidueHydrophobicity: number;
    public hfScale: ColormakerScale;
    public resHF: Record<string, number>;

    constructor(params: ColormakerParameters): HydrophobicityColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by model index.
   *
   * @extends {Colormaker}
   */
  export class ModelindexColormaker extends Colormaker {
    public modelindexScale: ColormakerScale;

    constructor(params: StuctureColormakerParams): ModelindexColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by molecule type.
   *
   * @extends {Colormaker}
   */
  export class MoleculetypeColormaker extends Colormaker {
    public atomColor(a: AtomProxy): 8374655 | 16629894 | 12496596 | 3697840 | 16777113 | 15729279 | 12540695;
  }

  /**
   * Color by occupancy.
   *
   * @extends {Colormaker}
   */
  export class OccupancyColormaker extends Colormaker {
    public occupancyScale: ColormakerScale;

    constructor(params: ColormakerParameters): OccupancyColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by partial charge.
   * The AtomProxy.partialCharge property is used for coloring.
   * The default domain is [-1, 1].
   *
   * @extends {Colormaker}
   * @example
   * stage.loadFile('rcsb://1crn').then(function(o) {
   *   o.addRepresentation('ball+stick', { colorScheme: 'partialCharge' });
   *   o.autoView();
   * });
   */
  export class PartialchargeColormaker extends Colormaker {
    public partialchargeScale: ColormakerScale;

    constructor(params: ColormakerParameters): PartialchargeColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by random color.
   *
   * @extends {Colormaker}
   */
  export class RandomColormaker extends Colormaker {
    /**
     * Get color for an atom.
     *
     * @returns Random hex color.
     */
    public atomColor(): number;

    /**
     * Get color for coordinates in space.
     *
     * @returns Random hex color.
     */
    public positionColor(): number;

    /**
     * Get color for volume cell.
     *
     * @returns Random hex color.
     */
    public volumeColor(): number;
  }

  /**
   * Color by residue index.
   *
   * @extends {Colormaker}
   */
  export class ResidueindexColormaker extends Colormaker {
    public scalePerChain: Record<number, ColormakerScale>;

    constructor(params: StuctureColormakerParams): ResidueindexColormaker;

    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by residue name.
   *
   * @extends {Colormaker}
   */
  export class ResnameColormaker extends Colormaker {
    public atomColor(a: AtomProxy): number;
  }

  /**
   * Color by secondary structure.
   *
   * @extends {Colormaker}
   */
  export class SstrucColormaker extends Colormaker {
    public residueProxy: ResidueProxy;

    constructor(params: StuctureColormakerParams): SstrucColormaker;

    public atomColor(ap: AtomProxy): number;
  }

  /**
   * Color by uniform color.
   *
   * @extends {Colormaker}
   */
  export class UniformColormaker extends Colormaker {
    public atomColor(): number;
    public bondColor(): number;
    public valueColor(): number;
    public volumeColor(): number;
  }

  /**
   * Color by volume value.
   *
   * @extends {Colormaker}
   */
  export class ValueColormaker extends Colormaker {
    public valueScale: ColormakerScale;

    constructor(params: VolumeColormakerParams): ValueColormaker;

    /**
     * Return the color for a volume cell.
     *
     * @param index Volume cell index
     * @returns Hex cell color.
     */
    public volumeColor(index: number): number;
  }

  /**
   * Color by volume position.
   *
   * @extends {Colormaker}
   */
  export class VolumeColormaker extends Colormaker {
    public valueScale: ColormakerScale;
    public vec: Vector3;

    constructor(params: VolumeColormakerParams): VolumeColormaker;

    /**
     * Return the color for coordinates in space.
     *
     * @param coords xyz coordinates.
     * @returns Hex coords color.
     */
    public positionColor(coords: Vector3): number;
  }

  export type SelectionSchemeData = [any, string, ColormakerParameters | undefined];
  /**
   * Class for registering Colormakers.
   *
   */
  export class ColormakerRegistry {
    public schemes: Record<string, any>;
    public userSchemes: Record<string, any>;
    constructor();

    /**
     * Add a user-defined scheme.
     * @param scheme The user-defined scheme.
     * @returns ID to refer to the registered scheme
     */
    public _addUserScheme(scheme: any, label: string): string;

    // tslint:disable-next-line: no-reserved-keywords
    public _createScheme(constructor: any): Colormaker;

    /**
     * Add a scheme with a hardcoded id
     *
     * @param id The ID.
     * @param scheme The colormaker
     */
    public add(id: string, scheme: Colormaker): void;

    /**
     * Register a custom scheme.
     *
     * @param scheme Constructor or Colormaker instance.
     * @param label Scheme label.
     * @returns ID to refer to the registered scheme.
     * @example
     *  var schemeId = NGL.ColormakerRegistry.addScheme(function(params) {
     *  this.atomColor = function(atom) {
     *    if (atom.serial < 1000) {
     *      return 0x0000ff; // blue
     *    } else if (atom.serial > 2000) {
     *      return 0xff0000; // red
     *    } else {
     *      return 0x00ff00; // green
     *    }
     *  };
     * });
     */
    public addScheme(scheme: any, label: string): string;

    /**
     * Create and a selection-based coloring scheme.
     * Supply a list with pairs of colorname and selection for coloring by selections.
     * Use the last entry as a default (catch all) coloring definition.
     *
     * @param dataList Color-selection pairs.
     * @param label Scheme name.
     * @returns ID to refer to the registered scheme
     *
     * @example
     * let schemeId = NGL.ColormakerRegistry.addSelectionScheme(
     *   [
     *     ['red', '64-74 or 134-154 or 222-254 or 310-310 or 322-326'],
     *     ['green', '311-322'],
     *     [
     *       'yellow',
     *       '40-63 or 75-95 or 112-133 or 155-173 or 202-221 or 255-277 or 289-309'
     *     ],
     *     ['blue', '1-39 or 96-112 or 174-201 or 278-288'],
     *     ['white', '*']
     *   ],
     *   'Transmembrane 3dqb'
     * );
     * stage.loadFile('rcsb://3dqb.pdb').then(function(o) {
     *   o.addRepresentation('cartoon', { color: schemeId }); // pass schemeId here
     *   o.autoView();
     * });
     */
    public addSelectionScheme(dataList: SelectionSchemeData, label: string): string;

    public getModes(): Record<'' | 'hcl' | 'hsi' | 'hsl' | 'hsv' | 'lab' | 'rgb', string>;

    /**
     * Get an description of available scales as an object with id-label as key-value pairs.
     */
    public getScales(): Record<
      | ''
      | 'Accent'
      | 'Blues'
      | 'BrBG'
      | 'BuGn'
      | 'BuPu'
      | 'Dark2'
      | 'GnBu'
      | 'Greens'
      | 'Greys'
      | 'OrRd'
      | 'Oranges'
      | 'PRGn'
      | 'Paired'
      | 'Pastel1'
      | 'Pastel2'
      | 'PiYG'
      | 'PuBu'
      | 'PuBuGn'
      | 'PuOr'
      | 'PuRd'
      | 'Purples'
      | 'RdBu'
      | 'RdGy'
      | 'RdPu'
      | 'RdYlBu'
      | 'RdYlGn'
      | 'Reds'
      | 'Set1'
      | 'Set2'
      | 'Set3'
      | 'Spectral'
      | 'Viridis'
      | 'YlGn'
      | 'YlGnBu'
      | 'YlOrBr'
      | 'YlOrRd'
      | 'rainbow'
      | 'rwb',
      string
    >;

    public getScheme(params: object & IColormakerParameters): any;

    /**
     * Get an description of available schemes as an object with id-label as key-value pairs.
     */
    public getSchemes(): Record<string, any>;

    /**
     * Check if a scheme with the given ID exists.
     *
     * @param id The id to check.
     * @returns Flag indicating if the scheme exists.
     */
    public hasScheme(id: string): boolean;

    /**
     * Remove the scheme with the given id.
     *
     * @param id Scheme to remove.
     */
    public removeScheme(id: string): void;
  }
}
