import { mount, ReactWrapper, shallow } from 'enzyme';
import * as React from 'react';

import { Icon } from 'semantic-ui-react';
import { ComponentCard } from '~bioblocks-viz~/component';

describe('ComponentCard', () => {
  /**
   * Helper function to decouple the exact mechanism to expand the component card.
   *
   * @param component The mounted ComponentCard
   */
  const expandComponentCard = (component: ReactWrapper<ComponentCard>) => {
    component.find(Icon).simulate('click');
    component.update();
  };

  it('Should match existing snapshot when given default props.', () => {
    const wrapper = shallow(<ComponentCard componentName={'The Boxer'} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when framed.', () => {
    const wrapper = shallow(<ComponentCard componentName={'The Boxer'} isFramedComponent={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when not framed.', () => {
    const wrapper = shallow(<ComponentCard componentName={'The Boxer'} isFramedComponent={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle resizing a framed component.', () => {
    const wrapper = mount(
      <ComponentCard componentName={"Let's"} isFramedComponent={true}>
        <div>Go!</div>
      </ComponentCard>,
    );
    window.dispatchEvent(new Event('resize'));
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle expanding a framed full page component.', () => {
    const wrapper = mount(
      <ComponentCard componentName={"Let's"} isFramedComponent={true} isFullPage={true}>
        <div>Go!</div>
      </ComponentCard>,
    );
    expandComponentCard(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle expanding a framed and non-full page component.', () => {
    const wrapper = mount(
      <ComponentCard componentName={"Let's"} isFramedComponent={true} isFullPage={false}>
        <div>Go!</div>
      </ComponentCard>,
    );
    expandComponentCard(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle expanding a non-framed full page component.', () => {
    const wrapper = mount(
      <ComponentCard componentName={"Let's"} isFramedComponent={false} isFullPage={true}>
        <div>Go!</div>
      </ComponentCard>,
    );
    expandComponentCard(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle expanding a non-framed and non-full page component.', () => {
    const wrapper = mount(
      <ComponentCard componentName={"Let's"} isFramedComponent={false} isFullPage={false}>
        <div>Go!</div>
      </ComponentCard>,
    );
    expandComponentCard(wrapper);
    expect(wrapper).toMatchSnapshot();
  });
});
