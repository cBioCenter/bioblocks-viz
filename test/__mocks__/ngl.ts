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
import { Matrix4, Vector2 } from 'three';

const ngl = jest.genMockFromModule<typeof NGL>('ngl');

class MockStage {
  public compList = new Array<MockStructureComponent>();
  public events = new Map<string, (...args: any[]) => void>();
  public callbacks = new Array<(...args: any[]) => void>();
  public tooltip: Partial<HTMLElement> = { textContent: '' };

  public keyBehavior = {
    domElement: this.canvas,
  };

  public mouseControls = {
    actionList: new Array<string>(),
    add: (eventName: string, callback: (...args: any[]) => void) => this.events.set(eventName, callback),
    remove: (eventName: string, callback: (...args: any[]) => void) => this.events.delete(eventName),
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

  public parameters: object = {
    cameraType: 'perspective',
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
    renderer: {
      forceContextLoss: () => jest.fn(),
    },
    requestRender: () => jest.fn(),
  };

  public viewerControls = {
    getOrientation: () => new Matrix4(),
    getPositionOnCanvas: (pos: number) => pos,
    orient: (matrix: Matrix4) => undefined,
  };

  constructor(readonly canvas: HTMLElement) {
    return;
  }

  public addComponentFromObject = (structure: NGL.Structure) => {
    const structureComponent = new MockStructureComponent(structure.name, {
      keyBehavior: this.keyBehavior,
      mouseControls: this.mouseControls,
      mouseObserver: this.mouseObserver,
      tooltip: this.tooltip,
      viewerControls: this.viewerControls,
    });
    this.compList.push(structureComponent);

    return structureComponent;
  };
  public autoView = () => jest.fn();
  public defaultFileRepresentation = (...args: any[]) => jest.fn();
  public dispose = () => jest.fn();
  public handleResize = () => jest.fn();
  public removeAllComponents = () => jest.fn();
  public setParameters = (params: object) => {
    this.parameters = params;
  };
}

(ngl.Stage as jest.Mock<NGL.Stage>) = jest.fn().mockImplementation((canvas: HTMLCanvasElement) => {
  return new MockStage(canvas);
});

const genericResidue = (resno: number, chainIndex: number = 0) => ({
  chainIndex,
  isHelix: () => false,
  isProtein: () => true,
  isSheet: () => false,
  isTurn: () => false,
  resno,
});

const helixResidue = (resno: number, chainIndex: number = 0) => ({
  ...genericResidue(resno, chainIndex),
  isHelix: () => true,
  resname: 'Histidine',
});

const sheetResidue = (resno: number, chainIndex: number = 0) => ({
  ...genericResidue(resno, chainIndex),
  isSheet: () => true,
  resname: 'Glutamic Acid',
});

const turnResidue = (resno: number, chainIndex: number = 0) => ({
  ...genericResidue(resno, chainIndex),
  isTurn: () => true,
  resname: 'Cysteine',
});

const sampleResidues = [helixResidue(1), sheetResidue(2), turnResidue(3)];
const chainResidues = [...sampleResidues, helixResidue(1, 1), helixResidue(2, 1), helixResidue(3, 1)];

// tslint:disable-next-line:max-classes-per-file
class MockStructureComponent {
  public name = '';
  public position = new Array<number>();
  public reprList = new Array<string>();

  public structure: MockStructure;

  constructor(name: string, readonly stage?: object) {
    this.name = name;
    this.structure = new MockStructure(name);
  }

  public addRepresentation(name: string, ...args: any[]) {
    this.reprList.push(name);

    return { name: () => name, setParameters: jest.fn() };
  }

  public autoView() {
    return;
  }

  public hasRepresentation(name: string, ...args: any[]) {
    return this.reprList.indexOf(name) !== -1;
  }

  public removeRepresentation(name: string, ...args: any[]) {
    this.reprList.splice(this.reprList.indexOf(name), 1);
  }

  public removeAllRepresentations() {
    this.reprList = [];
  }

  public setPosition(position: number[]) {
    this.position = position;
  }

  public updateRepresentations(rep: object) {
    return;
  }
}

// tslint:disable-next-line:max-classes-per-file
class MockStructure {
  public atomMap = { dict: { 'CA|C': 2 } };

  public eachResidue = jest.fn((cb: (...args: any[]) => void) => {
    if (this.name.endsWith('sample.pdb')) {
      return sampleResidues.map(cb);
    } else if (this.name.endsWith('chain.pdb')) {
      return chainResidues.map(cb);
    }

    return {};
  });
  public getAtomProxy = jest.fn((index: number) => ({
    distanceTo: (atomProxy: NGL.AtomProxy) => atomProxy.index + index,
    index,
    positionToVector3: () => index,
  }));
  public getResidueProxy = jest.fn((resno: number) => ({
    getAtomIndexByName: () => resno,
  }));
  public getSequence = jest.fn(() => []);
  public residueMap = {
    list: [],
  };
  public residueStore = {
    atomCount: [2, 2],
    atomOffset: [0, 2],
    // We are the priests, of the Temples of Syrinx.
    // Our great computers fill the hollowed halls.
    residueTypeId: [2, 1, 1, 2],
    resno: [1, 2],
  };
  public constructor(readonly name: string) {
    return;
  }
}

(ngl.Structure as jest.Mock<NGL.Structure>) = jest.fn().mockImplementation((name: string) => {
  return new MockStructure(name);
});

(ngl.autoLoad as any) = jest.fn((path: string) =>
  path.localeCompare('error/protein.pdb') === 0 ? Promise.reject('Invalid NGL path.') : new ngl.Structure(path),
);

module.exports = ngl;
