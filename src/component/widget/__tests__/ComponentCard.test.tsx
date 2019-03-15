import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { ComponentCard } from '~bioblocks-viz~/component';

describe('ComponentCard', () => {
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
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
