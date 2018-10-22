import { CommonWrapper, mount, ReactWrapper, shallow } from 'enzyme';
import * as plotly from 'plotly.js-gl2d-dist';
import * as React from 'react';

import { PlotlyChart } from '~chell-viz~';
import { IMockPlotlyCanvas } from '~chell-viz~/test';

/**
 * Helper function to create and wait for a Component to be mounted.
 *
 * @param Component The component to mount.
 * @returns A wrapper for the component.
 */
export const getAsyncMountedComponent = async (Component: React.ReactElement<any>) => {
  const wrapper = mount(Component);
  wrapper.update();
  await Promise.resolve();

  return wrapper;
};

/**
 * Helper function to create and wait for a Component via enzyme's shallow render method..
 *
 * @param Component The component to mount.
 * @returns A wrapper for the component.
 */
export const getAsyncShallowComponent = async (Component: React.ReactElement<any>) => {
  const wrapper = shallow(Component);
  wrapper.update();
  await Promise.resolve();

  return wrapper;
};

/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param eventName The name of the event to dispatch.
 * @param [data={ x: 0, y: 0 }] Custom plotly data for the event.
 */
export const dispatchPlotlyEvent = async (
  wrapper: ReactWrapper,
  eventName: string,
  data: Partial<plotly.PlotScatterDataPoint> | plotly.SelectionRange = { x: [0], y: [0] },
) => {
  const plotlyWrapper = wrapper.find('PlotlyChart') as CommonWrapper;
  const canvas = (plotlyWrapper.instance() as PlotlyChart).plotlyCanvas;
  if (canvas) {
    (canvas as IMockPlotlyCanvas).dispatchEvent(new Event(eventName), data);
  }
  await Promise.resolve();
};

/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param eventName The name of the event to dispatch.
 * @param [data={ x: 0, y: 0 }] Custom plotly data for the event.
 */
export const dispatchPlotlySelectionEvent = async (
  wrapper: ReactWrapper,
  data: plotly.SelectionRange | RecursivePartial<plotly.PlotSelectionEvent> = {
    points: [{ x: 0, y: 0 }],
    range: { x: [0], y: [0] },
  },
) => {
  const plotlyWrapper = wrapper.find('PlotlyChart') as CommonWrapper;
  const canvas = (plotlyWrapper.instance() as PlotlyChart).plotlyCanvas;
  if (canvas) {
    (canvas as IMockPlotlyCanvas).dispatchEvent(new Event('plotly_selected'), data as Partial<
      plotly.PlotSelectionEvent
    >);
  }
  await Promise.resolve();
};

/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param event The name of the event to dispatch.
 */
export const dispatchPlotlySecondaryAxisEvent = (
  wrapper: CommonWrapper,
  event: string,
  data: object = { data: {}, x: [0], y: [0] },
) => {
  const canvas = (wrapper.instance() as PlotlyChart).plotlyCanvas;
  if (canvas) {
    (canvas as IMockPlotlyCanvas).dispatchEvent(new Event(event), data);
  }
};

export class MockContextClass extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return <div>{`I am a class for a mock context!`}</div>;
  }
}
