import { CommonWrapper, mount, ReactWrapper, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import { initialResidueContext, IResidueContext } from '../../context/ResidueContext';
import { CONTACT_VIEW_TYPE, ICouplingScore } from '../../data/chell-data';
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
 * Helper function to create and wait for a shallow ContactMap.
 *
 * @param props Custom props to be passed to the chart.
 * @returns A wrapper for the ContactMap that has been shallowly created.
 */
const getShallowContactMap = (props?: Partial<ContactMapProps>) => {
  const Component = getComponentWithContext();
  return shallow(<Component.ContactMapClass {...props} />);
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
    couplingScores: [],
  };

  const generateCouplingScore = (
    i: number,
    j: number,
    dist: number,
    extra?: Partial<ICouplingScore>,
  ): ICouplingScore => ({
    dist,
    i,
    j,
    ...extra,
  });

  const sampleCorrectPredictedContacts = [generateCouplingScore(56, 50, 2.4)];
  const sampleIncorrectPredictedContacts = [generateCouplingScore(42, 50, 20.4)];
  const sampleObservedContacts = [generateCouplingScore(41, 52, 11.3)];
  const sampleOutOfLinearDistContacts = [
    generateCouplingScore(45, 46, 1.3),
    generateCouplingScore(44, 45, 1.3),
    generateCouplingScore(56, 57, 1.3),
  ];

  const sampleData = {
    // Translated from example1/coupling_scores.csv
    couplingScores: [
      ...sampleCorrectPredictedContacts,
      ...sampleIncorrectPredictedContacts,
      ...sampleObservedContacts,
      ...sampleOutOfLinearDistContacts,
    ],
  };

  describe('Snapshots', () => {
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

    test('Should match snapshot when locked residues are added.', async () => {
      const wrapper = await getMountedContactMap({ data: sampleData });
      const expectedSelectedPoints = {
        '37,46': [37, 46],
        '8': [8],
      };
      wrapper.setProps({
        lockedResiduePairs: expectedSelectedPoints,
      });
      await wrapper.update();
      expect(toJson(wrapper)).toMatchSnapshot();
    });
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

  test('Should show both observed and predicted contacts when BOTH is selected.', async () => {
    const wrapper = await getMountedContactMap({ data: sampleData });
    const instance = wrapper.instance() as ContactMapClass;
    wrapper.setState({
      contactViewType: CONTACT_VIEW_TYPE.BOTH,
    });
    expect(instance.state.correctPredictedContacts).toEqual(sampleCorrectPredictedContacts);
  });

  test('Should show only observed contacts when OBSERVED is selected.', async () => {
    const wrapper = await getMountedContactMap({ data: sampleData });
    const expected = [
      ...sampleCorrectPredictedContacts,
      ...sampleIncorrectPredictedContacts,
      ...sampleObservedContacts,
    ];
    const instance = wrapper.instance() as ContactMapClass;
    wrapper.setState({
      contactViewType: CONTACT_VIEW_TYPE.OBSERVED,
    });
    expect(instance.state.observedContacts).toEqual(expected);
  });

  test('Should show only predicted contacts when PREDICTED is selected.', async () => {
    const wrapper = await getMountedContactMap({ data: sampleData });
    const instance = wrapper.instance() as ContactMapClass;
    wrapper.setState({
      contactViewType: CONTACT_VIEW_TYPE.PREDICTED,
    });
    expect(instance.state.observedContacts).toEqual([]);
  });

  describe('Sliders', () => {
    test('Should update node size when appropriate slider is updated.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const instance = wrapper.instance() as ContactMapClass;
      expect(instance.state.nodeSize).toBe(3);
      const expectedSize = 5;
      wrapper
        .find('.node-size-slider')
        .at(0)
        .simulate('change', expectedSize);
      expect(instance.state.nodeSize).toBe(expectedSize);
    });

    test('Should update number of predicted contacts to show when appropriate slider is updated.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const instance = wrapper.instance() as ContactMapClass;
      const expectedCount = 50;
      expect(instance.state.predictedContactCount).not.toBe(expectedCount);
      wrapper
        .find('.predicted-contact-slider')
        .at(0)
        .simulate('change', expectedCount);
      expect(instance.state.predictedContactCount).toBe(expectedCount);
    });

    test('Should update contact view type when appropriate slider is updated.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const instance = wrapper.instance() as ContactMapClass;
      expect(instance.state.contactViewType).toBe(CONTACT_VIEW_TYPE.BOTH);
      const expectedViewType = CONTACT_VIEW_TYPE.OBSERVED;
      wrapper
        .find('.contact-view-slider')
        .at(0)
        .simulate('change', expectedViewType);
      expect(instance.state.contactViewType).toBe(expectedViewType);
    });

    test('Should update linear distance filter when appropriate slider is updated.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const instance = wrapper.instance() as ContactMapClass;
      const expected = 10;
      expect(instance.state.linearDistFilter).not.toBe(expected);
      wrapper
        .find('.linear-dist-filter')
        .at(0)
        .simulate('change', expected);
      expect(instance.state.linearDistFilter).toBe(expected);
    });

    test('Should update # of predicted contacts to show when appropriate slider is updated.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const instance = wrapper.instance() as ContactMapClass;
      const expected = 20;
      expect(instance.state.predictedContactCount).not.toBe(expected);
      wrapper
        .find('.predicted-contact-slider')
        .at(0)
        .simulate('change', expected);
      expect(instance.state.predictedContactCount).toBe(expected);
    });

    test('Should update prediction cutoff distance when appropriate slider is updated.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const instance = wrapper.instance() as ContactMapClass;
      const expected = 30;
      expect(instance.state.predictionCutoffDist).not.toBe(expected);
      wrapper
        .find('.prediction-cutoff-filter')
        .at(0)
        .simulate('change', expected);
      expect(instance.state.predictionCutoffDist).toBe(expected);
    });
  });
});