"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
/**
 * Class to represent a dropdown.
 *
 * @extends {React.Component<ICategorySelectorProps, any>}
 */
var CategorySelector = /** @class */ (function (_super) {
    tslib_1.__extends(CategorySelector, _super);
    function CategorySelector(props) {
        return _super.call(this, props) || this;
    }
    CategorySelector.prototype.render = function () {
        var _a = this.props, categories = _a.categories, onCategoryChange = _a.onCategoryChange;
        return (this.props.categories && (React.createElement(semantic_ui_react_1.Dropdown, { fluid: true, onChange: onCategoryChange, options: tslib_1.__spread(categories.map(function (cat) {
                return { key: cat, text: cat, value: cat };
            })), placeholder: 'Select Category', search: true })));
    };
    CategorySelector.defaultProps = {
        categories: [],
    };
    return CategorySelector;
}(React.Component));
exports.CategorySelector = CategorySelector;
//# sourceMappingURL=CategorySelector.js.map