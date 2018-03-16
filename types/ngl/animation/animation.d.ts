// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Matrix4, Quaternion, Vector3 } from 'three';

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
}
