// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import { Matrix4, Quaternion, Vector2, Vector3 } from 'three';

  export type KeyActionCallback = (stage: Stage) => void;
  export type KeyActionPreset = Array<[string, KeyActionCallback]>;
  export type KeyControlPreset = 'default';

  export type ScrollCallback = (stage: Stage, delta: number) => void;
  export type DragCallback = (stage: Stage, dx: number, dy: number) => void;
  export type PickCallback = (stage: Stage, pickingProxy: PickingProxy) => void;

  export type MouseActionCallback = ScrollCallback | DragCallback | PickCallback;
  export type MouseActionPreset = Array<[string, MouseActionCallback]>;
  export type MouseActionType = '' | 'scroll' | 'drag' | 'click' | 'doubleClick' | 'hover' | 'clickPick' | 'hoverPick';

  export class ComponentControls {
    // Properties
    public component: Component;
    public signals: {
      changed: Signal;
    };
    public stage: Stage;
    public viewer: Viewer;

    constructor(component: Component);

    public changed(): void;
    public position(): Vector3;
    public rotation(): Quaternion;
    public spin(axis: Vector3, angle: number): void;
  }

  export interface IKeyControlsParams {
    preset?: KeyActionPreset;
    disabled?: boolean;
  }

  export interface IKeyAction {
    keyCode: number;
    callback: KeyActionCallback;
  }

  export class KeyControls {
    // Properties
    public actionList: IKeyAction[];
    public disabled: boolean;
    public stage: Stage;

    constructor(stage: Stage, params?: IKeyControlsParams);

    // Methods
    public add(char: string, callback: KeyActionCallback): void;
    public clear(): void;
    public preset(name: KeyControlPreset): void;
    public remove(char: string, callback: KeyActionCallback): void;
    public run(keyCode: number): void;
  }

  export interface IMouseAction {
    type: MouseActionType;
    key: number;
    button: number;
    callback: MouseActionCallback;
  }

  export type MouseControlPreset = 'default' | 'pymol' | 'coot' | 'astexviewer';
  export interface IMouseControlsParams {
    preset?: MouseControlPreset;
    disabled?: boolean;
  }

  export class MouseControls {
    // Properties
    public actionList: IMouseAction[];
    public disabled: boolean;
    public mouse: MouseObserver;
    public stage: Stage;

    constructor(stage: Stage, params?: IMouseControlsParams);

    // Methods
    public add(triggerStr: string, callback: MouseActionCallback): void;
    public clear(): void;
    public preset(name: MouseControlPreset): void;
    public remove(triggerStr: string, callback: MouseActionCallback): void;
    public run(type: MouseActionType, ...args: any[]): void;
  }

  interface IInstanceData {
    id: number;
    name: number | string;
    matrix: Matrix4;
  }

  export interface IPicker {
    array: any[];
    type(): string;
    data(): object;
  }

  export interface IPickingData {
    pid: number;
    picker: IPicker;
    instance: IInstanceData;
    controls: ViewerControls;
    mouse: MouseObserver;
  }

  export class PickingProxy {
    // Accessors
    public altKey: boolean;
    public arrow: ShapePrimitive;
    public atom: AtomProxy;
    public axes: any;
    public bond: BondProxy;
    public box: ShapePrimitive;
    public canvasPosition: Vector2;
    public clash: {
      sele1: string;
      sele2: string;
    };
    public closeAtom: undefined | AtomProxy;
    public closestBondAtom: undefined | AtomProxy;
    public component: Component;
    public cone: ShapePrimitive;
    public contact: object;
    public ctrlKey: boolean;
    public cylinder: ShapePrimitive;
    public distance: BondProxy;
    public ellipsoid: ShapePrimitive;
    public mesh: {
      name: string;
      serial: number;
      shape: Shape;
    };
    public metaKey: boolean;
    public object: any;
    public octahedron: ShapePrimitive;
    public point: ShapePrimitive;
    public position: Vector3;
    public shiftKey: boolean;
    public slice: object;
    public sphere: ShapePrimitive;
    public surface: object;
    public tetrahedron: ShapePrimitive;
    public torus: ShapePrimitive;
    public type: string;
    public unitcell: {
      structure: Structure;
      unitcell: Unitcell;
    };
    public unknown: any;
    public volume: {
      value: number;
      volume: Volume;
    };
    public wideline: ShapePrimitive;

    // Properties
    public controls: ViewerControls;
    public instance: IInstanceData;
    public mouse: MouseObserver;
    public picker: IPicker;
    public pid: number;
    public stage: Stage;

    constructor(pickingData: IPickingData, stage: Stage);

    // Methods
    public _objectIfType(type: string): any;
    public getLabel(): string;
  }

  export interface ITrackballControlsParams {
    rotateSpeed?: number;
    zoomSpeed?: number;
    panSpeed?: number;
  }

  export class TrackballControls {
    // Properties
    public controls: ViewerControls;
    public mouse: MouseObserver;
    public panSpeed: number;
    public rotateSpeed: number;
    public stage: Stage;
    public viewer: Viewer;
    public zoomSpeed: number;

    constructor(stage: Stage, params?: ITrackballControlsParams);

    // Accessors
    public atom(): undefined | AtomProxy;
    public component(): undefined | Component;

    // Methods
    public pan(x: number, y: number): void;
    public panAtom(x: number, y: number): void;
    public panComponent(x: number, y: number): void;
    public rotate(x: number, y: number): void;
    public rotateComponent(x: number, y: number): void;
    public zoom(delta: number): void;
  }
}
