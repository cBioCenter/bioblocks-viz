// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import { Box3, Vector2, Vector3 } from 'three';

  export type RenderQualityType = 'auto' | 'low' | 'medium' | 'high';

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

  export interface IMouseParams {
    hoverTimeout?: number;
    handleScroll?: boolean;
    doubleClickSpeed?: number;
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
     * @param idOrElement DOM ID or Element.
     */
    constructor(idOrElement: string | HTMLElement, params?: Partial<IStageParameters>);

    // Properties
    /**
     * Add the given component to the stage.
     *
     * @param component The component to add.
     */
    public addComponent(component: Component): void;

    /**
     * Create a component from the given object and add to the stage.
     */
    public addComponentFromObject(
      object: Structure | Surface | Volume | Shape,
      params?: Partial<IComponentParameters>,
    ): StructureComponent;

    /**
     * Add a zoom and a move animation with automatic targets.
     *
     * @param [duration] Animation time in milliseconds.
     */
    public autoView(duration?: undefined | number): void;

    /**
     * Create default representations for the given component.
     */
    public defaultFileRepresentation(component: Component): void;

    /**
     * Cleanup when disposing of a stage object.
     */
    public dispose(): void;

    /**
     * Iterator over each component and executing the callback.
     */
    // tslint:disable-next-line:no-reserved-keywords
    public eachComponent(callback: () => void, type?: undefined | string): void;

    /**
     * Iterator over each representation and executing the callback.
     */
    // tslint:disable-next-line:no-reserved-keywords
    public eachRepresentation(callback: () => void, type?: undefined | string): void;
    public getBox(): Box3;
    public getCenter(optionalTarget?: Vector3): Vector3;

    /**
     * Get collection of components by name.
     */
    public getComponentsByName(name: string | RegExp): ComponentCollection;

    /**
     * Get collection of components by object.
     */
    public getComponentsByObject(object: Structure | Surface | Volume | Shape): ComponentCollection;

    /**
     * Get stage parameters.
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
     */
    public getRepresentationsByName(name: string | RegExp): RepresentationCollection;
    public getZoom(): number;
    public getZoomForBox(boundingBox: Box3): number;

    /**
     * Handle any size-changes of the container element.
     */
    public handleResize(): void;

    /**
     * Load a file onto the stage.
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
     * stage.loadFile( "http://files.rcsb.org/download/1crn.cif" )\
     *   .then( function( comp ){ comp.addRepresentation( "ball+stick", { multipleBond: true } ); } );
     *
     * @param path Either a URL or an object containing the file data.
     * @param [params] Loading parameters.
     * @returns A Promise object that resolves to a\
     *  StructureComponent, a SurfaceComponent or a ScriptComponent object, depending on the type of the loaded file.
     */
    public loadFile(
      path: string | File | Blob,
      params?: Partial<IStageLoadFileParams>,
    ): Promise<StructureComponent | SurfaceComponent>;
    public loadScript(path: string | File | Blob): any;
    public log(msg: string): void;

    /**
     * Make image from what is shown in a viewer canvas.
     */
    public makeImage(params?: Partial<IImageParameters>): Promise<Blob>;
    public measureClear(): void;
    public measureUpdate(): void;

    /**
     * Remove all components from the stage.
     */
    public removeAllComponents(): void;

    /**
     * Remove the given component.
     *
     * @param component The component to remove.
     */
    public removeComponent(component: Component): void;
    public setFocus(value: number): void;
    public setImpostor(value: boolean): void;

    /**
     * Set stage parameters.
     */
    public setParameters(params?: Partial<IStageParameters>): this;
    public setQuality(value: RenderQualityType): void;

    /**
     * Set rock.
     *
     * @param flag If true start rocking and stop spinning.
     */
    public setRock(flag: boolean): void;

    /**
     * Set width and height.
     *
     * @param width CSS width value.
     * @param height CSS height value.
     */
    public setSize(width: string, height: string): void;

    /**
     * Set spin.
     *
     * @param flag If true start rocking and stop spinning.
     */
    public setSpin(flag: boolean): void;

    /**
     * Toggle fullscreen.
     */
    public toggleFullscreen(element: HTMLElement): void;

    /**
     * Toggle rock.
     */
    public toggleRock(): void;

    /**
     * Toggle spin.
     */
    public toggleSpin(): void;
  }

  export interface IStageLoadFileParams extends ILoaderParameters {
    defaultRepresentation: boolean;
  }
}
