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
  export const enum MouseActions {
    'SCROLL' = 'scroll',
    'DRAG' = 'drag',
    'CLICK' = 'click',
    'DOUBLE_CLICK' = 'doubleClick',
    'HOVER' = 'hover',
    'CLICK_PICK' = 'clickPick',
    'HOVER_PICK' = 'hoverPick',
  }

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

  /**
   * Key controls.
   *
   * @export
   */
  export class KeyControls {
    // Properties
    public actionList: IKeyAction[];
    public disabled: boolean;
    public stage: Stage;

    /**
     * Creates an instance of KeyControls.
     *
     * @param stage The stage object.
     */
    constructor(stage: Stage, params?: IKeyControlsParams);

    // Methods
    /**
     * Add a key action triggered by pressing the given character. The KeyActions class provides a number of static methods for use as callback functions.
     *
     * @example // Call KeyActions.toggleRock when "k" is pressed.
     * stage.keyControls.remove("k", KeyActions.toggleRock);
     *
     * @param char The key/character.
     * @param callback The callback function for the action.
     */
    public add(char: string, callback: KeyActionCallback): void;

    /**
     * Remove all key actions.
     */
    public clear(): void;

    /**
     * Set key action preset.
     *
     * @param name One of "default".
     */
    public preset(name: KeyControlPreset): void;

    /**
     * Remove a key action. When the callback function is given, only actions that call that function are removed.
     *
     * @example // Remove all actions triggered by pressing "k".
     * stage.keyControls.remove("k");
     *
     * @example Remove action toggleRock triggered by pressing "k".
     * stage.keyControls.remove( "k", toggleRock );
     *
     * @param char The key/character.
     * @param callback Only actions that call this function will be removed.
     */
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

  /**
   * Mouse controls.
   *
   * @export
   */
  export class MouseControls {
    // Properties
    public actionList: IMouseAction[];
    public disabled: boolean;
    public mouse: MouseObserver;
    public stage: Stage;

    /**
     * The stage object.
     */
    constructor(stage: Stage, params?: IMouseControlsParams);

    // Methods
    /**
     * Add a new mouse action triggered by an event, key and button combination. The MouseActions class provides a number of static methods for use as callback functions.
     *
     * @example // change ambient light intensity on mouse scroll while the ctrl and shift keys are pressed.
     * stage.mouseControls.add("scroll-ctrl+shift", function(stage, delta) {
     *   var ai = stage.getParameters().ambientIntensity;
     *   stage.setParameters({ ambientIntensity: Math.max( 0, ai + delta / 50 ) });
     * });
     *
     * @example // Call the MouseActions.zoomDrag method on mouse drag events with left and right mouse buttons simultaneously
     * stage.mouseControls.add("drag-left+right", MouseActions.zoomDrag);
     *
     * @param triggerStr The trigger for the action.
     * @param callback The callback function for the action.
     */
    public add(triggerStr: string, callback: MouseActionCallback): void;

    /**
     * Remove all mouse actions.
     */
    public clear(): void;

    /**
     * Set mouse action preset.
     *
     * @param name One of "default", "pymol", "coot".
     */
    public preset(name: MouseControlPreset): void;

    /**
     * Remove a mouse action. The trigger string can contain an asterisk (*) as a wildcard for any key or mouse button.
     * When the callback function is given, only actions that call that function are removed.
     *
     * @example // Remove actions triggered solely by a scroll event.
     * stage.mouseControls.remove("scroll");
     *
     * @example // Remove actions triggered by a scroll event, including those requiring a key pressed or mouse button used.
     * stage.mouseControls.remove("scroll-*");
     *
     * @example // Remove actions triggered by a scroll event while the shift key is pressed
     * stage.mouseControls.remove("scroll-shift");
     *
     * @param triggerStr The trigger for the action.
     * @param callback Only actions that call this function will be removed.
     */
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
    type: string;
    data: object;
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
