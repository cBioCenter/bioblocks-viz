// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';
  import {
    Box3,
    Color,
    Group,
    Matrix4,
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
    public boundingBoxLength: number;
    public boundingBoxSize: Vector3;
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
    // tslint:disable-next-line:no-reserved-keywords
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
    public signals: ViewerControlSignals;
    public stage: Stage;
    public viewer: Viewer;

    // Getters.
    public position: Vector3;
    public rotation: Quaternion;

    constructor(stage: Stage);

    // Methods

    /**
     * Align scene to basis matrix/
     *
     * @param basis Basis matrix.
     */
    public align(basis: Matrix4 | number[]): void;

    /**
     * Apply rotation matrix to scene
     *
     * @param matrix Rotation matrix
     */
    public applyMatrix(matrix: Matrix4 | number[]): void;

    /**
     * Center scene.
     *
     * @param position Center position.
     */
    public center(position: Vector3 | number[]): void;

    /**
     * Trigger render and emit changed event.
     */
    public changed(): void;

    /**
     * Camera distance.
     *
     * @param z Distance.
     */
    public distance(z: number): void;

    public getCanvasScaleFactor(z?: number): number;

    /**
     * Get scene orientation.
     *
     * @param [optionalTarget] Pre-allocated target matrix.
     * @returns Scene orientation.
     */
    public getOrientation(optionalTarget?: Matrix4): any;

    public getPositionOnCanvas(position: Vector3, optionalTarget?: Vector2): Vector2;

    /**
     * Set scene orientation.
     *
     * @param [orientation] Scene orientation.
     */
    public orient(orientation?: Matrix4): void;

    /**
     * Rotate scene.
     *
     * @param quaternion Rotation quaternion.
     */
    public rotate(quaternion: Quaternion | number[]): void;

    /**
     * Spin scene on axis.
     *
     * @param axis Rotation axis.
     * @param angle Amount to spin.
     */
    public spin(axis: Vector3 | number[], angle: number): void;

    /**
     * Translate scene.
     *
     * @param vector Translation vector.
     */
    public translate(vector: Vector3 | number[]): void;

    /**
     * Zoom scene
     *
     * @param delta zoom change.
     */
    public zoom(delta: number): void;
  }

  export class ViewerSignals {
    public ticked: Signal;
  }

  export class ViewerControlSignals {
    public changed: Signal;
  }
}
