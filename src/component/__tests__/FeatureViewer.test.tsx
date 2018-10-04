import { CommonWrapper, ReactWrapper, shallow } from 'enzyme';
import * as fetchMock from 'jest-fetch-mock';
import * as plotly from 'plotly.js-gl2d-dist';
import * as React from 'react';

import { FeatureViewer, IFeatureViewerState, PlotlyChart } from '~chell-viz~/component';
import { TintedChell1DSection } from '~chell-viz~/data';
import { getAsyncMountedComponent, IMockPlotlyCanvas } from '~chell-viz~/test';

describe('ProteinFeatureViewer', () => {
  let sampleData: Array<TintedChell1DSection<string>>;

  beforeEach(() => {
    fetchMock.resetMocks();
    sampleData = [
      new TintedChell1DSection('N64', 1999, 2001),
      new TintedChell1DSection('Melee', 2001, 2008),
      new TintedChell1DSection('Brawl', 2008, 2014),
      new TintedChell1DSection('3DS/WiiU', 2014, 2018),
      new TintedChell1DSection('Ultimate', 2018, 2019),
    ];
  });

  /**
   * Helper function to dispatch an event through plotly.
   *
   * @param wrapper The PlotlyChart.
   * @param eventName The name of the event to dispatch.
   * @param [data={ x: 0, y: 0 }] Custom plotly data for the event.
   */
  const dispatchPlotlyEvent = async (
    wrapper: ReactWrapper,
    eventName: string,
    data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = { x: 0, y: 0 },
  ) => {
    const plotlyWrapper = wrapper.find('PlotlyChart') as CommonWrapper;
    const canvas = (plotlyWrapper.instance() as PlotlyChart).plotlyCanvas;
    if (canvas) {
      (canvas as IMockPlotlyCanvas).dispatchEvent(new Event(eventName), data);
    }
    await Promise.resolve();
  };

  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<FeatureViewer />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match the default snapshot', () => {
    const wrapper = shallow(<FeatureViewer />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Event handlers', () => {
    it('Should handle selecting a single feature.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlyEvent(wrapper, 'plotly_selected', { x: 2017 });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(Array.from(state.selectedFeatureIndices)).toEqual([3]);
    });

    it('Should handle selecting multiple features sharing an overlap.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlyEvent(wrapper, 'plotly_selected', { x: 2018 });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(Array.from(state.selectedFeatureIndices)).toEqual([3, 4]);
    });

    it('Should handle selecting multiple features via selection box.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlyEvent(wrapper, 'plotly_selected', { x: [1999, 2018], y: [0, 2] });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(Array.from(state.selectedFeatureIndices)).toEqual([0, 1, 2, 3, 4]);
    });

    it('Should handle clicking a single feature.', async () => {
      const wrapper = await getAsyncMountedComponent(<FeatureViewer data={sampleData} />);
      await dispatchPlotlyEvent(wrapper, 'plotly_click', { x: 2002, y: 1 });
      const state = wrapper.instance().state as IFeatureViewerState;
      expect(Array.from(state.selectedFeatureIndices)).toEqual([1]);
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
