import { shallow } from 'enzyme';
import * as plotly from 'plotly.js-gl2d-dist';
import * as React from 'react';

import { ContactMap, ContactMapClass } from '~chell-viz~/component';
import { initialResidueContext, initialSecondaryStructureContext } from '~chell-viz~/context';
import {
  Chell1DSection,
  ChellWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  CouplingContainer,
  IContactMapData,
  ICouplingScore,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_KEYS,
} from '~chell-viz~/data';
import { dispatchPlotlyEvent, getAsyncMountedComponent } from '~chell-viz~/test';

describe('ContactMap', () => {
  let emptyData: IContactMapData;
  let sampleCorrectPredictedContacts: ICouplingScore[];
  let sampleIncorrectPredictedContacts: ICouplingScore[];
  let sampleOutOfLinearDistContacts: ICouplingScore[];
  let sampleData: IContactMapData;
  let uniqueScores: Set<ICouplingScore>;
  let sampleObservedContacts: ICouplingScore[];

  beforeEach(() => {
    jest.resetModuleRegistry();

    emptyData = {
      couplingScores: new CouplingContainer(),
      secondaryStructures: [],
    };

    sampleCorrectPredictedContacts = [generateCouplingScore(56, 50, 2.4)];
    sampleIncorrectPredictedContacts = [generateCouplingScore(42, 50, 20.4)];
    sampleOutOfLinearDistContacts = [
      generateCouplingScore(45, 46, 1.3),
      generateCouplingScore(44, 45, 1.3),
      generateCouplingScore(56, 57, 1.3),
    ];

    sampleObservedContacts = [...sampleCorrectPredictedContacts, generateCouplingScore(41, 52, 1.3)];

    uniqueScores = new Set(
      Array.from([
        ...sampleCorrectPredictedContacts,
        ...sampleIncorrectPredictedContacts,
        ...sampleObservedContacts,
        ...sampleOutOfLinearDistContacts,
      ]),
    );

    sampleData = {
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
  });

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

  describe('Snapshots', () => {
    it('Should match existing snapshot when given no data.', () => {
      expect(shallow(<ContactMap />)).toMatchSnapshot();
    });

    it('Should match existing snapshot when given empty data.', () => {
      expect(shallow(<ContactMap data={emptyData} />)).toMatchSnapshot();
    });

    it('Should match snapshot when locked residues are added.', async () => {
      const wrapper = await getAsyncMountedComponent(<ContactMapClass data={sampleData} />);
      const expectedSelectedPoints = new Map(
        Object.entries({
          '37,46': [37, 46],
          8: [8],
        }),
      );
      wrapper.setProps({
        lockedResiduePairs: expectedSelectedPoints,
      });
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Callbacks', async () => {
    it('Should invoke callback to add locked residues when a click event is fired.', async () => {
      const onClickSpy = jest.fn();
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={sampleData}
          residueContext={{ ...initialResidueContext, toggleLockedResiduePair: onClickSpy }}
        />,
      );
      await dispatchPlotlyEvent(wrapper, 'plotly_click');

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('Should invoke callback to add hovered residues when a click event is fired.', async () => {
      const onHoverSpy = jest.fn();
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={sampleData}
          residueContext={{ ...initialResidueContext, addHoveredResidues: onHoverSpy }}
        />,
      );
      await dispatchPlotlyEvent(wrapper, 'plotly_hover');

      expect(onHoverSpy).toHaveBeenCalledTimes(1);
    });

    it('Should invoke callback to remove hovered residues when the mouse leaves.', async () => {
      const onHoverSpy = jest.fn();
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={sampleData}
          residueContext={{ ...initialResidueContext, removeHoveredResidues: onHoverSpy }}
        />,
      );
      await dispatchPlotlyEvent(wrapper, 'plotly_unhover');

      expect(onHoverSpy).toHaveBeenCalledTimes(1);
    });

    it('Should invoke callback for selected residues when a click event is fired.', async () => {
      const onSelectedSpy = jest.fn();
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass data={sampleData} onBoxSelection={onSelectedSpy} />,
      );
      await dispatchPlotlyEvent(wrapper, 'plotly_selected');
      expect(onSelectedSpy).toHaveBeenLastCalledWith([[0], [0]]);
    });

    it('Should invoke callback for adding a secondary structure when a mouse clicks it the first time.', async () => {
      const addSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={{
            ...sampleData,
            secondaryStructures: [[testSecStruct]],
          }}
          secondaryStructureContext={{
            ...initialSecondaryStructureContext,
            addSecondaryStructure: addSecondaryStructureSpy,
          }}
        />,
      );
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      await dispatchPlotlyEvent(wrapper, 'plotly_click', data);
      expect(addSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should invoke callback for removing a secondary structure when a mouse clicks one that is already locked', async () => {
      const removeSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={{
            ...sampleData,
            secondaryStructures: [[testSecStruct]],
          }}
          secondaryStructureContext={{
            ...initialSecondaryStructureContext,
            removeSecondaryStructure: removeSecondaryStructureSpy,
            selectedSecondaryStructures: [testSecStruct],
          }}
        />,
      );
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      await dispatchPlotlyEvent(wrapper, 'plotly_click', data);
      expect(removeSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should invoke callback for toggling a secondary structure when a mouse hovers over it.', async () => {
      const toggleSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={{
            ...sampleData,
            secondaryStructures: [[testSecStruct]],
          }}
          secondaryStructureContext={{
            ...initialSecondaryStructureContext,
            toggleSecondaryStructure: toggleSecondaryStructureSpy,
          }}
        />,
      );
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      await dispatchPlotlyEvent(wrapper, 'plotly_hover', data);
      expect(toggleSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should not invoke callback for toggling a secondary structure when a mouse hovers over a different structure.', async () => {
      const toggleSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 10, 11);
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={{
            ...sampleData,
            secondaryStructures: [[testSecStruct]],
          }}
          secondaryStructureContext={{
            ...initialSecondaryStructureContext,
            toggleSecondaryStructure: toggleSecondaryStructureSpy,
          }}
        />,
      );
      const data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: [0],
        y: [0],
      };
      await dispatchPlotlyEvent(wrapper, 'plotly_hover', data);
      expect(toggleSecondaryStructureSpy).not.toHaveBeenCalled();
    });

    it('Should invoke callback for removing a secondary structure when a mouse leaves it.', async () => {
      const removeSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 0, 10);
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={{
            ...sampleData,
            secondaryStructures: [[testSecStruct]],
          }}
          secondaryStructureContext={{
            ...initialSecondaryStructureContext,
            removeSecondaryStructure: removeSecondaryStructureSpy,
          }}
        />,
      );
      const data: Partial<plotly.PlotScatterDataPoint> = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: 0,
        y: 0,
      };
      await dispatchPlotlyEvent(wrapper, 'plotly_unhover', data);
      expect(removeSecondaryStructureSpy).toHaveBeenLastCalledWith(testSecStruct);
    });

    it('Should not invoke callback for toggling a secondary structure when a mouse leaves a different structure.', async () => {
      const toggleSecondaryStructureSpy = jest.fn();
      const testSecStruct = new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 10, 11);
      const wrapper = await getAsyncMountedComponent(
        <ContactMapClass
          data={{
            ...sampleData,
            secondaryStructures: [[testSecStruct]],
          }}
          secondaryStructureContext={{
            ...initialSecondaryStructureContext,
            toggleSecondaryStructure: toggleSecondaryStructureSpy,
          }}
        />,
      );
      const data: Partial<plotly.PlotScatterDataPoint> = {
        data: { type: 'scattergl', xaxis: 'x2' } as any,
        x: 0,
        y: 0,
      };
      await dispatchPlotlyEvent(wrapper, 'plotly_unhover', data);
      expect(toggleSecondaryStructureSpy).not.toHaveBeenCalled();
    });
  });

  it('Should _not_ clear residues when given new data.', async () => {
    const onClearResidueSpy = jest.fn();
    const wrapper = await getAsyncMountedComponent(
      <ContactMapClass
        data={sampleData}
        residueContext={{ ...initialResidueContext, clearAllResidues: onClearResidueSpy }}
      />,
    );
    wrapper.update();
    wrapper.setProps({
      data: emptyData,
    });
    wrapper.update();
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
      const wrapper = shallow(<ContactMapClass configurations={configurations} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
