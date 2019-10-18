"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to allow a mapping between a type and a color.
 *
 * @export
 */
var ColorMapper = /** @class */ (function () {
    function ColorMapper(colorMap, defaultColor, colors) {
        if (colorMap === void 0) { colorMap = new Map(); }
        if (defaultColor === void 0) { defaultColor = 'black'; }
        if (colors === void 0) { colors = ColorMapper.DEFAULT_COLORS; }
        this.colorMap = colorMap;
        this.defaultColor = defaultColor;
        this.colors = colors;
    }
    /**
     * Get the color for the provided key - if the key isn't stored, it will be added using the set of colors for this mapper.
     */
    ColorMapper.prototype.getColorFor = function (key) {
        if (!this.colorMap.has(key)) {
            this.addColorToMapper(key);
        }
        return this.colorMap.get(key);
    };
    /**
     * Method to allow a user to just add an entry to the colorMapper.
     *
     * @param key Key to store.
     * @param [color] Allows a color to be explicitly set for this key.
     * @param [addToColors] Flag to allow/disallow color to be added to set of colors used by this ColorMapper.
     */
    ColorMapper.prototype.addEntry = function (key, color, addToColors) {
        if (addToColors === void 0) { addToColors = true; }
        if (!this.colorMap.has(key)) {
            this.addColorToMapper(key, color, addToColors);
        }
    };
    /**
     * Sets the entry for the internal ColorMapper Map.
     * @param key Key to add
     * @param [color] Explicit color to use if provided.
     * @param [addToColors] Flag to allow/disallow color to be added to set of colors used by this ColorMapper.
     */
    ColorMapper.prototype.addColorToMapper = function (key, color, addToColors) {
        if (color === void 0) { color = this.defaultColor; }
        this.colorMap.set(key, color);
        if (color && addToColors && !this.colors.includes(color)) {
            this.colors.push(color);
        }
    };
    ColorMapper.DEFAULT_COLORS = [
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
    return ColorMapper;
}());
exports.ColorMapper = ColorMapper;
//# sourceMappingURL=ColorMapper.js.map