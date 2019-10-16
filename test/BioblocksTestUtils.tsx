import { CommonWrapper, mount, ReactWrapper, shallow } from 'enzyme';
// tslint:disable-next-line: no-submodule-imports
import * as plotly from 'plotly.js/lib/index-gl2d';
import * as React from 'react';

import { PlotlyChart } from '~bioblocks-viz~/component';
import {
  Bioblocks1DSection,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_CODES,
  SECONDARY_STRUCTURE_KEYS,
} from '~bioblocks-viz~/data';
import { IMockPlotlyCanvas } from '~bioblocks-viz~/test';

/**
 * Helper function to create and wait for a Component to be mounted.
 *
 * @param Component The component to mount.
 * @returns A wrapper for the component.
 */
export const getAsyncMountedComponent = async (Component: React.ReactElement) => {
  const wrapper = mount(Component);
  wrapper.update();
  await flushPromises();

  return wrapper;
};

/**
 * Helper function to create and wait for a Component via enzyme's shallow render method..
 *
 * @param Component The component to mount.
 * @returns A wrapper for the component.
 */
export const getAsyncShallowComponent = async (Component: React.ReactElement) => {
  const wrapper = shallow(Component);
  wrapper.update();
  await flushPromises();

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
  data:
    | Partial<plotly.PlotScatterDataPoint>
    | Partial<plotly.PlotSelectionEvent>
    | Partial<plotly.SelectionRange>
    | RecursivePartial<plotly.PlotMouseEvent> = { x: [0], y: [0] },
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

export const genSecondaryStructureSection = (
  structId: keyof typeof SECONDARY_STRUCTURE_CODES,
  resno: number,
  length: number = 1,
): SECONDARY_STRUCTURE => [new Bioblocks1DSection<SECONDARY_STRUCTURE_KEYS>(structId, resno, resno + length - 1)];

/**
 * Gets some data suitable for a tensorflow t-sne component. Taken from 'hpc' spring dataset.
 *
 */
export const genTensorTsneData = () => [
  [
    -6.07794,
    0.66089,
    3.42628,
    1.85904,
    -2.41684,
    -0.43664,
    -2.30753,
    2.35615,
    -1.12598,
    -0.60199,
    -1.1218,
    0.11698,
    -0.04982,
    0.36092,
    -0.0508,
    -0.08095,
    0.80147,
    -0.4348,
    0.1589,
    -0.37422,
    -0.29722,
    0.25252,
    0.23296,
    -0.29226,
    -0.3324,
    -1.13309,
    0.37442,
    -0.0253,
    -0.02493,
    0.36059,
  ],
  [
    -5.00513,
    1.26166,
    4.98725,
    1.97746,
    -2.81049,
    -0.48861,
    0.39672,
    -0.04346,
    -1.18266,
    -0.22673,
    0.64698,
    -0.32172,
    -0.46212,
    -0.94495,
    -0.28995,
    -0.28883,
    -0.89687,
    -0.15866,
    -0.11644,
    1.05208,
    -0.51977,
    -0.30863,
    1.09945,
    0.41791,
    -0.56852,
    -0.2366,
    -0.1608,
    0.89874,
    -0.19515,
    0.05163,
  ],
];

// Helpful when dealing with async component lifecycle method testing.
// https://medium.com/@lucksp_22012/jest-enzyme-react-testing-with-async-componentdidmount-7c4c99e77d2d
export const flushPromises = async () => new Promise(setImmediate);
