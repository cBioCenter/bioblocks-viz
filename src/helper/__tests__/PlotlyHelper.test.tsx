import { CommonWrapper, mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { IMockDict } from 'configs/SetupJest';
import PlotlyChart, { generatePointCloudData, IPlotlyChartProps } from '../../helper/PlotlyHelper';

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
    } as Partial<Plotly.ScatterData>,
  ];

  /**
   * Helper function to create and wait for a PlotlyChart to be mounted.
   *
   * @param props Custom props to be passed to the chart.
   * @returns A wrapper for the PlotlyChart that has been mounted.
   */
  const getMountedPlotlyChart = async (props: IPlotlyChartProps) => {
    const wrapper = mount(<PlotlyChart {...props} />);
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
    (wrapper.instance() as PlotlyChart).plotlyCanvas!.dispatchEvent(new Event(event));
  };

  test('Should match existing snapshot when given empty data.', () => {
    const wrapper = mount(<PlotlyChart data={[]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Should match existing snapshot when given sample data.', () => {
    const wrapper = mount(<PlotlyChart data={sampleData} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Should handle callbacks.', () => {
    const spies: IMockDict = {
      onClickSpy: jest.fn(),
      onHoverSpy: jest.fn(),
      onSelectedSpy: jest.fn(),
      onUnHoverSpy: jest.fn(),
    };
    const wrapper = shallow(
      <PlotlyChart
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

  test('Should attach events when the container is attached.', async () => {
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

  test('Should call the appropriate callback when the window is resized.', async () => {
    const onResizeSpy = jest.fn();

    const wrapper = await getMountedPlotlyChart({ data: sampleData });
    const chartInstance = wrapper.instance() as PlotlyChart;

    chartInstance.resize = onResizeSpy;
    chartInstance.attachListeners();
    window.dispatchEvent(new Event('resize'));
    expect(onResizeSpy).toHaveBeenCalledTimes(1);
  });

  test('Should call the appropriate callback when plotly emits a click event.', async () => {
    const onClickSpy = jest.fn();
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
      onClickCallback: onClickSpy,
    });
    dispatchPlotlyEvent(wrapper, 'plotly_click');
    expect(onClickSpy).toBeCalled();
  });

  test('Should call the appropriate callback when plotly emits a hover event.', async () => {
    const onHoverSpy = jest.fn();
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
      onHoverCallback: onHoverSpy,
    });
    dispatchPlotlyEvent(wrapper, 'plotly_hover');
    expect(onHoverSpy).toBeCalled();
  });

  test('Should call the appropriate callback when plotly emits a un-hover event.', async () => {
    const onUnHoverSpy = jest.fn();
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
      onUnHoverCallback: onUnHoverSpy,
    });
    dispatchPlotlyEvent(wrapper, 'plotly_unhover');
    expect(onUnHoverSpy).toBeCalled();
  });

  test('Should call the appropriate callback when plotly emits a selected event.', async () => {
    const onSelectedSpy = jest.fn();
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
      onSelectedCallback: onSelectedSpy,
    });
    dispatchPlotlyEvent(wrapper, 'plotly_selected');
    expect(onSelectedSpy).toBeCalled();
  });

  test('Should unmount correctly.', async () => {
    const wrapper = await getMountedPlotlyChart({
      data: sampleData,
    });

    const chartInstance = wrapper.instance() as PlotlyChart;

    expect(chartInstance.plotlyCanvas).not.toBeNull();
    wrapper.unmount();
    expect(chartInstance.plotlyCanvas).toBeNull();
  });
});

describe('generatePointCloudData', () => {
  test('Should create the expected plotly data format when given defaults.', () => {
    const result = generatePointCloudData(new Float32Array([1, 2, 3]), 'red', 4);
    expect(result).toMatchSnapshot();
  });
});
