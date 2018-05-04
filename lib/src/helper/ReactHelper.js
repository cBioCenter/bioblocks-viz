"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Add a set of default properties to a component that can be type-checked at compile time.
 *
 * @description
 * Based upon: https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
 *
 * @param defaultProps The default properties for the wrapped component.
 * @param component The component to wrap.
 * @returns A component with default props applied to it.
 */
exports.withDefaultProps = function (defaultProps, component) {
    component.defaultProps = defaultProps;
    return component;
};
