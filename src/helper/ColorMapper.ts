import { Color } from 'plotly.js-dist';
import { SemanticCOLORS } from 'semantic-ui-react';

/**
 * Class to allow a mapping between a type and a color.
 *
 * @export
 */
export default class ColorMapper<T> {
  public static DEFAULT_COLORS: SemanticCOLORS[] = [
    'red',
    'green',
    'blue',
    'orange',
    'purple',
    'teal',
    'pink',
    'yellow',
    'violet',
    'olive',
    'brown',
  ];

  /**
   * Used to associate keys with a Color.
   */
  protected colorMap: Map<T, Color> = new Map<T, Color>();

  public constructor(readonly colors: Color[] = ColorMapper.DEFAULT_COLORS) {}

  /**
   * Get the color for the provided key - if the key isn't stored, it will be added using the set of colors for this mapper.
   */
  public getColorFor(key: T): Color {
    if (!this.colorMap.has(key)) {
      this.addColorToMapper(key);
    }
    return this.colorMap.get(key) as Color;
  }

  /**
   * Method to allow a user to just add an entry to the colorMapper.
   *
   * @param key Key to store.
   * @param [color] Allows a color to be explicitly set for this key.
   * @param [addToColors] Flag to allow/disallow color to be added to set of colors used by this ColorMapper.
   */
  public addEntry(key: T, color?: Color, addToColors: boolean = true) {
    if (!this.colorMap.has(key)) {
      this.addColorToMapper(key, color, addToColors);
    }
  }

  /**
   * Sets the entry for the internal ColorMapper Map.
   * @param key Key to add
   * @param [color] Explicit color to use if provided.
   * @param [addToColors] Flag to allow/disallow color to be added to set of colors used by this ColorMapper.
   */
  protected addColorToMapper(key: T, color?: Color, addToColors?: boolean) {
    this.colorMap.set(key, color ? color : this.colors[this.colorMap.size % this.colors.length]);
    if (color && addToColors && !this.colors.includes(color)) {
      this.colors.push(color);
    }
  }
}

export { ColorMapper };
