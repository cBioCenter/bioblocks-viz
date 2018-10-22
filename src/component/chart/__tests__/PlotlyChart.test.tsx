import { mount } from 'enzyme';
import * as React from 'react';

import { IPlotlyChartProps, PlotlyChart } from '~chell-viz~/component';
import { CHELL_CHART_EVENT_TYPE, CHELL_CHART_PIECE, ChellChartEvent, IPlotlyData } from '~chell-viz~/data';
import {
  dispatchPlotlyEvent,
  dispatchPlotlySecondaryAxisEvent,
  dispatchPlotlySelectionEvent,
  IMockDict,
} from '~chell-viz~/test';

beforeEach(() => {
  jest.resetModules();
});

describe('PlotlyChart', () => {
  let sampleData: Array<Partial<IPlotlyData>>;
  beforeEach(() => {
    sampleData = [
      {
        marker: {
          color: 'blue',
        },
        mode: 'markers',
        type: 'pointcloud',
        xy: new Float32Array([1, 2, 3, 4]),
      },
    ];
  });

  /**
   * Helper function to create and wait for a PlotlyChart to be mounted.
   *
   * @param props Custom props to be passed to the chart.
   * @returns A wrapper for the PlotlyChart that has been mounted.
   */
  const getMountedPlotlyChart = async (props: IPlotlyChartProps) => {
    const wrapper = mount(<PlotlyChart {...props} />);
    wrapper.update();
    await Promise.resolve();

    return wrapper;
  };

  it('Should match existing snapshot when given empty data.', () => {
    const wrapper = mount(<PlotlyChart data={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data.', () => {
    const wrapper = mount(<PlotlyChart data={sampleData} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Event Callbacks', () => {
    it('Should handle plotly events.', async () => {
      const spies: IMockDict = {
        onClickSpy: jest.fn(),
        onDoubleClickSpy: jest.fn(),
        onHoverSpy: jest.fn(),
        onRelayoutSpy: jest.fn(),
        onSelectedSpy: jest.fn(),
        onUnHoverSpy: jest.fn(),
      };

      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onClickCallback: spies.onClickSpy,
        onDoubleClickCallback: spies.onDoubleClickSpy,
        onHoverCallback: spies.onHoverSpy,
        onRelayoutCallback: spies.onRelayoutSpy,
        onSelectedCallback: spies.onSelectedSpy,
        onUnHoverCallback: spies.onUnHoverSpy,
      });

      await Promise.all([
        dispatchPlotlyEvent(wrapper, 'plotly_click'),
        dispatchPlotlyEvent(wrapper, 'plotly_doubleclick'),
        dispatchPlotlyEvent(wrapper, 'plotly_hover'),
        dispatchPlotlyEvent(wrapper, 'plotly_relayout'),
        dispatchPlotlySelectionEvent(wrapper),
        dispatchPlotlyEvent(wrapper, 'plotly_unhover'),
      ]);

      for (const key of Object.keys(spies)) {
        expect(spies[key]).toHaveBeenCalledTimes(1);
      }
    });

    it('Should attach events when the container is attached.', async () => {
      const spies: IMockDict = {
        onClickSpy: jest.fn(),
        onSelectedSpy: jest.fn(),
      };

      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onClickCallback: spies.onClickSpy,
        onSelectedCallback: spies.onSelectedSpy,
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('Should call the appropriate callback when the window is resized.', async () => {
      const onResizeSpy = jest.fn();

      const wrapper = await getMountedPlotlyChart({ data: sampleData });
      const chartInstance = wrapper.instance() as PlotlyChart;

      chartInstance.resize = onResizeSpy;
      chartInstance.attachListeners();
      window.dispatchEvent(new Event('resize'));
      expect(onResizeSpy).toHaveBeenCalledTimes(1);
    });

    it('Should call the appropriate callback when plotly emits a click event.', async () => {
      const onClickSpy = jest.fn();
      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onClickCallback: onClickSpy,
      });
      await dispatchPlotlyEvent(wrapper, 'plotly_click');
      expect(onClickSpy).toBeCalled();
    });

    it('Should return the appropriate event when plotly emits a click event on a point.', async () => {
      const onClickSpy = jest.fn();
      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onClickCallback: onClickSpy,
      });
      await dispatchPlotlyEvent(wrapper, 'plotly_click', { x: 1, y: 2 });
      const chellEvent = onClickSpy.mock.calls[0][0] as ChellChartEvent;
      expect(chellEvent.chartPiece).toBe(CHELL_CHART_PIECE.POINT);
      expect(chellEvent.type).toBe(CHELL_CHART_EVENT_TYPE.CLICK);
      expect(chellEvent.selectedPoints).toEqual([1, 2]);
    });

    it('Should return the appropriate event when plotly emits a click event on a secondary x axis.', async () => {
      const onClickSpy = jest.fn();
      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onClickCallback: onClickSpy,
      });
      dispatchPlotlySecondaryAxisEvent(wrapper, 'plotly_click', { data: { xaxis: 'x2', yaxis: 'y' }, x: 1, y: 2 });
      const chellEvent = onClickSpy.mock.calls[0][0] as ChellChartEvent;
      expect(chellEvent.chartPiece).toBe(CHELL_CHART_PIECE.AXIS);
      expect(chellEvent.type).toBe(CHELL_CHART_EVENT_TYPE.CLICK);
      expect(chellEvent.selectedPoints).toEqual([2]);
    });

    it('Should return the appropriate event when plotly emits a click event on a secondary y axis.', async () => {
      const onClickSpy = jest.fn();
      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onClickCallback: onClickSpy,
      });
      dispatchPlotlySecondaryAxisEvent(wrapper, 'plotly_click', { data: { xaxis: 'x', yaxis: 'y2' }, x: 1, y: 2 });
      const chellEvent = onClickSpy.mock.calls[0][0] as ChellChartEvent;
      expect(chellEvent.chartPiece).toBe(CHELL_CHART_PIECE.AXIS);
      expect(chellEvent.type).toBe(CHELL_CHART_EVENT_TYPE.CLICK);
      expect(chellEvent.selectedPoints).toEqual([1]);
    });

    it('Should call the appropriate callback when plotly emits a hover event.', async () => {
      const onHoverSpy = jest.fn();
      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onHoverCallback: onHoverSpy,
      });
      await dispatchPlotlyEvent(wrapper, 'plotly_hover');
      expect(onHoverSpy).toBeCalled();
    });

    it('Should call the appropriate callback when plotly emits a selected event.', async () => {
      const onSelectedSpy = jest.fn();
      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onSelectedCallback: onSelectedSpy,
      });
      await dispatchPlotlySelectionEvent(wrapper);
      expect(onSelectedSpy).toBeCalled();
    });

    it('Should call the appropriate callback when plotly emits a selected event for a range of points.', async () => {
      const onSelectedSpy = jest.fn();
      const wrapper = await getMountedPlotlyChart({
        data: sampleData,
        onSelectedCallback: onSelectedSpy,
      });
      await dispatchPlotlySelectionEvent(wrapper, { points: [], range: { x: [0, 1], y: [0, 1] } });
      expect(onSelectedSpy).toBeCalled();
    });
  });

  it('Should unmount correctly.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChart;
    expect(chartInstance.plotlyCanvas).not.toBeNull();
    expect(chartInstance.plotlyCanvas).not.toBeUndefined();
    wrapper.unmount();
    expect(chartInstance.plotlyCanvas).toBeNull();
  });

  it('Should not call draw if data is unchanged.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChart;
    const drawSpy = jest.fn();
    chartInstance.draw = drawSpy;

    wrapper.setProps({
      data: sampleData,
    });

    expect(drawSpy).toHaveBeenCalledTimes(0);
  });

  it('Should call draw when data is updated.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChart;
    const drawSpy = jest.fn();
    chartInstance.draw = drawSpy;

    wrapper.setProps({
      data: {},
    });

    expect(drawSpy).toHaveBeenCalledTimes(1);
  });

  it('Should call draw when layout is updated.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChart;
    const drawSpy = jest.fn();
    chartInstance.draw = drawSpy;

    wrapper.setProps({
      layout: {
        autosize: false,
      },
    });

    expect(drawSpy).toHaveBeenCalledTimes(1);
  });

  it('Should call draw when config is updated.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChart;
    const drawSpy = jest.fn();
    chartInstance.draw = drawSpy;

    wrapper.setProps({
      config: {
        displayModeBar: true,
      },
    });

    expect(drawSpy).toHaveBeenCalledTimes(1);
  });

  it('Should handle extra axes correctly.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: [...sampleData, ...[{ xaxis: 'x2' }, { yaxis: 'y2' }]],
    });

    expect(wrapper).toMatchSnapshot();
  });
});
