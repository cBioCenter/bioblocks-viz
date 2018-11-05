import { shallow } from 'enzyme';
import * as React from 'react';

import { withSettingsPanel } from '~chell-viz~/hoc';

describe('SettingsPanelComposer', () => {
  it('Should wrap components with a Settings Panel.', () => {
    class MockReactComponent extends React.Component {}
    const MockWrappedComponent = withSettingsPanel(MockReactComponent);
    const wrapper = shallow(<MockWrappedComponent configurations={[]} isDataLoading={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
