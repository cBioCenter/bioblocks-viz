import { shallow } from 'enzyme';
import * as React from 'react';

import { DatasetPageClass } from '~bioblocks-viz~/page';

describe('DatasetPage', () => {
  const visualizations = ['anatomogram', 'spring', 'tfjs-tsne'];

  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<DatasetPageClass />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot for initial visualizations.', () => {
    visualizations.forEach(viz => {
      describe(`${viz} when it is fullscreen`, () => {
        const wrapper = shallow(
          <DatasetPageClass
            location={{ hash: '', pathname: '', search: `?viz=${viz}&name={hpc/sample}`, state: '' }}
          />,
        );
        expect(wrapper).toMatchSnapshot();
      });

      describe(`${viz} when it is not fullscreen`, () => {
        const wrapper = shallow(
          <DatasetPageClass
            location={{ hash: '', pathname: '', search: `?viz=${viz}&viz=empty&name={mouse/sample}`, state: '' }}
          />,
        );
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  it('Should match existing snapshot when changing the visualization.', () => {
    const wrapper = shallow(
      <DatasetPageClass location={{ hash: '', pathname: '', search: '?viz=spring', state: '' }} />,
    );
    wrapper.setProps({
      location: { hash: '', pathname: '', search: '?viz=anatomogram', state: '' },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
