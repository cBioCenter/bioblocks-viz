// Type definitions for [ngl] [https://github.com/arose/ngl]
// Project: [chell-viz-contact]
// Definitions by: [BCB @ DF-CI, Drew Diamantoukos] <[http://bcb.dfci.harvard.edu/]>
// Transcribed from ngl documentation.

// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import { Box3, Color, Euler, Group, Matrix4, Quaternion, Scene, Vector2, Vector3, WebGLRenderer } from 'three';

  export class Animation {
    // Properties
    public alpha: number;
    public controls: ViewerControls;
    public duration: number;
    public elapsedDuration: number;
    public ignoreGlobalToggle: boolean;
    public pausedDuration: number;
    public pausedTime: number;
    public startTime: number;

    constructor(duration: number | undefined, controls: ViewerControls, ...args: any[]);
  }

  export class AnimationBehavior {
    // Properties
    public animationControls: AnimationControls;
    public stage: Stage;
    public viewer: Viewer;

    constructor(stage: Stage);
  }

  export class AnimationControls {
    // Properties
    public animationList: Animation[];
    public controls: ViewerControls;
    public finishedList: Animation[];
    public stage: Stage;
    public Viewer: Viewer;

    constructor(stage: Stage);

    // Accessors
    public done(): boolean;
    public paused(): boolean;

    // Methods
    public add(animation: Animation): Animation;
    public clear(): void;
    public dispose(): void;
    public move(moveTo: Vector3 | number[], duration?: undefined | number): Animation;
    public moveComponent(component: Component, moveTo: Vector3 | number[], duration?: undefined | number): Animation;
    public orient(orientTo: Matrix4 | number[], duration?: undefined | number): AnimationList;
    public pause(): void;
    public remove(animation: Animation): void;
    public resume(): void;
    public rock(
      axis: Vector3 | number[],
      angle?: undefined | number,
      end?: undefined | number,
      duration?: undefined | number,
    ): Animation;
    public rockComponent(
      component: Component,
      axis: Vector3 | number[],
      angle?: undefined | number,
      end?: undefined | number,
      duration?: undefined | number,
    ): Animation;
    public rotate(rotateTo: Quaternion | number[], duration?: undefined | number): Animation;
    public run(stats: Stats): void;
    public spin(axis: Vector3 | number[], angle?: undefined | number, duration?: undefined | number): Animation;
    public spinComponent(
      component: Component,
      axis?: Vector3 | number[],
      angle?: undefined | number,
      duration?: undefined | number,
    ): Animation;
    public timeout(callback: () => void, duration?: undefined | number): Animation;
    public toggle(): void;
    public value(valueFrom: number, valueTo: number, callback: () => void, duration?: undefined | number): Animation;
    public zoom(zoomTo: number, duration?: undefined | number): Animation;
    public zoomMove(moveTo: Vector3, zoomTo: number, duration?: undefined | number): AnimationList;
  }

  export class AnimationList {
    // Properties
    // tslint:disable:variable-name
    public _list: Animation[];
    public _resolveList: Array<() => {}>;
    // tslint:enable:variable-name

    constructor(list?: Animation[]);

    public done(): boolean;
    public then(callback: () => void): Promise<any>;
  }

  export interface IAnnotationParams {
    offsetX?: number;
    offsetY?: number;
    visible?: boolean;
  }

  export class Annotation {
    // Properties
    public component: Component;
    public element: HTMLElement;
    public offsetX: number;
    public offsetY: number;
    public position: Vector3;
    public stage: Stage;
    public viewer: Viewer;
    public visible: boolean;

    constructor(component: Component, position: Vector3, content: string | HTMLElement, params?: IAnnotationParams);

    public _update(): void;
    public _updateViewerPosition(): void;
    public dispose(): void;
    public getVisibility(): boolean;
    public setContent(value: string | HTMLElement): void;
    public setVisibility(value: boolean): void;
    public updateVisibility(): void;
  }

  export class AtomProxy {
    // Accessors
    public altloc: string;
    public aromat: number;
    public atomType: AtomType;
    public atomname: string;
    public bfactor: number;
    public bondCount: number;
    public bondHash: undefined | BondHash;
    public chainIndex: number;
    public chainid: string;
    public covalent: number;
    public element: string;
    public entity: Entity;
    public entityIndex: number;
    public formalCharge: null | number;
    public hetero: number;
    public inscode: string;
    public modelIndex: number;
    public number: number;
    public occupancy: number;
    public partialCharge: null | number;
    public residue: ResidueProxy;
    public residueAtomOffset: number;
    public residueIndex: number;
    public residueType: ResidueType;
    public resname: string;
    public resno: number;
    public serial: number;
    public sstruc: string;
    public vdw: number;
    public x: number;
    public y: number;
    public z: number;

    // Properties
    public atomMap: AtomMap;
    public atomStore: AtomStore;
    public chainStore: ChainStore;
    public index: number;
    public residueMap: ResidueMap;
    public residueStore: ResidueStore;
    public structure: Structure;

    constructor(structure: Structure, index?: number);

    // Methods
    public bondToElementCount(element: Elements): number;
    public clone(): AtomProxy;
    public connectedTo(atom: AtomProxy): boolean;
    public distanceTo(atom: AtomProxy): number;
    public eachBond(callback: () => void, bp?: BondProxy): void;
    public eachBondedAtom(callback: () => void, ap?: AtomProxy): void;
    public getDefaultValence(): number;
    public getOuterShellElectronCount(): number;
    public getResidueBonds(firstOnly?: boolean): undefined | number | number[];
    public getValenceList(): number[];
    public hasBondTo(ap: AtomProxy): boolean;
    public hasBondToElement(element: Elements): boolean;
    public isActinide(): boolean;
    public isAlkaliMetal(): boolean;
    public isAlkalineEarthMetal(): boolean;
    public isAromatic(): boolean;
    public isBackbone(): boolean;
    public isBonded(): boolean;
    public isCg(): boolean;
    public isDiatomicNonmetal(): boolean;
    public isDna(): boolean;
    public isHalogen(): boolean;
    public isHelix(): boolean;
    public isHetero(): boolean;
    public isIon(): boolean;
    public isLanthanide(): boolean;
    public isMetal(): boolean;
    public isNobleGas(): boolean;
    public isNonmetal(): boolean;
    public isNucleic(): boolean;
    public isPolyatomicNonmetal(): boolean;
    public isPolymer(): boolean;
    public isPostTransitionMetal(): boolean;
    public isProtein(): boolean;
    public isRing(): boolean;
    public isRna(): boolean;
    public isSaccharide(): boolean;
    public isSheet(): boolean;
    public isSidechain(): boolean;
    public isTrace(): boolean;
    public isTransitionMetal(): boolean;
    public isTurn(): boolean;
    public isWater(): boolean;
    public positionAdd(v: Vector3 | AtomProxy): this;
    public positionFromArray(array: NumberArray, offset?: number): this;
    public positionFromVector3(v: Vector3): this;
    public positionSub(v: Vector3 | AtomProxy): this;
    public positionToArray(
      array?: NumberArray,
      offset?: number,
    ):
      | number[]
      | Uint8Array
      | Int8Array
      | Int16Array
      | Int32Array
      | Uint16Array
      | Uint32Array
      | Float32Array
      | Uint8ClampedArray
      | Float64Array;
    public positionToVector3(v: Vector3): Vector3;
    public qualifiedName(noResname?: boolean): string;
    public toObject(): {
      altloc: string;
      atomname: string;
      bfactor: number;
      chainname: string;
      covalent: number;
      element: string;
      hetero: number;
      index: number;
      modelIndex: number;
      residueIndex: number;
      resname: string;
      resno: number;
      serial: number;
      vdw: number;
      x: number;
      y: number;
      z: number;
    };
  }

  export class AtomMap {}

  export class AtomStore {}

  export class AtomType {}

  export class BondHash {}

  export class BondProxy {}

  export interface IBufferInstance {
    matrix: Matrix4;
  }

  export type CameraType = 'perspective' | 'orthographic' | 'stereo';

  export class ChainStore {}

  export interface IComponentParameters {
    name: string;
    status: string;
    visible: boolean;
  }

  /**
   * Base class for components.
   *
   * @export
   * @class Component
   */
  export class Component {
    // Accessors
    public defaultParameters: IComponentParameters;
    public name: string;
    public status: string;
    public type: string;
    public visible: boolean;

    // Properties
    public annotationList: Annotation[];
    public controls: ComponentControls;
    public matrix: Matrix4;
    public object: any;
    public parameters: IComponentParameters;
    public position: Vector3;
    public quaternion: Quaternion;
    public reprList: RepresentationElement[];
    public scale: Vector3;

    /** Events emitted by the component. */
    public readonly signals: {
      disposed: Signal;
      matrixChanged: Signal;
      nameChanged: Signal;
      representationAdded: Signal;
      representationRemoved: Signal;
      statusChanged: Signal;
      visibilityChanged: Signal;
    };
    public stage: Stage;
    public transform: Matrix4;
    public uuid: string;
    public viewer: Viewer;

    /**
     * Creates an instance of Component.
     *
     * @param {Stage} stage Stage object the component belongs to.
     * @param {*} object
     * @param {Partial<IComponentParameters>} [params] Parameter object.
     * @memberof Component
     */
    constructor(stage: Stage, object: any, params?: Partial<IComponentParameters>);

    // Methods
    /**
     * Add an annotation object.
     *
     * @param {Vector3} position The 3d position.
     * @param {(string | HTMLElement)} content The HTML content.
     * @param {IAnnotationParams} params
     * @returns {Annotation} The added annotation object.
     * @memberof Component
     */
    public addAnnotation(position: Vector3, content: string | HTMLElement, params: IAnnotationParams): Annotation;

    public addBufferRepresentation(buffer: any, params: any): any;
    public addRepresentation(type: any, params: any): any;

    /**
     * Automatically center and zoom the component.
     *
     * @param {(undefined | number)} [duration]
     * @memberof Component
     */
    public autoView(duration?: undefined | number): void;

    public dispose(): void;

    /**
     * Iterator over each annotation and executing the callback.
     *
     * @param {() => void} callback Function to execute.
     * @memberof Component
     */
    public eachAnnotation(callback: () => void): void;

    /**
     * Iterator over each representation and executing the callback.
     *
     * @param {() => void} callback Function to execute.
     * @memberof Component
     */
    public eachRepresentation(callback: () => void): void;

    /**
     * @param {...any[]} args
     * @returns {Box3} The component's bounding box.
     * @memberof Component
     */
    public getBox(...args: any[]): Box3;

    /**
     * @param {...any[]} args
     * @returns {Box3}
     * @memberof Component The untransformed component's bounding box.
     */
    public getBoxUntransformed(...args: any[]): Box3;

    /**
     * @param {...any[]} args
     * @returns {Vector3}
     * @memberof Component The component's center position.
     */
    public getCenter(...args: any[]): Vector3;

    public getCenterUntransformed(...args: any[]): Vector3;
    public getZoom(...args: any[]): number;
    public hasRepresentation(repr: RepresentationElement): boolean;

    /**
     * Remove all annotations from the component.
     *
     * @memberof Component
     */
    public removeAllAnnotations(): void;

    /**
     * Removes all representation components.
     *
     * @memberof Component
     */
    public removeAllRepresentations(): void;

    /**
     * Remove the give annotation from the component
     *
     * @param {Annotation} annotation The annotation to remove
     * @memberof Component
     */
    public removeAnnotation(annotation: Annotation): void;

    /**
     * Removes a representation component.
     *
     * @param {RepresentationElement} repr The representation element.
     * @memberof Component
     */
    public removeRepresentation(repr: RepresentationElement): void;
    public setName(value: string): this;

    /**
     * Set position transform.
     *
     * @example // translate by 25 angstrom along x axis.
     * component.setPosition([ 25, 0, 0 ]);
     *
     * @param {([number, number, number] | Vector3)} p The coordinates.
     * @returns {this} This Component object.
     * @memberof Component
     */
    public setPosition(p: [number, number, number] | Vector3): this;

    /**
     * Set rotation transform.
     *
     * @example // rotate by 2 degree radians on x axis.
     * component.setRotation( [ 2, 0, 0 ] );
     *
     * @param {([number, number, number] | Euler | Quaternion)} r The rotation.
     * @returns {this} This Component object.
     * @memberof Component
     */
    public setRotation(r: [number, number, number] | Euler | Quaternion): this;

    /**
     * Set scale transform.
     *
     * @example // scale by factor of two.
     * component.setScale( 2 );
     *
     * @param {number} s The scale.
     * @returns {this} This Component object.
     * @memberof Component
     */
    public setScale(s: number): this;

    public setStatus(value: string): this;

    /**
     * Set general transform. Is applied before and in addition to the position, rotation and scale transformations.
     * @example component.setTransform( matrix );
     * @param {Matrix4} m The matrix.
     * @returns {this} This component object.
     * @memberof Component
     */
    public setTransform(m: Matrix4): this;

    /**
     * Set the visibility of the component, including added representations.
     *
     * @param {boolean} value Visibility flag.
     * @returns {this} This component object.
     * @memberof Component
     */
    public setVisibility(value: boolean): this;
    public updateMatrix(): void;
    public updateRepresentations(what: any): void;
  }

  export class ComponentCollection {
    // Properties
    public list: Component[];

    constructor(list?: Component[]);

    // Accessories
    public first(): undefined | Component;

    // Methods
    public _remove(elm: Component): void;
    public addRepresentation(name: string, params: any): this;
    public autoView(duration: number): this;
    public dispose(): this;
    public forEach(fn: (x: Component) => any): this;
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

  export interface IComponentSignals {
    disposed: Signal;
    matrixChanged: Signal;
    nameChanged: Signal;
    representationAdded: Signal;
    representationRemoved: Signal;
    statusChanged: Signal;
    visibilityChanged: Signal;
  }

  export class Counter {
    // Properties
    public count: number;
    public signals: {
      countChanged: Signal;
    };

    // Methods
    public change(delta: number): void;
    public clear(): void;
    public decrement(): void;
    public dispose(): void;
    public increment(): void;
    public listen(counter: Counter): void;
    public onZeroOnce(callback: () => void, context?: any): void;
    public unlisten(counter: Counter): void;
  }

  /**
   * Enum mapping element to atomic number
   */
  // prettier-ignore
  export const enum Elements {
    H = 1, D = 1, T = 1, HE = 2, LI = 3, BE = 4, B = 5, C = 6, N = 7, O = 8, F = 9, NE = 10, NA = 11, MG = 12, AL = 13, SI = 14, P = 15, S = 16, CL = 17, AR = 18, K = 19, CA = 20, SC = 21, TI = 22, V = 23, CR = 24, MN = 25, FE = 26, CO = 27, NI = 28, CU = 29, ZN = 30, GA = 31, GE = 32, AS = 33, SE = 34, BR = 35, KR = 36, RB = 37, SR = 38, Y = 39, ZR = 40, NB = 41, MO = 42, TC = 43, RU = 44, RH = 45, PD = 46, AG = 47, CD = 48, IN = 49, SN = 50, SB = 51, TE = 52, I = 53, XE = 54, CS = 55, BA = 56, LA = 57, CE = 58, PR = 59, ND = 60, PM = 61, SM = 62, EU = 63, GD = 64, TB = 65, DY = 66, HO = 67, ER = 68, TM = 69, YB = 70, LU = 71, HF = 72, TA = 73, W = 74, RE = 75, OS = 76, IR = 77, PT = 78, AU = 79, HG = 80, TL = 81, PB = 82, BI = 83, PO = 84, AT = 85, RN = 86, FR = 87, RA = 88, AC = 89, TH = 90, PA = 91, U = 92, NP = 93, PU = 94, AM = 95, CM = 96, BK = 97, CF = 98, ES = 99, FM = 100, MD = 101, NO = 102, LR = 103, RF = 104, DB = 105, SG = 106, BH = 107, HS = 108, MT = 109, DS = 110, RG = 111, CN = 112, NH = 113, FL = 114, MC = 115, LV = 116, TS = 117, OG = 118
  }

  export class Entity {}

  export interface IImageParameters {
    antialias: boolean;
    factor: number;
    onProgress: undefined | (() => void);
    transparent: boolean;
    trim: boolean;
  }
  export type KeyActionCallback = (stage: Stage) => void;

  export class KeyBehavior {
    // Properties
    public controls: KeyControls;
    public domElement: HTMLCanvasElement;
    public stage: Stage;
    public viewer: Viewer;

    constructor(stage: Stage);

    // Methods
    public _focusDomElement(): void;
    public _onKeydown(): void;
    public _onKeypress(event: KeyboardEvent): void;
    public _onKeyup(): void;
    public dispose(): void;
  }

  type KeyActionPreset = Array<[string, KeyActionCallback]>;
  export type KeyControlPreset = 'default';

  export interface IKeyControlsParams {
    preset?: KeyActionPreset;
    disabled?: boolean;
  }

  interface IKeyAction {
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

  export interface ILoaderParameters {
    /** File extension, determines file type. */
    ext?: string;

    /** Flag data as compressed. */
    compressed?: string | boolean;

    /** Flag data as binary. */
    binary?: boolean;

    /** Set data name. */
    name?: string;

    dir?: string;
    path?: string;
    protocol?: string;
  }

  export const enum MeasurementFlags {
    Distance = 0x1,
    Angle = 0x2,
    Dihedral = 0x4,
  }

  export class MouseBehavior {
    // Properties
    public controls: MouseControls;
    public domElement: HTMLCanvasElement;
    public mouse: MouseObserver;
    public stage: Stage;
    public viewer: Viewer;

    constructor(stage: Stage);

    // Methods
    public _onClick(x: number, y: number): void;
    public _onDblclick(x: number, y: number): void;
    public _onDrag(dx: number, dy: number): void;
    public _onHover(x: number, y: number): void;
    public _onMove(): void;
    public _onScroll(delta: number): void;
    public dispose(): void;
  }

  export type ScrollCallback = (stage: Stage, delta: number) => void;
  export type DragCallback = (stage: Stage, dx: number, dy: number) => void;
  export type PickCallback = (stage: Stage, pickingProxy: PickingProxy) => void;

  export type MouseActionCallback = ScrollCallback | DragCallback | PickCallback;
  type MouseActionPreset = Array<[string, MouseActionCallback]>;

  export type MouseActionType = '' | 'scroll' | 'drag' | 'click' | 'doubleClick' | 'hover' | 'clickPick' | 'hoverPick';
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

  export interface IMouseParams {
    hoverTimeout?: number;
    handleScroll?: boolean;
    doubleClickSpeed?: number;
  }

  export class MouseObserver {
    // Properties
    public altKey: boolean;
    public buttons: undefined | number;
    public canvasPosition: Vector2;
    public controls: MouseControls;
    public ctrlKey: boolean;
    public domElement: HTMLCanvasElement;
    public doubleClickPending: boolean;
    public doubleClickSpeed: number;
    public down: Vector2;
    public handleScroll: boolean;
    public hoverTimeout: number;
    public hovering: boolean;
    public lastClicked: number;
    public lastMoved: number;
    public lastTouchDistance: number;
    public metaKey: boolean;
    public mouse: MouseObserver;
    public moving: boolean;
    public overElement: boolean;
    public position: Vector2;
    public pressed?: boolean;
    public prevClickCP: Vector2;
    public prevPosition: Vector2;
    public scrolled: boolean;
    public shiftKey: boolean;
    public signals: {
      clicked: Signal;
      doubleClicked: Signal;
      dragged: Signal;
      dropped: Signal;
      hovered: Signal;
      moved: Signal;
      scrolled: Signal;
    };
    public viewer: Viewer;
    public which?: number;

    constructor(domElement: HTMLCanvasElement, params?: IMouseParams);

    // Accessors
    public key(): number;

    // Methods
    public _distance(): number;
    public _listen(): void;
    public _onContextmenu(event: MouseEvent): void;
    public _onMousedown(event: MouseEvent): void;
    public _onMousemove(event: MouseEvent): void;
    public _onMouseup(event: MouseEvent): void;
    public _onMousewheel(event: MouseWheelEvent): void;
    public _onTouchend(event: TouchEvent): void;
    public _onTouchmove(event: TouchEvent): void;
    public _onTouchstart(event: TouchEvent): void;
    public _setCanvasPosition(event: any): void;
    public _setKeys(event: MouseEvent | TouchEvent): void;
    public dispose(): void;
    public setParameters(params?: IMouseParams): void;
  }

  export type NumberArray = number[] | TypedArray;

  export class OrthographicCamera {}

  export class PerspectiveCamera {}

  export class PickingBehavior {
    // Properties
    public controls: MouseControls;
    public mouse: MouseObserver;
    public stage: Stage;
    public viewer: Viewer;

    constructor(stage: Stage);

    // Methods
    public _onClick(x: number, y: number): void;
    public _onHover(x: number, y: number): void;
    public dispose(): void;
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

  export type RenderQualityType = 'auto' | 'low' | 'medium' | 'high';

  export class Representation {
    constructor(object: any, viewer: any, params: any);

    // Methods
    public attach(callback: any): void;
    public build(updateWhat: any): void;
    public clear(): void;
    public create(): void;
    public dispose(): void;
    public getBufferParams(p: any): any;
    public getColorParams(p: any): any;
    public getParameters(): {
      lazy: any;
      quality: any;
      visible: any;
    };
    public init(params: any): void;
    public make(updateWhat: any, callback: any): void;
    public setColor(value: any, p: any): this;
    public setParameters(params: object, what?: object, rebuild?: boolean): Representation;
    public setVisibility(value: boolean, noRenderRequest: boolean): Representation;
    public update(): void;
    public updateParameters(bufferParams: object, what: any): void;
  }

  export class RepresentationCollection {}

  export interface IRepresentationElementParameters {
    name: string;
    status: string;
    visible: boolean;
  }

  export interface IRepresentationElementSignals {
    disposed: Signal;
    nameChanged: Signal;
    parametersChanged: Signal;
    statusChanged: Signal;
    visibilityChanged: Signal;
  }

  export class RepresentationElement extends Element {
    // Properties
    public parameters: IRepresentationElementParameters;
    public parent: Component;
    public repr: Representation;
    public signals: IRepresentationElementSignals;
    public stage: Stage;
    public uuid: string;

    constructor(
      stage: Stage,
      repr: Representation,
      params: Partial<IRepresentationElementParameters>,
      parent: Component,
    );

    public _disposeRepresentation(): void;
    public build(params?: any): this;
    public defaultParameters(): IRepresentationElementParameters;
    public dispose(): void;
    public getParameters(): {
      lazy: any;
      quality: any;
      visible: any;
    };
    public getType(): string;
    public getVisibility(): boolean;
    public name(): string;
    public setColor(value: string | number | Color): this;
    public setName(value: string): this;
    public setParameters(params: any): this;
    public setRepresentation(repr: Representation): void;
    public setSelection(selection: string): this;
    public setStatus(value: string): this;
    public setVisibility(value: boolean): this;
    public toggleVisibility(): this;
    public update(what: any): this;
    public updateVisibility(): void;
    public type(): string;
    public visible(): boolean;
  }

  export class ResidueMap {}

  export class ResidueProxy {}

  export class ResidueStore {}

  export class ResidueType {}

  export interface IShapeParameters {
    aspectRatio: number;
    sphereDetail: number;
    radialSegments: number;
    disableImpostor: boolean;
    openEnded: boolean;
    dashedCylinder: boolean;
    labelParams: Partial<
      {
        fontFamily: 'sans-serif' | 'monospace' | 'serif';
        fontStyle: 'normal' | 'italic';
        fontWeight: 'normal' | 'bold';
        fontSize: number;
        xOffset: number;
        yOffset: number;
        zOffset: number;
        attachment:
          | 'bottom-left'
          | 'bottom-center'
          | 'bottom-right'
          | 'middle-left'
          | 'middle-center'
          | 'middle-right'
          | 'top-left'
          | 'top-center'
          | 'top-right';
        showBorder: boolean;
        borderColor: string | number;
        borderWidth: number;
        showBackground: boolean;
        backgroundColor: string | number;
        backgroundMargin: number;
        backgroundOpacity: number;
        forceTransparent: boolean;
        fixedSize: boolean;
      } & {
        opaqueBack: boolean;
        side: 'double' | 'front' | 'back';
        opacity: number;
        depthWrite: boolean;
        clipNear: number;
        clipRadius: number;
        clipCenter: any;
        flatShaded: boolean;
        wireframe: boolean;
        roughness: number;
        metalness: number;
        diffuse: number;
        diffuseInterior: boolean;
        useInteriorColor: boolean;
        interiorColor: number;
        interiorDarkening: number;
        forceTransparent: boolean;
        matrix: any;
        disablePicking: boolean;
        sortParticles: boolean;
        background: boolean;
      }
    >;
    pointSize: number;
    sizeAttenuation: boolean;
    useTexture: boolean;
    lineWidth: number;
  }

  export interface IRingBuffer<T> {
    clear: () => void;
    count: number;
    data: T[];
    get: (index: number) => T;
    has: (value: T) => boolean;
    push: (value: T) => void;
  }

  export class ScriptComponent {}

  export class Shape {
    constructor(name?: string, params?: Partial<IShapeParameters>);
  }

  interface IStageParameters {
    ambientColor: string | number;
    ambientIntensity: number;
    backgroundColor: string | number;
    cameraFov: number;
    cameraType: CameraType;
    clipDist: number;
    clipFar: number;
    clipNear: number;
    fogFar: number;
    fogNear: number;
    hoverTimeout: number;
    impostor: boolean;
    lightColor: string | number;
    lightIntensity: number;
    mousePreset: MouseControlPreset;
    panSpeed: number;
    quality: 'high' | 'medium' | 'low' | 'auto';
    rotateSpeed: number;
    sampleLevel: number;
    tooltip: boolean;
    workerDefault: boolean;
    zoomSpeed: number;
  }

  export class ShapePrimitive {}

  export interface ISimpleDict<K, V> {
    add: (k: K, v: V) => void;
    del: (k: K) => void;
    has: (k: K) => boolean;
    values: V[];
  }

  /** Stage class, central for creating molecular scenes with NGL. */
  export class Stage {
    // Properties
    public animationBehavior: AnimationBehavior;
    public animationControls: AnimationControls;
    public compList: Component[];
    public defaultFileParams: object;
    public keyBehavior: KeyBehavior;
    public keyControls: KeyControls;
    public lastFullscreenElement: HTMLElement;
    public logList: string[];
    public mouseBehavior: MouseBehavior;
    public mouseControls: MouseControls;
    public mouseObserver: MouseObserver;
    public parameters: IStageParameters;
    public pickingBehavior: PickingBehavior;
    public rockAnimation: Animation;
    public signals: {
      clicked: Signal;
      componentAdded: Signal;
      componentRemoved: Signal;
      fullscreenChanged: Signal;
      hovered: Signal;
      parametersChanged: Signal;
    };
    public spinAnimation: Animation;

    /** Counter that keeps track of various potentially long-running tasks, including file loading and surface calculation. */
    public tasks: Counter;
    public tooltip: HTMLElement;
    public trackballControls: TrackballControls;
    public transformAtom: AtomProxy;
    public transformComponent: Component;
    public viewer: Viewer;
    public viewerControls: ViewerControls;

    /**
     * Creates an instance of Stage.
     * @param {(string | HTMLElement)} idOrElement DOM ID or Element.
     * @param {Partial<IStageParameters>} [params]
     * @memberof Stage
     */
    constructor(idOrElement: string | HTMLElement, params?: Partial<IStageParameters>);

    // Properties
    /**
     * Add the given component to the stage.
     *
     * @param {Component} component The component to add.
     * @memberof Stage
     */
    public addComponent(component: Component): void;

    /**
     * Create a component from the given object and add to the stage.
     *
     * @param {(Structure | Surface | Volume | Shape)} object
     * @param {Partial<IComponentParameters>} [params]
     * @returns {*}
     * @memberof Stage
     */
    public addComponentFromObject(
      object: Structure | Surface | Volume | Shape,
      params?: Partial<IComponentParameters>,
    ): any;

    /**
     * Add a zoom and a move animation with automatic targets.
     *
     * @param {(undefined | number)} [duration] Animation time in milliseconds
     * @memberof Stage
     */
    public autoView(duration?: undefined | number): void;

    /**
     * Create default representations for the given component.
     *
     * @param {Component} component
     * @memberof Stage
     */
    public defaultFileRepresentation(component: Component): void;

    /**
     * Cleanup when disposing of a stage object.
     *
     * @memberof Stage
     */
    public dispose(): void;

    /**
     * Iterator over each component and executing the callback.
     *
     * @param {() => void} callback
     * @param {(undefined | string)} [type]
     * @memberof Stage
     */
    public eachComponent(callback: () => void, type?: undefined | string): void;

    /**
     * Iterator over each representation and executing the callback.
     *
     * @param {() => void} callback
     * @param {(undefined | string)} [type]
     * @memberof Stage
     */
    public eachRepresentation(callback: () => void, type?: undefined | string): void;
    public getBox(): Box3;
    public getCenter(optionalTarget?: Vector3): Vector3;

    /**
     * Get collection of components by name.
     *
     * @param {(string | RegExp)} name
     * @returns {ComponentCollection}
     * @memberof Stage
     */
    public getComponentsByName(name: string | RegExp): ComponentCollection;

    /**
     * Get collection of components by object.
     *
     * @param {(Structure | Surface | Volume | Shape)} object
     * @returns {ComponentCollection}
     * @memberof Stage
     */
    public getComponentsByObject(object: Structure | Surface | Volume | Shape): ComponentCollection;

    /**
     * Get stage parameters.
     *
     * @returns {({
     *       ambientColor: string | number;
     *       ambientIntensity: number;
     *       backgroundColor: string | number;
     *       cameraFov: number;
     *       cameraType: CameraType;
     *       clipDist: number;
     *       clipFar: number;
     *       clipNear: number;
     *       fogFar: number;
     *       fogNear: number;
     *       hoverTimeout: number;
     *       impostor: boolean;
     *       lightColor: string | number;
     *       lightIntensity: number;
     *       mousePreset: 'default' | 'pymol' | 'coot' | 'astexviewer';
     *       panSpeed: number;
     *       quality: 'high' | 'medium' | 'low' | 'auto';
     *       rotateSpeed: number;
     *       sampleLevel: number;
     *       tooltip: boolean;
     *       workerDefault: boolean;
     *       zoomSpeed: number;
     *     })}
     * @memberof Stage
     */
    public getParameters(): {
      ambientColor: string | number;
      ambientIntensity: number;
      backgroundColor: string | number;
      cameraFov: number;
      cameraType: CameraType;
      clipDist: number;
      clipFar: number;
      clipNear: number;
      fogFar: number;
      fogNear: number;
      hoverTimeout: number;
      impostor: boolean;
      lightColor: string | number;
      lightIntensity: number;
      mousePreset: 'default' | 'pymol' | 'coot' | 'astexviewer';
      panSpeed: number;
      quality: 'high' | 'medium' | 'low' | 'auto';
      rotateSpeed: number;
      sampleLevel: number;
      tooltip: boolean;
      workerDefault: boolean;
      zoomSpeed: number;
    };

    /**
     * Get collection of representations by name.
     *
     * @param {(string | RegExp)} name
     * @returns {RepresentationCollection}
     * @memberof Stage
     */
    public getRepresentationsByName(name: string | RegExp): RepresentationCollection;
    public getZoom(): number;
    public getZoomForBox(boundingBox: Box3): number;

    /**
     * Handle any size-changes of the container element
     *
     * @memberof Stage
     */
    public handleResize(): void;

    /**
     * Load a file onto the stage
     *
     * @example // load from URL
     * stage.loadFile( "http://files.rcsb.org/download/5IOS.cif" );
     *
     * // load binary data in CCP4 format via a Blob
     * var binaryBlob = new Blob( [ ccp4Data ], { type: 'application/octet-binary'} ); stage.loadFile( binaryBlob, { ext: "ccp4" } );
     *
     * // load string data in PDB format via a Blob
     * var stringBlob = new Blob( [ pdbData ], { type: 'text/plain'} ); stage.loadFile( stringBlob, { ext: "pdb" } );
     *
     * // load a File object
     * stage.loadFile( file );
     *
     * // load from URL and add a 'ball+stick' representation with double/triple bonds
     * stage.loadFile( "http://files.rcsb.org/download/1crn.cif" ).then( function( comp ){ comp.addRepresentation( "ball+stick", { multipleBond: true } ); } );
     *
     * @param {(string | File | Blob)} path Either a URL or an object containing the file data.
     * @param {Partial<IStageLoadFileParams>} [params] Loading parameters.
     * @returns {(Promise<StructureComponent | SurfaceComponent | ScriptComponent>)} A Promise object that resolves to a StructureComponent, a SurfaceComponent or a ScriptComponent object, depending on the type of the loaded file.
     * @memberof Stage
     */
    public loadFile(
      path: string | File | Blob,
      params?: Partial<IStageLoadFileParams>,
    ): Promise<StructureComponent | SurfaceComponent | ScriptComponent>;
    public loadScript(path: string | File | Blob): any;
    public log(msg: string): void;

    /**
     * Make image from what is shown in a viewer canvas.
     *
     * @param {Partial<IImageParameters>} [params]
     * @returns {Promise<Blob>}
     * @memberof Stage
     */
    public makeImage(params?: Partial<IImageParameters>): Promise<Blob>;
    public measureClear(): void;
    public measureUpdate(): void;

    /**
     * Remove all components from the stage.
     *
     * @memberof Stage
     */
    public removeAllComponents(): void;

    /**
     * Remove the given component.
     *
     * @param {Component} component The component to remove.
     * @memberof Stage
     */
    public removeComponent(component: Component): void;
    public setFocus(value: number): void;
    public setImpostor(value: boolean): void;

    /**
     * Set stage parameters.
     *
     * @param {Partial<IStageParameters>} [params]
     * @returns {this}
     * @memberof Stage
     */
    public setParameters(params?: Partial<IStageParameters>): this;
    public setQuality(value: RenderQualityType): void;

    /**
     * Set rock.
     *
     * @param {boolean} flag If true start rocking and stop spinning.
     * @memberof Stage
     */
    public setRock(flag: boolean): void;

    /**
     * Set width and height.
     *
     * @param {string} width CSS width value.
     * @param {string} height CSS height value.
     * @memberof Stage
     */
    public setSize(width: string, height: string): void;

    /**
     * Set spin.
     *
     * @param {boolean} flag If true start rocking and stop spinning.
     * @memberof Stage
     */
    public setSpin(flag: boolean): void;

    /**
     * Toggle fullscreen.
     *
     * @param {HTMLElement} element
     * @memberof Stage
     */
    public toggleFullscreen(element: HTMLElement): void;

    /**
     * Toggle rock.
     *
     * @memberof Stage
     */
    public toggleRock(): void;

    /**
     * Toggle spin.
     *
     * @memberof Stage
     */
    public toggleSpin(): void;
  }

  export class Stats {
    // Properties
    public avgDuration: number;
    public count: number;
    public currentTime: number;
    public frames: number;
    public lastDuration: number;
    public lastFps: number;
    public lastFrames: number;
    public maxDuration: number;
    public minDuration: number;
    public prevFpsTime: number;
    public signals: {
      updated: Signal;
    };
    public startTime: number;

    constructor();

    public begin(): void;
    public end(): number;
    public update(): void;
  }

  export interface IStageLoadFileParams extends ILoaderParameters {
    defaultRepresentation: boolean;
  }

  export class Structure {}

  export interface IStructureComponentParameters {
    sele: string;
    defaultAssembly: string;
    name: string;
    status: string;
    visible: boolean;
  }

  /**
   * Component wrapping a Structure object.
   *
   * @example // Get a structure component by loading a structure file into the stage.
   * stage.loadFile("rcsb://4opj").then(function(structureComponent){
   *   structureComponent.addRepresentation("cartoon");
   *   structureComponent.autoView();
   * });
   *
   * @export
   * @class StructureComponent
   * @extends {Component}
   */
  export class StructureComponent extends Component {
    // Properties
    public angleRepresentation: RepresentationElement;
    public dihedralRepresentation: RepresentationElement;
    public distanceRepresentation: RepresentationElement;
    public lastPick: undefined | number;
    public measureRepresentations: RepresentationCollection;
    public parameters: IStructureComponentParameters;
    public pickBuffer: IRingBuffer<number>;
    public pickDict: ISimpleDict<number[], number[]>;
    public selection: Selection;
    public signals: IStructureComponentSignals;
    public spacefillRepresentation: RepresentationElement;
    public structure: Structure;
    public structureView: StructureView;
    public trajList: TrajectoryElement[];

    constructor(stage: Stage, structure: Structure, params?: Partial<IStructureComponentParameters>);

    // Methods
    /**
     * Add a measurement given as a pair, triple, quad of atom indices.
     *
     * @param {number[]} atomList
     * @memberof StructureComponent
     */
    public addMeasurement(atomList: number[]): void;
    public addRepresentation(
      type: StructureRepresentationType,
      params?: object,
      hidden?: boolean,
    ): RepresentationElement;

    /**
     * Add a new trajectory component to the structure.
     *
     * @param {string} [trajPath]
     * @param {object} [params]
     * @returns {TrajectoryElement}
     * @memberof StructureComponent
     */
    public addTrajectory(trajPath?: string, params?: object): TrajectoryElement;

    /**
     * Automatically center and zoom the component
     *
     * @param {(undefined | number)} [duration]
     * @returns {*}
     * @memberof StructureComponent
     */
    public autoView(duration?: undefined | number): any;
    public dispose(): void;
    public getBoxUntransformed(sele: string): Box3;
    public getCenterUntransformed(sele: string): Vector3;
    public getMaxRepresentationRadius(atomIndex: number): number;
    public measureBuild(): void;
    public measureClear(): void;
    public measureData(): {
      angle: number[][];
      dihedral: number[][];
      distance: number[][];
    };
    public measurePick(atom: AtomProxy): void;
    public measureUpdate(): void;
    public rebuildRepresentations(): void;
    public rebuildTrajectories(): void;

    /**
     * Remove all measurements, optionally limit to distance, angle or dihedral.
     *
     * @param {MeasurementFlags} [type]
     * @memberof StructureComponent
     */
    public removeAllMeasurements(type?: MeasurementFlags): void;

    /**
     * Remove a measurement given as a pair, triple, quad of atom indices.
     *
     * @param {number[]} atomList
     * @memberof StructureComponent
     */
    public removeMeasurement(atomList: number[]): void;
    public removeTrajectory(traj: TrajectoryElement): void;

    /**
     * Set the default assembly.
     *
     * @param {string} value Assembly name.
     * @returns {this}
     * @memberof StructureComponent
     */
    public setDefaultAssembly(value: string): this;

    /**
     * Set selection of structureView.
     *
     * @param {string} sel Selection string.
     * @returns {this}
     * @memberof StructureComponent This StructureComponent object.
     */
    public setSelection(sel: string): this;
    public superpose(component: StructureComponent, align: boolean, sele1: string, sele2: string): this;
    public updateRepresentations(what: any): void;
  }

  export interface IStructureComponentSignals extends IComponentSignals {
    refreshed: Signal;
  }

  export type StructureRepresentationType =
    | 'angle'
    | 'axes'
    | 'backbone'
    | 'ball+stick'
    | 'base'
    | 'cartoon'
    | 'contact'
    | 'dihedral'
    | 'distance'
    | 'helixorient'
    | 'hyperball'
    | 'label'
    | 'licorice'
    | 'line'
    | 'surface'
    | 'ribbon'
    | 'rocket'
    | 'rope'
    | 'spacefill'
    | 'trace'
    | 'tube'
    | 'unitcell';

  export class StructureView {}

  export class Surface {}

  export class SurfaceComponent {}

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

  export type TypedArray =
    | Uint8Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint16Array
    | Uint32Array
    | Float32Array
    | Uint8ClampedArray
    | Float64Array;

  export class TrajectoryElement extends Element {}

  export class Unitcell {}

  /**
   * Viewer class.
   *
   * @export
   * @class Viewer
   */
  export class Viewer {
    // Properties
    public boundingBox: Box3;
    public camera: OrthographicCamera | PerspectiveCamera;
    public container: HTMLElement;
    public height: number;
    public perspectiveCamera: PerspectiveCamera;
    public renderer: WebGLRenderer;
    public rotationGroup: Group;
    public sampleLevel: number;
    public scene: Scene;
    public signals: ViewerSignals;
    public stats: Stats;
    public width: number;
    public wrapper: HTMLElement;

    /**
     * Creates an instance of Viewer.
     * @param {(string | HTMLElement)} idOrElement DOM ID or Element.
     * @memberof Viewer
     */
    constructor(idOrElement: string | HTMLElement);

    // Methods
    public add(buffer: Buffer, instanceList: IBufferInstance[]): void;
    public addBuffer(buffer: Buffer, instance?: IBufferInstance): void;
    public animate(): void;
    public clear(): void;
    public getImage(picking: boolean): Promise<object>;
    public getPickingPixels(): Uint8Array | Float32Array;
    public handleResize(): void;
    public makeImage(params?: Partial<IImageParameters>): Promise<Blob>;
    public pick(
      x: number,
      y: number,
    ): {
      instance: any;
      picker: any;
      pid: number;
    };
    public remove(buffer: Buffer): void;
    public render(picking?: boolean): void;
    public requestRender(): void;
    public setBackground(color?: Color | number | string): void;
    public setCamera(type: CameraType, fov?: undefined | number): void;
    public setClip(near: number, far: number, dist: number): void;
    public setFog(color?: Color | number | string, near?: undefined | number, far?: undefined | number): void;
    public setLight(
      color: Color | number | string,
      intensity: number,
      ambientColor: Color | number | string,
      ambientIntensity: number,
    ): void;
    public setSampling(level: number): void;
    public setSize(width: number, height: number): void;
    public updateBoundingBox(): void;
    public updateHelper(): void;
    public updateInfo(reset?: undefined | true | false): void;
    public updateZoom(): void;
  }

  export class ViewerControls {
    constructor(stage: Stage);
  }

  export class ViewerSignals {}

  export class Volume {}
}
