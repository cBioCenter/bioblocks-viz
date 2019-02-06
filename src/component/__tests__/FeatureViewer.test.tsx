import { shallow } from 'enzyme';
import * as React from 'react';

import { FeatureViewer, IFeatureViewerState } from '~chell-viz~/component';
import { Chell1DSection, TintedChell1DSection } from '~chell-viz~/data';
import { dispatchPlotlyEvent, dispatchPlotlySelectionEvent, getAsyncMountedComponent } from '~chell-viz~/test';

describe('ProteinFeatureViewer', () => {
  let sampleData: Array<TintedChell1DSection<string>>;

  beforeEach(() => {
    sampleData = [
      new TintedChell1DSection('N64', 1999, 2001),
      new TintedChell1DSection('Melee', 2001, 2008),
      new TintedChell1DSection('Brawl', 2008, 2014),
      new TintedChell1DSection('3DS/WiiU', 2014, 2018),
      new TintedChell1DSection('Ultimate', 2018, 2019),
    ];
  });

  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<FeatureViewer />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match the snapshot for sample data.', () => {
    const wrapper = shallow(<FeatureViewer data={sampleData} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match the snapshot for sample data when specifying a max length.', () => {
    const wrapper = shallow(<FeatureViewer data={sampleData} maxLength={2013} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match the snapshot for sample data when showing features grouped.', () => {
    const wrapper = shallow(<FeatureViewer data={sampleData} showGrouped={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match the snapshot when a background bar is provided', () => {
    const wrapper = shallow(<FeatureViewer backgroundBar={new TintedChell1DSection('', 1999, 2018, 'purple')} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Event handlers', () => {
    it('Should handle selecting a single feature.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlySelectionEvent(wrapper, { points: [{ x: 2017 }] });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(state.selectedFeatureIndices.toArray()).toEqual([3]);
    });

    it('Should handle selecting multiple features sharing an overlap.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlySelectionEvent(wrapper, { points: [{ x: 2018 }] });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(state.selectedFeatureIndices.toArray()).toEqual([3, 4]);
    });

    it('Should handle selecting multiple features via selection box.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlySelectionEvent(wrapper, {
        points: [{ x: [1999, 2018], y: [0, 2] }],
        range: { x: [1999, 2018], y: [0, 2] },
      });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(state.selectedFeatureIndices.toArray()).toEqual([0, 1, 2, 3, 4]);
    });

    it('Should call the appropriate callback on selection events.', async () => {
      const onSelectionSpy = jest.fn();
      const wrapper = await getAsyncMountedComponent(
        <FeatureViewer data={sampleData} onSelectCallback={onSelectionSpy} />,
      );
      await dispatchPlotlySelectionEvent(wrapper, {
        points: [{ x: [1999, 2018], y: [0, 2] }],
        range: { x: [1999, 2018], y: [0, 2] },
      });
      expect(onSelectionSpy).toHaveBeenCalledTimes(1);
      const onSelectedArgs = onSelectionSpy.mock.calls[0] as Array<{
        end: number;
        featuresSelected: Array<Chell1DSection<string>>;
        length: number;
        start: number;
      }>;

      expect(onSelectedArgs[0]).toMatchObject({
        end: 2018,
        length: 20,
        start: 1999,
      });

      for (const data of sampleData) {
        const { end, label, start } = data;
        expect(onSelectedArgs[0].featuresSelected).toContainEqual({
          label,
          sectionEnd: end,
          sectionStart: start,
        });
      }
    });

    it('Should handle clicking a single feature.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlyEvent(wrapper, 'plotly_click', { x: 2002, y: 1 });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(state.selectedFeatureIndices.toArray()).toEqual([1]);
    });

    it('Should call the appropriate callback when clicking a single feature.', async () => {
      const onClickSpy = jest.fn();
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} onClickCallback={onClickSpy} />);
      await dispatchPlotlyEvent(wrapper, 'plotly_click', { x: 2002, y: 1 });
      expect(onClickSpy).toHaveBeenCalledWith([{ label: 'Melee', sectionEnd: 2008, sectionStart: 2001 }]);
    });

    it('Should handle hovering over a single feature.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlyEvent(wrapper, 'plotly_hover', { x: 2013, y: 1 });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(state.hoveredFeatureIndex).toEqual(2);
      expect(state.hoverAnnotationText).toEqual('');
    });
  });
});
