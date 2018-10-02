import { CommonWrapper, mount, ReactWrapper, shallow } from 'enzyme';
import * as plotly from 'plotly.js-gl2d-dist';
import * as React from 'react';

import { IMockPlotlyCanvas } from '__mocks__/plotly';
import { initialResidueContext, IResidueContext } from '../../context/ResidueContext';
import { initialSecondaryStructureContext } from '../../context/SecondaryStructureContext';
import { IContactMapData, ICouplingScore, SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_KEYS } from '../../data/chell-data';
import Chell1DSection from '../../data/Chell1DSection';
import { ChellWidgetConfig, CONFIGURATION_COMPONENT_TYPE } from '../../data/ChellConfig';
import { CouplingContainer } from '../../data/CouplingContainer';
import { PlotlyChart } from '../chart/PlotlyChart';
import ContactMap, { IContactMapProps } from '../ContactMap';

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
const getMountedContactMap = async (props?: Partial<IContactMapProps>) => {
  const Component = getComponentWithContext();
  const wrapper = mount(<Component.ContactMapClass {...props} />);
  await wrapper.mount();
  await wrapper.update();
  return wrapper;
};

/**
 * Helper function to create and wait for a shallow ContactMap.
 *
 * @param props Custom props to be passed to the chart.
 * @returns A wrapper for the ContactMap that has been shallowly created.
 */
const getShallowContactMap = (props?: Partial<IContactMapProps>) => {
  const Component = getComponentWithContext();
  return shallow(<Component.ContactMapClass {...props} />);
};

/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param eventName The name of the event to dispatch.
 * @param [data={ x: 0, y: 0 }] Custom plotly data for the event.
 */
const dispatchPlotlyEvent = (
  wrapper: ReactWrapper,
  eventName: string,
  data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = { x: [0], y: [0] },
) => {
  const plotlyWrapper = wrapper.find('PlotlyChart') as CommonWrapper;
  const canvas = (plotlyWrapper.instance() as PlotlyChart).plotlyCanvas;
  if (canvas) {
    (canvas as IMockPlotlyCanvas).dispatchEvent(new Event(eventName), data);
  }
};

describe('ContactMap', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
  });

  const emptyData = {
    couplingScores: new CouplingContainer(),
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

  const sampleData: IContactMapData = {
    couplingScores: new CouplingContainer(
      Array.from(uniqueScores).map((value, index) => ({
        dist: value.dist,
        i: value.i,
        j: value.j,
      })),
    ),
    secondaryStructures: [
      [
        {
          end: 31,
          label: 'C',
          length: 2,
          start: 30,
        },
      ],
    ] as SECONDARY_STRUCTURE[],
  };

  describe('Snapshots', () => {
    it('Should match existing snapshot when given no data.', () => {
      expect(shallow(<ContactMap />)).toMatchSnapshot();
    });

    it('Should match existing snapshot when given empty data.', () => {
      expect(shallow(<ContactMap data={emptyData} />)).toMatchSnapshot();
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
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Callbacks', () => {
    it('Should invoke callback to add locked residues when a click event is fired.', async () => {
      const onClickSpy = jest.fn();
      const wrapper = await getMountedContactMap({
        data: sampleData,
        residueContext: { ...initialResidueContext, toggleLockedResiduePair: onClickSpy },
      });
      dispatchPlotlyEvent(wrapper, 'plotly_click');

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('Should invoke callback to add hovered residues when a click event is fired.', async () => {
      const onHoverSpy = jest.fn();
      const wrapper = await getMountedContactMap({
        data: sampleData,
        residueContext: { ...initialResidueContext, addHoveredResidues: onHoverSpy },
      });
      dispatchPlotlyEvent(wrapper, 'plotly_hover');

      expect(onHoverSpy).toHaveBeenCalledTimes(1);
    });

    it('Should invoke callback to remove hovered residues when the mouse leaves.', async () => {
      const onHoverSpy = jest.fn();
      const wrapper = await getMountedContactMap({
        data: sampleData,
        residueContext: { ...initialResidueContext, removeHoveredResidues: onHoverSpy },
      });
      dispatchPlotlyEvent(wrapper, 'plotly_unhover');

      expect(onHoverSpy).toHaveBeenCalledTimes(1);
    });

    it('Should invoke callback for selected residues when a click event is fired.', async () => {
      const onSelectedSpy = jest.fn();
      const wrapper = await getMountedContactMap({ data: sampleData, onBoxSelection: onSelectedSpy });
      dispatchPlotlyEvent(wrapper, 'plotly_selected');
      expect(onSelectedSpy).toHaveBeenLastCalledWith([[0], [0]]);
    });

    it('Should invoke callback for adding a secondary structure when a mouse clicks it the first time.', async () => {
      const addSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getMountedContactMap({
        data: {
          ...sampleData,
          secondaryStructures: [[testSecStruct]],
        },
        secondaryStructureContext: {
          ...initialSecondaryStructureContext,
          addSecondaryStructure: addSecondaryStructureSpy,
        },
      });
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      dispatchPlotlyEvent(wrapper, 'plotly_click', data);
      expect(addSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should invoke callback for removing a secondary structure when a mouse clicks one that is already locked', async () => {
      const removeSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getMountedContactMap({
        data: {
          ...sampleData,
          secondaryStructures: [[testSecStruct]],
        },
        secondaryStructureContext: {
          ...initialSecondaryStructureContext,
          removeSecondaryStructure: removeSecondaryStructureSpy,
          selectedSecondaryStructures: [testSecStruct],
        },
      });
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      dispatchPlotlyEvent(wrapper, 'plotly_click', data);
      expect(removeSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should invoke callback for toggling a secondary structure when a mouse hovers over it.', async () => {
      const toggleSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getMountedContactMap({
        data: {
          ...sampleData,
          secondaryStructures: [[testSecStruct]],
        },
        secondaryStructureContext: {
          ...initialSecondaryStructureContext,
          toggleSecondaryStructure: toggleSecondaryStructureSpy,
        },
      });
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      dispatchPlotlyEvent(wrapper, 'plotly_hover', data);
      expect(toggleSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should not invoke callback for toggling a secondary structure when a mouse hovers over a different structure.', async () => {
      const toggleSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 10, 11);
      const wrapper = await getMountedContactMap({
        data: {
          ...sampleData,
          secondaryStructures: [[testSecStruct]],
        },

        secondaryStructureContext: {
          ...initialSecondaryStructureContext,
          toggleSecondaryStructure: toggleSecondaryStructureSpy,
        },
      });
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      dispatchPlotlyEvent(wrapper, 'plotly_hover', data);
      expect(toggleSecondaryStructureSpy).not.toHaveBeenCalled();
    });

    it('Should invoke callback for removing a secondary structure when a mouse leaves it.', async () => {
      const removeSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getMountedContactMap({
        data: {
          ...sampleData,
          secondaryStructures: [[testSecStruct]],
        },
        secondaryStructureContext: {
          ...initialSecondaryStructureContext,
          removeSecondaryStructure: removeSecondaryStructureSpy,
        },
      });
      const data: Partial<plotly.PlotScatterDataPoint> = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: 0,
        y: 0,
      };
      dispatchPlotlyEvent(wrapper, 'plotly_unhover', data);
      expect(removeSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should not invoke callback for toggling a secondary structure when a mouse leaves a different structure.', async () => {
      const toggleSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 10, 11);
      const wrapper = await getMountedContactMap({
        data: {
          ...sampleData,
          secondaryStructures: [[testSecStruct]],
        },
        secondaryStructureContext: {
          ...initialSecondaryStructureContext,
          toggleSecondaryStructure: toggleSecondaryStructureSpy,
        },
      });
      const data: Partial<plotly.PlotScatterDataPoint> = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: 0,
        y: 0,
      };
      dispatchPlotlyEvent(wrapper, 'plotly_unhover', data);
      expect(toggleSecondaryStructureSpy).not.toHaveBeenCalled();
    });
  });

  it('Should _not_ clear residues when given new data.', async () => {
    const onClearResidueSpy = jest.fn();
    const wrapper = await getMountedContactMap({
      data: sampleData,
      residueContext: { ...initialResidueContext, clearAllResidues: onClearResidueSpy },
    });
    await wrapper.update();
    wrapper.setProps({
      data: emptyData,
    });
    await wrapper.update();
    expect(onClearResidueSpy).toHaveBeenCalledTimes(0);
  });

  describe('Configuration', () => {
    it('Should match existing snapshot when given configurations.', () => {
      const configurations: ChellWidgetConfig[] = [
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
          current: 'yes',
          name: 'sample radio',
          onChange: jest.fn(),
          options: ['yes', 'no'],
          type: CONFIGURATION_COMPONENT_TYPE.RADIO,
        },
      ];
      const wrapper = getShallowContactMap({ configurations });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
