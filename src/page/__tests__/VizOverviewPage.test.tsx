import { shallow } from 'enzyme';
import * as React from 'react';

import { VizOverviewPage } from '~chell-viz~/page';

describe('VizOverviewPage', () => {
  const visualizations = ['anatomogram', 'spring', 'tfjs-tsne'];

  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<VizOverviewPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot for initial visualizations.', () => {
    visualizations.forEach(viz => {
      describe(viz, () => {
        const wrapper = shallow(
          <VizOverviewPage location={{ hash: '', pathname: '', search: `?name=${viz}`, state: '' }} />,
        );
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  it('Should match existing snapshot when changing the visualization.', () => {
    const wrapper = shallow(
      <VizOverviewPage location={{ hash: '', pathname: '', search: '?name=spring', state: '' }} />,
    );
    wrapper.setProps({
      location: { hash: '', pathname: '', search: '?name=anatomogram', state: '' },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
