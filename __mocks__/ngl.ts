/**
 * Mock implementations for the [NGL](https://github.com/arose/ngl) library.
 *
 * Our NGLComponent is, understandably, pretty coupled to the library so this is an attempt to mock the behaviors.
 *
 * Ideally it would be most beneficial if as much of the original ngl / automocked version could be used.
 * As of this writing, it is not 100% clear to me on how best to approach selectively mocking several
 * classes/methods of the 3rd party library while retaining most of the original functionality.
 *
 * https://facebook.github.io/jest/docs/en/manual-mocks.html
 */

import * as NGL from 'ngl';
import Signals from 'signals';

const ngl = jest.genMockFromModule<typeof NGL>('ngl');
const signals = jest.genMockFromModule<typeof Signals>('signals');

class MockStage {
  public callbacks = new Array<(...args: any[]) => void>();

  public signals = {
    clicked: new signals.Signal(),
  };

  constructor(canvas: HTMLElement) {
    return;
  }

  public addComponentFromObject = () => ({
    addRepresentation: (name: string, ...args: any[]) => name,
    removeRepresentation: jest.fn(),
    reprList: [],
    stage: {
      mouseControls: {
        add: jest.fn(),
        run: jest.fn(),
      },
    },
  });
  public defaultFileRepresentation = () => jest.fn();
  public dispose = () => jest.fn();
  public removeAllComponents = () => jest.fn();
}

(ngl.Stage as any).mockImplementation((canvas: HTMLCanvasElement) => {
  return new MockStage(canvas);
});

(ngl.Structure as any).mockImplementation(() => {
  return {
    getSequence: jest.fn(() => []),
    residueMap: {
      list: [],
    },
  };
});

ngl.autoLoad = jest.fn(
  (path: string) =>
    path.length === 0 ? Promise.reject(() => new Error('Empty path')) : Promise.resolve('Path is not empty'),
);
module.exports = ngl;
