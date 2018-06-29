import { CommonWrapper, mount, ReactWrapper, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import { initialResidueContext, IResidueContext } from '../../context/ResidueContext';
import { CONFIGURATION_COMPONENT_TYPE, ICouplingScore, SECONDARY_STRUCTURE_SECTION } from '../../data/chell-data';
import { PlotlyChartClass } from '../chart/PlotlyChart';
import ContactMap, { ContactMapClass, ContactMapProps } from '../ContactMap';

// https://medium.com/@ryandrewjohnson/unit-testing-components-using-reacts-new-context-api-4a5219f4b3fe
// Provides a dummy context for unit testing purposes.
const getComponentWithContext = (context: IResidueContext = { ...initialResidueContext }) => {
  jest.doMock('../../context/ChellContext', () => {
    return {
      ChellContext: {
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
  const plotlyWrapper = wrapper.find('PlotlyChartClass') as CommonWrapper;
  (plotlyWrapper.instance() as PlotlyChartClass).plotlyCanvas!.dispatchEvent(new Event(eventName));
};

describe('ContactMap', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
  });

  const emptyData = {
    computedPoints: [],
    secondaryStructures: [],
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

  // Translated from example1/coupling_scores.csv
  const sampleCorrectPredictedContacts = [generateCouplingScore(56, 50, 2.4)];
  const sampleIncorrectPredictedContacts = [generateCouplingScore(42, 50, 20.4)];
  const sampleOutOfLinearDistContacts = [
    generateCouplingScore(45, 46, 1.3),
    generateCouplingScore(44, 45, 1.3),
    generateCouplingScore(56, 57, 1.3),
  ];
  const sampleObservedContacts = [...sampleCorrectPredictedContacts, generateCouplingScore(41, 52, 1.3)];

  const uniqueScores = new Set(
    Array.from([
      ...sampleCorrectPredictedContacts,
      ...sampleIncorrectPredictedContacts,
      ...sampleObservedContacts,
      ...sampleOutOfLinearDistContacts,
    ]),
  );

  const sampleData = {
    computedPoints: Array.from(uniqueScores).map((value, index) => ({
      name: index.toString(),
      nodeSize: 4,
      points: [
        {
          dist: value.dist,
          i: value.i,
          j: value.j,
        },
      ],
    })),
    secondaryStructures: [
      {
        label: 'C',
        section: { start: 30, end: 31, length: 2 },
      },
    ] as SECONDARY_STRUCTURE_SECTION[],
  };

  describe('Snapshots', () => {
    it('Should match existing snapshot when given no data.', () => {
      expect(toJson(shallow(<ContactMap />))).toMatchSnapshot();
    });

    it('Should match existing snapshot when given empty data.', () => {
      expect(toJson(shallow(<ContactMap data={emptyData} />))).toMatchSnapshot();
    });

    it('Should match existing snapshot when given sample data and sliders are _not_ enabled.', () => {
      const component = Renderer.create(<ContactMap data={sampleData} enableSliders={false} />);
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Should match existing snapshot when given sample data and sliders are enabled.', () => {
      const component = Renderer.create(<ContactMap data={sampleData} enableSliders={true} />);
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('Should match snapshot when locked residues are added.', async () => {
      const wrapper = await getMountedContactMap({ data: sampleData });
      const expectedSelectedPoints = new Map(
        Object.entries({
          '37,46': [37, 46],
          '8': [8],
        }),
      );
      wrapper.setProps({
        lockedResiduePairs: expectedSelectedPoints,
      });
      await wrapper.update();
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  it('Should invoke callback to add locked residues when a click event is fired.', async () => {
    const onClickSpy = jest.fn();
    const wrapper = await getMountedContactMap({ toggleLockedResiduePair: onClickSpy, data: sampleData });
    dispatchPlotlyEvent(wrapper, 'plotly_click');

    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });

  it('Should invoke callback to add hovered residues when a click event is fired.', async () => {
    const onHoverSpy = jest.fn();
    const wrapper = await getMountedContactMap({ addHoveredResidues: onHoverSpy, data: sampleData });
    dispatchPlotlyEvent(wrapper, 'plotly_hover');

    expect(onHoverSpy).toHaveBeenCalledTimes(1);
  });

  it('Should invoke callback for selected residues when a click event is fired.', async () => {
    const onSelectedSpy = jest.fn();
    const wrapper = await getMountedContactMap({ data: sampleData, onBoxSelection: onSelectedSpy });
    dispatchPlotlyEvent(wrapper, 'plotly_selected');
    expect(onSelectedSpy).toHaveBeenLastCalledWith([0]);
  });

  it('Should clear state if new data is given.', async () => {
    const onClearResidueSpy = jest.fn();
    const wrapper = await getMountedContactMap({ clearAllResidues: onClearResidueSpy, data: sampleData });
    await wrapper.update();
    wrapper.setProps({
      data: emptyData,
    });
    await wrapper.update();
    expect(onClearResidueSpy).toHaveBeenCalledTimes(1);
  });

  describe('Configuration', () => {
    it('Should update the state when the configuration accordion is clicked.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const instance = wrapper.instance() as ContactMapClass;
      const initialState = instance.state.showConfiguration;
      wrapper
        .find('.contact-map-configuration-toggle')
        .at(0)
        .simulate('click');
      expect(instance.state.showConfiguration).toBe(!initialState);
    });

    it('Should update node size when appropriate slider is updated.', () => {
      const wrapper = getShallowContactMap({ data: sampleData, enableSliders: true });
      const setStateSpy = jest.fn();
      wrapper.instance().setState = setStateSpy;
      wrapper.update();
      const expectedSize = 11;
      wrapper
        .find('.node-size-slider-0')
        .at(0)
        .simulate('change', expectedSize);
      const newState = setStateSpy.mock.calls[setStateSpy.mock.calls.length - 1];
      expect(newState[0].pointsToPlot[0].nodeSize).toBe(expectedSize);
    });

    it('Should match existing snapshot when given configurations.', () => {
      const configurations = [
        {
          name: 'sample slider',
          onChange: jest.fn(),
          type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
          values: {
            current: 5,
            max: 10,
            min: 0,
          },
        },
        {
          name: 'sample radio',
          onChange: jest.fn(),
          type: CONFIGURATION_COMPONENT_TYPE.RADIO,
          values: {
            current: 5,
            max: 10,
            min: 0,
          },
        },
      ];
      const wrapper = getShallowContactMap({ configurations });
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should invoke appropriate configuration callback.', () => {
      const onChangeSpy = jest.fn();
      const expectedValue = 7;
      const configurations = [
        {
          name: 'sample',
          onChange: onChangeSpy,
          type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
          values: {
            current: 5,
            max: 10,
            min: 0,
          },
        },
      ];
      const wrapper = getShallowContactMap({ configurations });
      wrapper
        .find('.sample')
        .at(0)
        .simulate('change', expectedValue);
      expect(onChangeSpy).toHaveBeenLastCalledWith(expectedValue);
    });
  });
});
