"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
describe('ComponentMenuBar', function () {
    it('Should match existing snapshot when given default props.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer' }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when expanded', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', isExpanded: true }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render popup menu items.', function () {
        var menuItems = [
            {
                component: {
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
        expect(wrapper
            .find('span')
            .at(0)
            .prop('style')).toHaveProperty('visibility', 'hidden');
    });
    it('Should determine the visibility of menu items via mouse hover.', function () {
        var menuItems = [
            {
                component: {
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        var instance = wrapper.instance();
        expect(instance.state.isHovered).toBe(false);
        expect(wrapper
            .find('span')
            .at(0)
            .prop('style')).toHaveProperty('visibility', 'hidden');
        expect(wrapper
            .find('span')
            .at(1)
            .prop('style')).toHaveProperty('visibility', 'hidden');
        wrapper.simulate('mouseenter');
        expect(instance.state.isHovered).toBe(true);
        expect(wrapper
            .find('span')
            .at(0)
            .prop('style')).toHaveProperty('visibility', 'visible');
        expect(wrapper
            .find('span')
            .at(1)
            .prop('style')).toHaveProperty('visibility', 'visible');
        wrapper.simulate('mouseleave');
        expect(instance.state.isHovered).toBe(false);
        expect(wrapper
            .find('span')
            .at(0)
            .prop('style')).toHaveProperty('visibility', 'hidden');
        expect(wrapper
            .find('span')
            .at(1)
            .prop('style')).toHaveProperty('visibility', 'hidden');
    });
    it('Should render a Button menu item.', function () {
        var config = {
            name: 'Rye',
            onClick: helper_1.EMPTY_FUNCTION,
            type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON,
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render a Button menu item with an icon.', function () {
        var config = {
            icon: 'coffee',
            name: 'Rye',
            onClick: helper_1.EMPTY_FUNCTION,
            type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON,
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render a Button Group menu item.', function () {
        var config = {
            name: 'Rye',
            options: [React.createElement("div", { key: 1 }, "Howdy"), React.createElement("div", { key: 2 }, "Ho")],
            type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP,
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render a Checkbox menu item.', function () {
        var config = {
            checked: false,
            name: 'Rye',
            type: data_1.CONFIGURATION_COMPONENT_TYPE.CHECKBOX,
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render a Label menu item.', function () {
        var config = {
            name: 'Rye',
            type: data_1.CONFIGURATION_COMPONENT_TYPE.LABEL,
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render a Radio menu item.', function () {
        var config = {
            current: 'Ludo',
            name: 'Rye',
            options: ['Ludo', 'Queen'],
            type: data_1.CONFIGURATION_COMPONENT_TYPE.RADIO,
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render a Range Slider menu item.', function () {
        var config = {
            name: 'Rye',
            range: {
                current: [1, 3],
                defaultRange: [1, 3],
                max: 4,
                min: 0,
            },
            type: data_1.CONFIGURATION_COMPONENT_TYPE.RANGE_SLIDER,
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render a Slider menu item.', function () {
        var config = {
            name: 'Rye',
            type: data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER,
            values: {
                current: 2,
                defaultValue: 2,
                max: 4,
                min: 0,
            },
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle an unknown menu item.', function () {
        var config = {
            type: 'apocalypse',
        };
        var menuItems = [
            {
                component: {
                    configs: {
                        Catcher: [config],
                    },
                    name: 'POPUP',
                    props: {},
                },
                description: 'A Popup',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentMenuBar, { componentName: 'The Boxer', menuItems: menuItems }));
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=ComponentMenuBar.test.js.map