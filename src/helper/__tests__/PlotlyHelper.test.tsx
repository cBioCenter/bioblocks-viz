import { CommonWrapper, mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as plotly from 'plotly.js';
import * as React from 'react';

import { IMockDict } from 'configs/SetupJest';
import { generatePointCloudData, PlotlyChart } from '../../helper/PlotlyHelper';

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
   * Adds a dummy PlotlyHTMLElement to our PlotlyChart to test surface-level events and interactions.
   *
   *
   * @param wrapper A normally produced wrapper created by enzyme's mount or shallow renderer.
   * @returns A wrapper for the PlotlyChart with the container reference set to a dummy PlotlyHTMLElement.
   */
  const withPlotlyContainer = (wrapper: CommonWrapper) => {
    const chartInstance = wrapper.instance() as PlotlyChart;

    const div = mount(<div />);
    chartInstance.container = {
      ...div.getDOMNode(),
      on: jest.fn() as any,
    } as plotly.PlotlyHTMLElement;
    chartInstance.forceUpdate();
    return wrapper;
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

  test('Should attach events when the container is attached.', () => {
    const spies: IMockDict = {
      onClickSpy: jest.fn(),
      onSelectedSpy: jest.fn(),
    };

    const wrapper = withPlotlyContainer(
      mount(
        <PlotlyChart data={sampleData} onClickCallback={spies.onClickSpy} onSelectedCallback={spies.onSelectedSpy} />,
      ),
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Should call the appropriate callback when the window is resized.', () => {
    const onResizeSpy = jest.fn();

    const wrapper = withPlotlyContainer(mount(<PlotlyChart data={sampleData} />));
    const chartInstance = wrapper.instance() as PlotlyChart;

    chartInstance.resize = onResizeSpy;
    chartInstance.attachListeners();
    window.dispatchEvent(new Event('resize'));
    expect(onResizeSpy).toHaveBeenCalledTimes(1);
  });
});

describe('generatePointCloudData', () => {
  test('Should create the expected plotly data format when given defaults.', () => {
    const result = generatePointCloudData(new Float32Array([1, 2, 3]), 'red', 4);
    expect(result).toMatchSnapshot();
  });
});
