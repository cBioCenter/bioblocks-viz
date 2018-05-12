import { CommonWrapper, mount, ReactWrapper, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import { initialResidueContext, IResidueContext } from '../../context/ResidueContext';
import { CONTACT_VIEW_TYPE } from '../../data/chell-data';
import PlotlyChart from '../../helper/PlotlyHelper';
import ContactMap, { ContactMapClass, ContactMapProps } from '../ContactMap';

// https://medium.com/@ryandrewjohnson/unit-testing-components-using-reacts-new-context-api-4a5219f4b3fe
// Provides a dummy context for unit testing purposes.
const getComponentWithContext = (context: IResidueContext = { ...initialResidueContext }) => {
  jest.doMock('../../context/ResidueContext', () => {
    return {
      ResidueContext: {
        Consumer: (props: any) => props.children(context),
      },
    };
  });

  return require('../ContactMap');
};

/**
 * Helper function to create and wait for a ContactMap to be mounted.
 *
 * @param props Custom props to be passed to the chart.
 * @returns A wrapper for the ContactMap that has been mounted.
 */
const getMountedContactMap = async (props?: Partial<ContactMapProps>) => {
  const Component = getComponentWithContext();
  const wrapper = mount(<Component.ContactMapClass {...props} />);
  await wrapper.mount();
  return wrapper;
};

/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param event The name of the event to dispatch.
 */
const dispatchPlotlyEvent = (wrapper: ReactWrapper, eventName: string) => {
  const plotlyWrapper = wrapper.find('PlotlyChart') as CommonWrapper;
  (plotlyWrapper.instance() as PlotlyChart).plotlyCanvas!.dispatchEvent(new Event(eventName));
};

describe('ContactMap', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
  });

  const emptyData = {
    contactMonomer: [],
    couplingScore: [],
    distanceMapMonomer: [],
    observedMonomer: [],
  };

  const sampleData = {
    contactMonomer: [{ i: 0, j: 1, dist: 10 }, { i: 1, j: 0, dist: 10 }],
    couplingScore: [
      {
        i: 0,
        // tslint:disable-next-line:object-literal-sort-keys
        A_i: 'I',
        j: 1,
        A_j: 'J',
        fn: 1,
        cn: 1,
        segment_i: 'K',
        segment_j: 'L',
        probability: 1,
        dist_intra: 1,
        dist_multimer: 1,
        dist: 10,
        precision: 10,
      },
    ],
    distanceMapMonomer: [{ id: 0, sec_struct_3state: 'A' }],
    observedMonomer: [{ i: 0, j: 1, dist: 5 }, { i: 1, j: 0, dist: 5 }],
  };

  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<ContactMap />))).toMatchSnapshot();
  });

  test('Should match existing snapshot when given empty data.', () => {
    expect(toJson(shallow(<ContactMap data={emptyData} />))).toMatchSnapshot();
  });

  test('Should match existing snapshot when given sample data and sliders are _not_ enabled.', () => {
    const component = Renderer.create(<ContactMap data={sampleData} enableSliders={false} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Should match existing snapshot when given sample data and sliders are enabled.', () => {
    const component = Renderer.create(<ContactMap data={sampleData} enableSliders={true} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Should match existing snapshot using ScatterGL is toggled on.', async () => {
    const wrapper = await getMountedContactMap();
    wrapper.setState({
      isUsingScatterGL: true,
    });
    await wrapper.update();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Should match existing snapshot using ScatterGL is toggled off.', async () => {
    const wrapper = await getMountedContactMap();
    wrapper.setState({
      isUsingScatterGL: false,
    });
    await wrapper.update();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Should invoke callback to add locked residues when a click event is fired.', async () => {
    const onClickSpy = jest.fn();
    const wrapper = await getMountedContactMap({ addLockedResiduePair: onClickSpy, data: sampleData });
    dispatchPlotlyEvent(wrapper, 'plotly_click');

    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });

  test('Should invoke callback to add hovered residues when a click event is fired.', async () => {
    const onHoverSpy = jest.fn();
    const wrapper = await getMountedContactMap({ addHoveredResidues: onHoverSpy, data: sampleData });
    dispatchPlotlyEvent(wrapper, 'plotly_hover');

    expect(onHoverSpy).toHaveBeenCalledTimes(1);
  });

  test("Should show both observed and predicted contacts when 'BOTH' is selected.", async () => {
    const wrapper = await getMountedContactMap({ data: sampleData });
    const instance = wrapper.instance() as ContactMapClass;
    wrapper.setState({
      contactViewType: CONTACT_VIEW_TYPE.BOTH,
    });
    await wrapper.update();
    expect(instance.state.contactPoints).toEqual(sampleData.contactMonomer);
    expect(instance.state.couplingPoints).toEqual(sampleData.couplingScore);
    expect(instance.state.observedPoints).toEqual(sampleData.observedMonomer);
  });

  test("Should show only observed contacts when 'OBSERVED' is selected.", async () => {
    const wrapper = await getMountedContactMap({ data: sampleData });
    const instance = wrapper.instance() as ContactMapClass;
    wrapper.setState({
      contactViewType: CONTACT_VIEW_TYPE.OBSERVED,
    });
    await wrapper.update();
    expect(instance.state.contactPoints).toEqual(sampleData.contactMonomer);
    expect(instance.state.couplingPoints).not.toEqual(sampleData.couplingScore);
    expect(instance.state.couplingPoints).toEqual([]);
    expect(instance.state.observedPoints).toEqual(sampleData.observedMonomer);
  });

  test("Should show only predicted contacts when 'PREDICTED' is selected.", async () => {
    const wrapper = await getMountedContactMap({ data: sampleData });
    const instance = wrapper.instance() as ContactMapClass;
    wrapper.setState({
      contactViewType: CONTACT_VIEW_TYPE.PREDICTED,
    });
    await wrapper.update();
    expect(instance.state.contactPoints).toEqual(sampleData.contactMonomer);
    expect(instance.state.couplingPoints).toEqual(sampleData.couplingScore);
    expect(instance.state.observedPoints).not.toEqual(sampleData.observedMonomer);
    expect(instance.state.observedPoints).toEqual([]);
  });
});
