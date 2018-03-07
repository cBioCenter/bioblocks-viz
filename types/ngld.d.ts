// Type definitions for [ngl] [https://github.com/arose/ngl]
// Project: [chell-viz-contact]
// Definitions by: [BCB @ DF-CI, Drew Diamantoukos] <[http://bcb.dfci.harvard.edu/]>
// Transcribed from ngl documentation.

// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import { Box3, Color, Euler, Matrix4, Quaternion, Vector3 } from 'three';

  export class Animation {
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
    public animationControls: AnimationControls;
    public stage: Stage;
    public viewer: Viewer;

    constructor(stage: Stage);
  }

  export class AnimationControls {
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

  export interface IComponentParameters {
    name: string;
    status: string;
    visible: boolean;
  }

  export class Component {
    // Fields
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

  export class ComponentControls {
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

  export class Representation {
    constructor(object: any, viewer: any, params: any);

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
    mousePreset: 'default' | 'pymol' | 'coot' | 'astexviewer';
    panSpeed: number;
    quality: 'high' | 'medium' | 'low' | 'auto';
    rotateSpeed: number;
    sampleLevel: number;
    tooltip: boolean;
    workerDefault: boolean;
    zoomSpeed: number;
  }

  export class Stage {
    public animationBehavior: AnimationBehavior;
    public animationControls: AnimationControls;
    public compList: Component[];
    public defaultFileParams: object;
    // public keyBehavior: KeyBehavior;
    // public keyControls: KeyControls;
    public lastFullscreenElement: HTMLElement;
    public logList: string[];
    // public mouseBehavior: MouseBehavior;
    // public mouseControls: MouseControls;
    // public mouseObserver: MouseObserver;
    public parameters: IStageParameters;
    // public pickingBehavior: PickingBehavior;
    // public pickingControls: PickingControls;
    public rockAnimation: Animation;
    public spinAnimation: Animation;
    // public tasks: Counter;
    public tooltip: HTMLElement;
    // public trackballControls: TrackballControls;
    // public transformAtom: AtomProxy;
    public transformComponent: Component;
    public viewer: Viewer;
    public viewerControls: ViewerControls;

    constructor(idOrElement: string | HTMLElement, params?: Partial<IStageParameters>);

    public addComponent(component: any): undefined;
    public addComponentFromObject(object: any, params?: any): any;
    public autoView(duration: number): undefined;
    public defaultFileRepresentation(object: any): undefined;
    public dispose(): undefined;
    public eachComponent(callback: () => void, type: string): undefined;
    public eachRepresentation(callback: () => void, type: string): undefined;
    public getAnythingByName(name: string | RegExp): any[];
    public getComponentsByName(name: string | RegExp, type: string): any[];
    public getComponentsByObject(object: object): any[];
    public getParameters(): IStageParameters;
    public getRepresentationsByName(name: string | RegExp, type: string): any[];
    public handleResize(): undefined;
    public loadFile(path: string | File | Blob, params?: any): Promise<any>;
    public makeImage(params: any): Promise<any>;
    public removeAllComponents(type: string): undefined;
    public removeComponent(component: any): undefined;
    public setParameters(params: IStageParameters): Stage;
    public setRock(flag: boolean): undefined;
    public setSize(width: string, height: string): undefined;
    public setSpin(flag: boolean): undefined;
    public toggleFullscreen(element: Element): undefined;
    public toggleRock(): undefined;
    public toggleSpin(): undefined;
  }

  export class Stats {
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

  export class Viewer {
    constructor(idOrElement: string | HTMLElement);
  }

  export class ViewerControls {
    constructor(stage: Stage);
  }
}
