import { mount, shallow } from 'enzyme';
import * as React from 'react';

export const getAsyncMountedComponent = async (Component: React.ReactElement<any>) => {
  const wrapper = mount(Component);
  wrapper.update();
  await Promise.resolve();

  return wrapper;
};

export const getAsyncShallowComponent = async (Component: React.ReactElement<any>) => {
  const wrapper = shallow(Component);
  wrapper.update();
  await Promise.resolve();

  return wrapper;
};
