import { mount } from 'enzyme';
import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import toJson from 'enzyme-to-json';
import { initialResidueContext, IResidueContext } from '../../context/ResidueContext';
import NGLComponent from '../NGLComponent';

jest.mock('ngl');

beforeEach(() => {
  jest.resetModules();
});

// https://medium.com/@ryandrewjohnson/unit-testing-components-using-reacts-new-context-api-4a5219f4b3fe
// Provides a dummy context for unit testing purposes.
const getComponentWithContext = (context: IResidueContext = { ...initialResidueContext }) => {
  jest.doMock('../../context/ResidueContext', () => {
    return {
      ResidueContext: {
        Consumer: (props: any) => props.children(context),
      },
    };
  });

  return require('../NGLComponent');
};

describe('NGLComponent', () => {
  const sampleData = {
    residueStore: {
      resno: [0, 1, 2, 3, 4],
    },
  };

  test("Should match existing snapshot when canvas isn't available.", () => {
    expect(Renderer.create(<NGLComponent />).toJSON()).toMatchSnapshot();
  });

  test('Should match existing snapshot when given sample data', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Should handle prop updates.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass />);
    const initialProps = wrapper.props();

    wrapper.setProps({
      hoveredResidues: [0],
    });

    expect(wrapper.props()).not.toEqual(initialProps);
  });

  test('Should handle data updates.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass />);

    wrapper.setProps({
      data: sampleData,
    });
  });

  test('Should unmount correctly.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass />);
    expect(wrapper.get(0)).not.toBeNull();
    wrapper.unmount();
    expect(wrapper.get(0)).toBeNull();
  });
});
