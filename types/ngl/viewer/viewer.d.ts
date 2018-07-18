// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import {
    Box3,
    Color,
    Group,
    OrthographicCamera,
    PerspectiveCamera,
    Quaternion,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
  } from 'three';

  export type CameraType = 'perspective' | 'orthographic' | 'stereo';

  export interface IImageParameters {
    antialias: boolean;
    factor: number;
    onProgress: undefined | (() => void);
    transparent: boolean;
    trim: boolean;
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

  /**
   * Viewer class.
   *
   * @export
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
     * @param idOrElement DOM ID or Element.
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

    public getPositionOnCanvas(position: Vector3, optionalTarget?: Vector2): Vector2;
  }

  export class ViewerSignals {}
}
