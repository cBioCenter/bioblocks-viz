// Type definitions for [ngl] [https://github.com/arose/ngl]
// Project: [chell-viz-contact]
// Definitions by: [BCB @ DF-CI, Drew Diamantoukos] <[http://bcb.dfci.harvard.edu/]>
// Transcribed from ngl documentation.

// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import { Box3, Color, Euler, Matrix4, Quaternion, Vector2, Vector3 } from 'three';

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

  export class AtomProxy {}

  export class BondProxy {}

  export interface IComponentParameters {
    name: string;
    status: string;
    visible: boolean;
  }

  export class Component {
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

    constructor(stage: Stage, object: any, params?: Partial<IComponentParameters>);

    // Accessors
    public defaultParameters(): IComponentParameters;
    public name(): string;
    public status(): string;
    public type(): string;
    public visible(): boolean;

    // Methods
    public addAnnotation(position: Vector3, content: string | HTMLElement, params: IAnnotationParams): Annotation;
    public addBufferRepresentation(buffer: any, params: any): any;
    public addRepresentation(type: any, params: any): any;
    public autoView(duration?: undefined | number): void;
    public dispose(): void;
    public eachAnnotation(callback: () => void): void;
    public eachRepresentation(callback: () => void): void;
    public getBox(...args: any[]): Box3;
    public getBoxUntransformed(...args: any[]): Box3;
    public getCenter(...args: any[]): Vector3;
    public getCenterUntransformed(...args: any[]): Vector3;
    public getZoom(...args: any[]): number;
    public hasRepresentation(repr: RepresentationElement): boolean;
    public removeAllAnnotations(): void;
    public removeAllRepresentations(): void;
    public removeAnnotation(annotation: Annotation): void;
    public removeRepresentation(repr: RepresentationElement): void;
    public setName(value: string): this;
    public setPosition(p: [number, number, number] | Vector3): this;
    public setRotation(r: [number, number, number] | Euler | Quaternion): this;
    public setScale(s: number): this;
    public setStatus(value: string): this;
    public setTransform(m: Matrix4): this;
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
    ext: string; // file extension, determines file type
    compressed: string | boolean; // flag data as compressed
    binary: boolean; // flag data as binary
    name: string; // set data name
    dir: string;
    path: string;
    protocol: string;
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

  type ScrollCallback = (stage: Stage, delta: number) => void;
  type DragCallback = (stage: Stage, dx: number, dy: number) => void;
  type PickCallback = (stage: Stage, pickingProxy: PickingProxy) => void;

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
    // Properties
    public controls: ViewerControls;
    public instance: IInstanceData;
    public mouse: MouseObserver;
    public picker: IPicker;
    public pid: number;
    public stage: Stage;

    constructor(pickingData: IPickingData, stage: Stage);

    // Accessors
    public altKey(): boolean;
    public arrow(): ShapePrimitive;
    public atom(): AtomProxy;
    public axes(): any;
    public bond(): BondProxy;
    public box(): ShapePrimitive;
    public canvasPosition(): Vector2;
    public clash(): {
      sele1: string;
      sele2: string;
    };
    public closeAtom(): undefined | AtomProxy;
    public closestBondAtom(): undefined | AtomProxy;
    public component(): Component;
    public cone(): ShapePrimitive;
    public contact(): object;
    public ctrlKey(): boolean;
    public cylinder(): ShapePrimitive;
    public distance(): BondProxy;
    public ellipsoid(): ShapePrimitive;
    public mesh(): {
      name: string;
      serial: number;
      shape: Shape;
    };
    public metaKey(): boolean;
    public object(): any;
    public octahedron(): ShapePrimitive;
    public point(): ShapePrimitive;
    public position(): Vector3;
    public shiftKey(): boolean;
    public slice(): object;
    public sphere(): ShapePrimitive;
    public surface(): object;
    public tetrahedron(): ShapePrimitive;
    public torus(): ShapePrimitive;
    public type(): string;
    public unitcell(): {
      structure: Structure;
      unitcell: Unitcell;
    };
    public unknown(): any;
    public volume(): {
      value: number;
      volume: Volume;
    };
    public wideline(): ShapePrimitive;

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

  export class RepresentationElement {
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

  export class Shape {
    constructor(name?: string, params?: Partial<IShapeParameters>);
  }

  interface IStageParameters {
    ambientColor: string | number;
    ambientIntensity: number;
    backgroundColor: string | number;
    cameraFov: number;
    cameraType: 'perspective' | 'orthographic' | 'stereo';
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
    public tasks: Counter;
    public tooltip: HTMLElement;
    public trackballControls: TrackballControls;
    public transformAtom: AtomProxy;
    public transformComponent: Component;
    public viewer: Viewer;
    public viewerControls: ViewerControls;

    constructor(idOrElement: string | HTMLElement, params?: Partial<IStageParameters>);

    // Properties
    public addComponent(component: Component): void;
    public addComponentFromObject(
      object: Structure | Surface | Volume | Shape,
      params?: Partial<IComponentParameters>,
    ): any;
    public autoView(duration?: undefined | number): void;
    public defaultFileRepresentation(component: Component): void;
    public dispose(): void;
    public eachComponent(callback: () => void, type?: undefined | string): void;
    public eachRepresentation(callback: () => void, type?: undefined | string): void;
    public getBox(): Box3;
    public getCenter(optionalTarget?: Vector3): Vector3;
    public getComponentsByName(name: string | RegExp): ComponentCollection;
    public getComponentsByObject(object: Structure | Surface | Volume | Shape): ComponentCollection;
    public getParameters(): {
      ambientColor: string | number;
      ambientIntensity: number;
      backgroundColor: string | number;
      cameraFov: number;
      cameraType: 'perspective' | 'orthographic' | 'stereo';
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
    public getRepresentationsByName(name: string | RegExp): RepresentationCollection;
    public getZoom(): number;
    public getZoomForBox(boundingBox: Box3): number;
    public handleResize(): void;
    public loadFile(path: string | File | Blob, params?: Partial<IStageLoadFileParams>): any;
    public loadScript(path: string | File | Blob): any;
    public log(msg: string): void;
    public makeImage(params?: Partial<IImageParameters>): Promise<Blob>;
    public measureClear(): void;
    public measureUpdate(): void;
    public removeAllComponents(): void;
    public removeComponent(component: Component): void;
    public setFocus(value: number): void;
    public setImpostor(value: boolean): void;
    public setParameters(params?: Partial<IStageParameters>): this;
    public setQuality(value: RenderQualityType): void;
    public setRock(flag: boolean): void;
    public setSize(width: string, height: string): void;
    public setSpin(flag: boolean): void;
    public toggleFullscreen(element: HTMLElement): void;
    public toggleRock(): void;
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

  export class Surface {}

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

  export class Unitcell {}

  export class Viewer {
    constructor(idOrElement: string | HTMLElement);
  }

  export class ViewerControls {
    constructor(stage: Stage);
  }

  export class Volume {}
}
