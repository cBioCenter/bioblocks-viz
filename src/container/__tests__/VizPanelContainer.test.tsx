import { shallow } from 'enzyme';
import * as React from 'react';
import { Button } from 'semantic-ui-react';

import { VizPanelContainer } from '~bioblocks-viz~/container';
import { VIZ_TYPE } from '~bioblocks-viz~/data';
import { fetchAppropriateData } from '~bioblocks-viz~/helper';

describe('VizPanelContainer', () => {
  beforeEach(() => {
    // TODO Use mock file to abstract this.
    (fetchAppropriateData as any) = jest.fn(
      (viz: VIZ_TYPE, dataDir: string) => `Dummy data for viz '${viz}' in '${dataDir}' directory.`,
    );
  });

  it('Should match existing snapshot when given a single visualization panel to render.', () => {
    const wrapper = shallow(<VizPanelContainer dataDirs={[]} numPanels={1} supportedVisualizations={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given multiple visualizations to render.', () => {
    const visualizations = [VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL];

    expect(
      shallow(
        <VizPanelContainer
          dataDirs={['first', 'second']}
          initialVisualizations={visualizations}
          numPanels={2}
          supportedVisualizations={visualizations}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('Should fetch new data when selected directory changes.', () => {
    const visualizations = [VIZ_TYPE.CONTACT_MAP];
    const wrapper = shallow(
      <VizPanelContainer
        dataDirs={['first', 'second']}
        initialVisualizations={visualizations}
        numPanels={1}
        supportedVisualizations={visualizations}
      />,
    );

    const instance = wrapper.instance() as VizPanelContainer;
    const initialData = instance.state.data;
    wrapper.setState({
      currentDataDir: 'second',
    });
    wrapper.update();

    expect(wrapper.state()).not.toBe(initialData);
  });

  it('Should not fetch new data if selected directory is the same.', () => {
    const visualizations = [VIZ_TYPE.CONTACT_MAP];
    const wrapper = shallow(
      <VizPanelContainer
        dataDirs={['first', 'second']}
        initialVisualizations={visualizations}
        numPanels={1}
        supportedVisualizations={visualizations}
      />,
    ).update();

    const instance = wrapper.instance() as VizPanelContainer;
    const initialData = instance.state.data;
    wrapper.setState({
      currentDataDir: 'first',
    });
    wrapper.update();

    expect(instance.state.data).toBe(initialData);
  });

  it('Should update the state when the directory dropdown changes.', () => {
    const wrapper = shallow(
      <VizPanelContainer
        dataDirs={['first', 'second']}
        initialVisualizations={[]}
        numPanels={1}
        supportedVisualizations={[]}
      />,
    );
    const expected = 'second';
    wrapper.find('.viz-panel-container-dropdown').simulate('change', {}, { value: expected });
    const instance = wrapper.instance() as VizPanelContainer;
    expect(instance.state.currentDataDir).toBe(expected);
  });

  it('Should hide the upload button if requested.', () => {
    const wrapper = shallow(
      <VizPanelContainer allowUploads={false} dataDirs={[]} supportedVisualizations={[]} />,
    ).update();
    expect(wrapper.find(Button)).toHaveLength(0);
  });
});
