import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { Accordion } from 'semantic-ui-react';
import { ConfigAccordion, IConfigGroup } from '~bioblocks-viz~/component';

describe('ConfigAccordion', () => {
  it('Should match existing snapshot when given default props.', () => {
    const wrapper = shallow(<ConfigAccordion configs={[]} title={''} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given some configuration.', () => {
    const configs: IConfigGroup[] = [{ Jeannie: [<div key={1}>Nitro</div>, <div key={1}>Devil</div>] }];
    const wrapper = shallow(<ConfigAccordion configs={configs} title={'songs'} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle click events when there are 2 or more configs.', () => {
    const configs: IConfigGroup[] = [
      { 'The Fratellis': [<div key={1}>Jeannie Nitro</div>, <div key={2}>Me and the Devil</div>] },
      { Eminem: [<div key={3}>Stan</div>, <div key={4}>Evil Deeds</div>] },
    ];
    const wrapper = mount(<ConfigAccordion configs={configs} title={'songs'} />);
    const instance = wrapper.instance() as ConfigAccordion;
    expect(instance.state.activeIndex).toEqual(-1);
    wrapper
      .find(Accordion.Title)
      .at(0)
      .simulate('click');

    expect(instance.state.activeIndex).toEqual(0);
    wrapper
      .find(Accordion.Title)
      .at(1)
      .simulate('click');

    expect(instance.state.activeIndex).toEqual(1);
  });

  it('Should handle click events when rendering shallowly.', () => {
    const configs: IConfigGroup[] = [
      { 'The Fratellis': [<div key={1}>Jeannie Nitro</div>, <div key={2}>Me and the Devil</div>] },
      { Eminem: [<div key={3}>Stan</div>, <div key={4}>Evil Deeds</div>] },
    ];
    const wrapper = shallow(<ConfigAccordion configs={configs} title={'songs'} />);
    const instance = wrapper.instance() as ConfigAccordion;
    expect(instance.state.activeIndex).toEqual(-1);
    wrapper
      .find(Accordion.Title)
      .at(0)
      .simulate('click');

    expect(instance.state.activeIndex).toEqual(-1);
  });
});
