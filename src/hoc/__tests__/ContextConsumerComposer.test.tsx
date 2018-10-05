import { mount } from 'enzyme';
import * as React from 'react';

import { ContextConsumerComposer } from '~chell-viz~/hoc';

describe('ContextConsumerComposer', () => {
  it('Should allow contexts.', () => {
    const wrapper = mount(<ContextConsumerComposer components={[]}>{() => <div />}</ContextConsumerComposer>);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should allow consumers added directly.', () => {
    const mockContext = React.createContext('foo');
    const wrapper = mount(
      <ContextConsumerComposer components={[mockContext.Consumer]}>{() => <div />}</ContextConsumerComposer>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
