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

// tslint:disable:no-backbone-get-set-outside-model
import * as NGL from 'ngl';
import { Vector2 } from 'three';

const ngl = jest.genMockFromModule<typeof NGL>('ngl');

class MockStage {
  public events = new Map<string, (...args: any[]) => void>();
  public callbacks = new Array<(...args: any[]) => void>();
  public reprList: string[] = [];

  public mouseControls = {
    add: (eventName: string, callback: (...args: any[]) => void) => this.events.set(eventName, callback),
    run: (eventName: string, ...args: any[]) => {
      const cb = this.events.get(eventName);
      if (cb !== undefined) {
        cb(...args);
      }
    },
  };

  public mouseObserver = {
    canvasPosition: {
      distanceTo: jest.fn((pos: Vector2) => pos),
    },
    down: {
      distanceTo: jest.fn((pos: Vector2) => pos),
    },
    position: {
      distanceTo: jest.fn((pos: Vector2) => pos),
    },
    prevClickCP: {
      distanceTo: jest.fn((pos: Vector2) => pos),
    },
    prevPosition: {
      distanceTo: jest.fn((pos: Vector2) => pos),
    },
  };

  public signals = {
    clicked: {
      add: (callback: (...args: any[]) => void) => this.events.set('click', callback),
      dispatch: (...args: any[]) => {
        const cb = this.events.get('click');
        if (cb !== undefined) {
          cb(...args);
        }
      },
    },
  };

  public viewer = {
    requestRender: () => jest.fn(),
  };

  public viewerControls = {
    getPositionOnCanvas: (pos: number) => pos,
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
      mouseObserver: this.mouseObserver,
      viewerControls: this.viewerControls,
    },
    structure: new ngl.Structure(),
  });
  public defaultFileRepresentation = (...args: any[]) => jest.fn();
  public dispose = () => jest.fn();
  public handleResize = () => jest.fn();
  public removeAllComponents = () => jest.fn();
}

(ngl.Stage as jest.Mock<NGL.Stage>).mockImplementation((canvas: HTMLCanvasElement) => {
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

(ngl.Structure as jest.Mock<NGL.Structure>).mockImplementation((name: string) => {
  return {
    atomMap: { dict: { 'CA|C': 2 } },
    eachResidue: jest.fn(
      (cb: (...args: any[]) => void) => (name.localeCompare('sample.pdb') ? sampleResidues.map(cb) : {}),
    ),
    getAtomProxy: jest.fn((index: number) => ({
      distanceTo: (pos: number) => pos + index,
      positionToVector3: () => index,
    })),
    getResidueProxy: jest.fn((resno: number) => ({
      getAtomIndexByName: () => resno,
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

module.exports = ngl;
