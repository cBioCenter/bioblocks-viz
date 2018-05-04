"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var CategorySelector = /** @class */ (function (_super) {
    __extends(CategorySelector, _super);
    function CategorySelector(props) {
        return _super.call(this, props) || this;
    }
    CategorySelector.prototype.render = function () {
        return (this.props.categories && (React.createElement(semantic_ui_react_1.Dropdown, { fluid: true, onChange: this.props.onCategoryChange, options: [
                { key: 'all', text: 'all', value: undefined }
            ].concat(this.props.categories.map(function (cat) {
                return { key: cat, text: cat, value: cat };
            })), placeholder: 'Select Category', search: true })));
    };
    return CategorySelector;
}(React.Component));
exports.CategorySelector = CategorySelector;
