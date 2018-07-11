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

  public viewer = {
    requestRender: () => jest.fn(),
  };

  constructor(canvas: HTMLElement) {
    return;
  }

  public addComponentFromObject = () => ({
    addRepresentation: (name: string, ...args: any[]) => {
      this.reprList.push(name);
      return { name: () => name, setParameters: jest.fn() };
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

const genericResidue = (resno: number) => ({
  isHelix: () => false,
  isProtein: () => true,
  isSheet: () => false,
  isTurn: () => false,
  resno,
});

const helixResidue = (resno: number) => ({
  ...genericResidue(resno),
  isHelix: () => true,
});

const sheetResidue = (resno: number) => ({
  ...genericResidue(resno),
  isSheet: () => true,
});

const turnResidue = (resno: number) => ({
  ...genericResidue(resno),
  isTurn: () => true,
});

const sampleResidues = [helixResidue(1), sheetResidue(2), turnResidue(3)];

(ngl.Structure as any).mockImplementation((name: string) => {
  return {
    atomMap: { dict: { 'CA|C': 2 } },
    eachResidue: jest.fn(cb => (name.localeCompare('sample.pdb') ? sampleResidues.map(residue => cb(residue)) : {})),
    getAtomProxy: jest.fn(() => ({
      distanceTo: (...args: any[]) => 1,
    })),
    getSequence: jest.fn(() => []),
    residueMap: {
      list: [],
    },
    residueStore: {
      atomCount: [2, 2],
      atomOffset: [0, 2],
      // We are the priests, of the Temples of Syrinx.
      // Our great computers fill the hollowed halls.
      residueTypeId: [2, 1, 1, 2],
      resno: [1, 2],
    },
  };
});

(ngl.autoLoad as any) = jest.fn(
  (path: string) =>
    path.localeCompare('error/protein.pdb') === 0 ? Promise.reject('Invalid NGL path.') : new NGL.Structure(path),
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
