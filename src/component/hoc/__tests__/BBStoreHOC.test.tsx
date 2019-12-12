import { shallow } from 'enzyme';
import * as React from 'react';

import { connectWithBBStore, withBBStore } from '~bioblocks-viz~/component';

describe('BBStoreHOC', () => {
  it('Should match snapshot when using the bb store wrapper.', () => {
    const Component = () => <div>Hi</div>;
    const unconnectedWrapper = shallow(<Component />);
    expect(unconnectedWrapper.prop('store')).toBeUndefined();

    const ConnectedComponent = () => withBBStore(Component)({});
    const wrapper = shallow(<ConnectedComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.prop('store')).not.toBeUndefined();
  });

  it('Should match snapshot when using the connect wrapper.', () => {
    const Component = () => React.createElement('div');
    const unconnectedWrapper = shallow(<Component />);
    expect(unconnectedWrapper.prop('store')).toBeUndefined();
    const mapStateToPropsSpy = jest.fn();
    const mapDispatchToPropsSpy = jest.fn();

    const ConnectedComponent = connectWithBBStore(mapStateToPropsSpy, mapDispatchToPropsSpy, Component);
    const wrapper = shallow(<ConnectedComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.prop('store')).not.toBeUndefined();
  });
});
