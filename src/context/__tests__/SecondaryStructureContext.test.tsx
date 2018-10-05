import { mount } from 'enzyme';
import * as React from 'react';

import {
  initialSecondaryStructureContext,
  SecondaryStructureContextConsumer,
  SecondaryStructureContextProvider,
} from '~chell-viz~/context';
import { MockContextClass } from '~chell-viz~/test';

describe('SecondaryStructureContext', () => {
  let MockContextConsumer: JSX.Element;
  let MockContextProvider: JSX.Element;
  beforeEach(() => {
    MockContextConsumer = (
      <SecondaryStructureContextConsumer>
        {secondaryStructureContext => <MockContextClass secondaryStructureContext={secondaryStructureContext} />}
      </SecondaryStructureContextConsumer>
    );
    MockContextProvider = <SecondaryStructureContextProvider>{MockContextConsumer}</SecondaryStructureContextProvider>;
  });

  describe('Consumer', () => {
    it('Should allow components to consume a secondary structure context.', () => {
      const wrapper = mount(MockContextConsumer);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.props().secondaryStructureContext).toEqual(initialSecondaryStructureContext);
    });
  });

  describe('Provider', () => {
    it('Should allow components to be provided a secondary structure context.', () => {
      const wrapper = mount(MockContextProvider);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
