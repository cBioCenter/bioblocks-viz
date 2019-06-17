import { shallow } from 'enzyme';
import * as React from 'react';

import { Grid } from 'semantic-ui-react';
import { ComponentDock } from '~bioblocks-viz~/component';

describe('ComponentDock', () => {
  it('Should match existing snapshot when given empty dock items.', () => {
    const wrapper = shallow(<ComponentDock dockItems={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should not render when visible is toggled.', () => {
    const wrapper = shallow(<ComponentDock dockItems={[]} visible={false} />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('Should match existing snapshot when given sample dock items.', () => {
    const dockItems = [
      {
        text: 'A Little Respect',
      },
      {
        text: 'Erasure',
      },
    ];
    const wrapper = shallow(<ComponentDock dockItems={dockItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should invoke visible callback if present.', () => {
    const dockItems = [
      {
        isVisibleCb: jest.fn(() => true),
        text: 'A Little Respect',
      },
      {
        isVisibleCb: jest.fn(() => false),
        text: 'Erasure',
      },
    ];
    const wrapper = shallow(<ComponentDock dockItems={dockItems} />);
    expect(wrapper.find(Grid.Column)).toHaveLength(1);
    expect(dockItems[0].isVisibleCb).toHaveBeenCalledTimes(1);
    expect(dockItems[1].isVisibleCb).toHaveBeenCalledTimes(1);
  });

  it('Should invoke onClick callback if present.', () => {
    const dockItems = [
      {
        onClick: jest.fn(),
        text: 'A Little Respect',
      },
      {
        onClick: jest.fn(),
        text: 'Erasure',
      },
    ];
    const wrapper = shallow(<ComponentDock dockItems={dockItems} />);
    wrapper
      .find('a')
      .at(0)
      .simulate('click');
    wrapper
      .find('a')
      .at(1)
      .simulate('click');
    expect(dockItems[0].onClick).toHaveBeenCalledTimes(1);
    expect(dockItems[1].onClick).toHaveBeenCalledTimes(1);
  });
});
