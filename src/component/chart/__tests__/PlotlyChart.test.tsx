import { CommonWrapper, mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { IMockDict } from 'configs/SetupJest';
import { IPlotlyChartProps, IPlotlyData, PlotlyChartClass } from '../PlotlyChart';

beforeEach(() => {
  jest.resetModules();
});

describe('PlotlyChart', () => {
  const sampleData = [
    {
      marker: {
        color: 'blue',
      },
      mode: 'markers',
      type: 'pointcloud',
      uid: 'adam',
      xy: new Float32Array([1, 2, 3, 4]),
    } as Partial<IPlotlyData>,
  ];
  /**
   * Helper function to create and wait for a PlotlyChart to be mounted.
   *
   * @param props Custom props to be passed to the chart.
   * @returns A wrapper for the PlotlyChart that has been mounted.
   */
  const getMountedPlotlyChart = async (props: IPlotlyChartProps) => {
    const wrapper = mount(<PlotlyChartClass {...props} />);
    await wrapper.update();
    return wrapper;
  };

  /**
   * Helper function to dispatch an event through plotly.
   *
   * @param wrapper The PlotlyChart.
   * @param event The name of the event to dispatch.
   */
  const dispatchPlotlyEvent = (wrapper: CommonWrapper, event: string) => {
    (wrapper.instance() as PlotlyChartClass).plotlyCanvas!.dispatchEvent(new Event(event));
  };

  it('Should match existing snapshot when given empty data.', () => {
    const wrapper = mount(<PlotlyChartClass data={[]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data.', () => {
    const wrapper = mount(<PlotlyChartClass data={sampleData} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should handle callbacks.', () => {
    const spies: IMockDict = {
      onClickSpy: jest.fn(),
      onHoverSpy: jest.fn(),
      onSelectedSpy: jest.fn(),
      onUnHoverSpy: jest.fn(),
    };
    const wrapper = shallow(
      <PlotlyChartClass
        data={sampleData}
        onClickCallback={spies.onClickSpy}
        onHoverCallback={spies.onHoverSpy}
        onSelectedCallback={spies.onSelectedSpy}
        onUnHoverCallback={spies.onUnHoverSpy}
      />,
    );

    wrapper.instance().props.onClickCallback();
    wrapper.instance().props.onHoverCallback();
    wrapper.instance().props.onSelectedCallback();
    wrapper.instance().props.onUnHoverCallback();

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

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should call the appropriate callback when the window is resized.', async () => {
    const onResizeSpy = jest.fn();

    const wrapper = await getMountedPlotlyChart({ data: sampleData });
    const chartInstance = wrapper.instance() as PlotlyChartClass;

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
    dispatchPlotlyEvent(wrapper, 'plotly_click');
    expect(onClickSpy).toBeCalled();
  });

  it('Should call the appropriate callback when plotly emits a hover event.', async () => {
    const onHoverSpy = jest.fn();
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
      onHoverCallback: onHoverSpy,
    });
    dispatchPlotlyEvent(wrapper, 'plotly_hover');
    expect(onHoverSpy).toBeCalled();
  });

  it('Should call the appropriate callback when plotly emits a un-hover event.', async () => {
    const onUnHoverSpy = jest.fn();
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
      onUnHoverCallback: onUnHoverSpy,
    });
    dispatchPlotlyEvent(wrapper, 'plotly_unhover');
    expect(onUnHoverSpy).toBeCalled();
  });

  it('Should call the appropriate callback when plotly emits a selected event.', async () => {
    const onSelectedSpy = jest.fn();
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
      onSelectedCallback: onSelectedSpy,
    });
    dispatchPlotlyEvent(wrapper, 'plotly_selected');
    expect(onSelectedSpy).toBeCalled();
  });

  it('Should unmount correctly.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChartClass;

    expect(chartInstance.plotlyCanvas).not.toBeNull();
    wrapper.unmount();
    expect(chartInstance.plotlyCanvas).toBeNull();
  });

  it('Should not call draw if data is unchanged.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChartClass;
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

    const chartInstance = wrapper.instance() as PlotlyChartClass;
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

    const chartInstance = wrapper.instance() as PlotlyChartClass;
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

    const chartInstance = wrapper.instance() as PlotlyChartClass;
    const drawSpy = jest.fn();
    chartInstance.draw = drawSpy;

    wrapper.setProps({
      config: {
        displayModeBar: true,
      },
    });

    expect(drawSpy).toHaveBeenCalledTimes(1);
  });
});
