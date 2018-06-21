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

const ngl = jest.genMockFromModule<typeof NGL>('ngl');

class MockStage {
  public events = new Map<string, (...args: any[]) => void>();
  public callbacks = new Array<(...args: any[]) => void>();
  public reprList: string[] = [];

  public mouseControls = {
    add: (eventName: string, callback: (...args: any[]) => void) => this.events.set(eventName, callback),
    run: (eventName: string, ...args: any[]) => {
      if (this.events.get(eventName)) {
        this.events.get(eventName)!(...args);
      }
    },
  };

  public signals = {
    clicked: {
      add: (callback: (...args: any[]) => void) => this.events.set('click', callback),
      dispatch: (...args: any[]) => {
        if (this.events.get('click')) {
          this.events.get('click')!(...args);
        }
      },
    },
  };

  constructor(canvas: HTMLElement) {
    return;
  }

  public addComponentFromObject = () => ({
    addRepresentation: (name: string, ...args: any[]) => {
      this.reprList.push(name);
      return name;
    },
    hasRepresentation: (name: string, ...args: any[]) => this.reprList.indexOf(name) !== -1,
    removeRepresentation: (name: string, ...args: any[]) => {
      this.reprList.splice(this.reprList.indexOf(name), 1);
    },

    stage: {
      mouseControls: this.mouseControls,
    },
  });
  public defaultFileRepresentation = (...args: any[]) => jest.fn();
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

(ngl.autoLoad as any) = jest.fn(
  (path: string) =>
    path.localeCompare('error/protein.pdb') === 0
      ? Promise.reject('Invalid NGL path.')
      : Promise.resolve('Mock NGL path.'),
);

// @ts-ignore
ngl.MouseActions = {
  CLICK: 'click',
  CLICK_PICK: 'clickPick',
  DOUBLE_CLICK: 'doubleClick',
  DRAG: 'drag',
  HOVER: 'hover',
  HOVER_PICK: 'hoverPick',
  SCROLL: 'scroll',
};

module.exports = ngl;
